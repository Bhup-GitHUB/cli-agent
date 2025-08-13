import * as fs from "fs";
import * as path from "path";

export async function grepTool(opts: {
  pattern: string;
  path?: string;
  include?: string;
}) {
  const searchPath = opts.path ? path.resolve(opts.path) : process.cwd();
  const includeRegex = opts.include ? new RegExp(opts.include) : null;
  const regex = new RegExp(opts.pattern);
  const matches: string[] = [];

  function searchFile(filePath: string) {
    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    lines.forEach((line, idx) => {
      if (regex.test(line)) matches.push(`${filePath}:${idx + 1}: ${line}`);
    });
  }
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (!includeRegex || includeRegex.test(entry.name)) searchFile(full);
    }
  }

  const stat = fs.statSync(searchPath);
  if (stat.isFile()) {
    if (!includeRegex || includeRegex.test(path.basename(searchPath)))
      searchFile(searchPath);
  } else if (stat.isDirectory()) walk(searchPath);

  return matches.length
    ? {
        LLMresult: matches.join("\n"),
        DisplayResult: `Found ${matches.length} match(es)`,
      }
    : { LLMresult: "No matches found.", DisplayResult: "No matches found" };
}
