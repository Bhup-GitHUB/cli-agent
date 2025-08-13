import { LanguageModel, streamText } from "ai";
import { google } from "@ai-sdk/google";

export class LLM {
  private model: LanguageModel;
  constructor(modelName: string) {
    this.model = google(`models/${modelName}`);
  }

  async streamResponse(prompt: string) {
    const { textStream } = await streamText({ model: this.model, prompt });
    let full = "";
    for await (const part of textStream) {
      full += part;
      process.stdout.write(part);
    }
    return full;
  }
}
