import * as fs from "fs";
import * as path from "path";

export function readFileTool(
  opts: { absolutePath: string; startLine?: number; endLine?: number },
  rootPath: string
) {
  const { absolutePath, startLine, endLine } = opts;
  if (!path.isAbsolute(absolutePath))
    return {
      DisplayResult: "Fixing Issues",
      LLMresult: "File path must be absolute",
    };
  if (!fs.existsSync(absolutePath))
    return {
      DisplayResult: "Fixing Issues",
      LLMresult: `File does not exist: ${absolutePath}`,
    };
  const stat = fs.statSync(absolutePath);
  if (!stat.isFile())
    return {
      DisplayResult: "Fixing Issues",
      LLMresult: `Path is not a file: ${absolutePath}`,
    };

  const content = fs.readFileSync(absolutePath, "utf-8");
  if (startLine == null && endLine == null) {
    return {
      DisplayResult: "Reading " + path.relative(rootPath, absolutePath),
      LLMresult: content,
    };
  }
  if (startLine == null || endLine == null) {
    return {
      DisplayResult: "Fixing Issues",
      LLMresult: "Both startLine and endLine must be provided",
    };
  }
  const lines = content.split("\n");
  if (startLine < 1 || endLine < startLine || endLine > lines.length) {
    return { DisplayResult: "Fixing Issues", LLMresult: "Invalid line range" };
  }
  const out = lines.slice(startLine - 1, endLine).join("\n");
  return {
    DisplayResult: `Reading lines ${startLine}-${endLine}`,
    LLMresult: out,
  };
}
