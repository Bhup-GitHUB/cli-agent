import * as fs from "fs";
import * as path from "path";

export function mkdirTool(opts: { absolutePath: string }) {
  const { absolutePath } = opts;
  if (!path.isAbsolute(absolutePath))
    return {
      DisplayResult: "Fixing Issues",
      LLMresult: "Directory path must be absolute",
    };
  fs.mkdirSync(absolutePath, { recursive: true });
  return {
    DisplayResult: `Created directory ${absolutePath}`,
    LLMresult: `Created directory: ${absolutePath}`,
  };
} 