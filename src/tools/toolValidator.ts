import { z } from "zod";
import { readFileTool } from "./readFileTool";
import { grepTool } from "./grepTool";

export const ReadFileSchema = z.object({
  tool: z.literal("read_file"),
  toolOptions: z.object({
    absolutePath: z.string().min(1),
    startLine: z.number().int().positive().optional(),
    endLine: z.number().int().positive().optional(),
  }),
});

export const GrepSchema = z.object({
  tool: z.literal("grep"),
  toolOptions: z.object({
    pattern: z.string().min(1),
    path: z.string().optional(),
    include: z.string().optional(),
  }),
});

export type ToolCall =
  | z.infer<typeof ReadFileSchema>
  | z.infer<typeof GrepSchema>;

export async function validateAndRunToolCall(
  jsonData: unknown,
  rootPath: string
) {
  if (!jsonData || typeof jsonData !== "object" || !("tool" in jsonData)) {
    return { success: false, error: "Invalid tool call" } as const;
  }
  const data = jsonData as any;

  if (data.tool === "read_file") {
    const p = ReadFileSchema.safeParse(data);
    if (!p.success) return { success: false, error: p.error.message } as const;
    const result = readFileTool(p.data.toolOptions, rootPath);
    return { success: true, result } as const;
  }

  if (data.tool === "grep") {
    const p = GrepSchema.safeParse(data);
    if (!p.success) return { success: false, error: p.error.message } as const;
    const result = await grepTool(p.data.toolOptions);
    return { success: true, result } as const;
  }

  return { success: false, error: `Unknown tool: ${data.tool}` } as const;
}
