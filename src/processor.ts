import { LLM } from "./llm";
import { toolRegistry } from "./tools/toolRegistry";
import { validateAndRunToolCall } from "./tools/toolValidator";
import { BASE_PROMPT, TOOL_SELECTION_PROMPT } from "./prompt";

export class Processor {
  private llm: LLM;
  private rootDir: string;
  private history: Array<{ role: "user" | "model"; content: string }> = [];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.llm = new LLM("gemini-2.5-flash");
  }

  private buildPrompt() {
    const recent = this.history
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");
    const latestUser = [...this.history].reverse().find((m) => m.role === "user")?.content ?? "";
    return [
      BASE_PROMPT,
      `CWD: ${this.rootDir}`,
      `LatestUser: ${latestUser}`,
      `Tools:\n${JSON.stringify(toolRegistry)}`,
      recent ? `--- Recent ---\n${recent}` : "",
      TOOL_SELECTION_PROMPT,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  private isFinalMessage(obj: any) {
    return (
      !Array.isArray(obj) && obj && typeof obj === "object" && "text" in obj
    );
  }

  async processQuery(query: string) {
    this.history.push({ role: "user", content: query });
    const allowWrite = /\bALLOW_WRITE\b/i.test(query);
    while (true) {
      const response = await this.llm.streamResponse(this.buildPrompt());
      let toolCalls: any;
      try {
        let clean = response.trim();
        if (clean.startsWith("```") )
          clean = clean
            .replace(/^```[a-zA-Z]*\n?/, "")
            .replace(/```$/, "")
            .trim();
        if (clean.startsWith("```json"))
          clean = clean
            .replace(/^```json\n?/, "")
            .replace(/```$/, "")
            .trim();
        toolCalls = JSON.parse(clean);
        if (this.isFinalMessage(toolCalls)) {
          console.log("\n" + toolCalls.text);
          break;
        }
        if (typeof toolCalls === "string") toolCalls = JSON.parse(toolCalls);
      } catch {
        console.log("\nDone.");
        break;
      }

      for (const call of toolCalls) {
        if (call && typeof call === "object" && "tool" in call) {
          if (!allowWrite && (call.tool === "write_file" || call.tool === "mkdir")) {
            this.history.push({
              role: "model",
              content: `Write disabled. Re-run your request including the token ALLOW_WRITE to enable writing. Blocked: ${JSON.stringify(call)}`,
            });
            continue;
          }
          try {
            const res = await validateAndRunToolCall(call, this.rootDir);
            const text = res.success
              ? res.result?.LLMresult ?? ""
              : `[ERROR] ${res.error}`;
            this.history.push({
              role: "model",
              content: `Output of ${JSON.stringify(call)}:\n${text}`,
            });
          } catch (e: any) {
            this.history.push({
              role: "model",
              content: `[AGENT ERROR] ${e?.message || String(e)}`,
            });
          }
        }
      }
    }
  }
}
