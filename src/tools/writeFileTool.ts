import * as fs from "fs";
import * as path from "path";

export function writeFileTool(opts: { absolutePath: string; content: string }) {
  const { absolutePath, content } = opts;
  if (!path.isAbsolute(absolutePath))
    return {
      DisplayResult: "Fixing Issues",
      LLMresult: "File path must be absolute",
    };
  const dir = path.dirname(absolutePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content, "utf-8");
  return {
    DisplayResult: `Wrote file ${absolutePath}`,
    LLMresult: `Wrote file: ${absolutePath}`,
  };
} 