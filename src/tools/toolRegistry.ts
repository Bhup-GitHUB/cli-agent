export const toolRegistry = [
  {
    name: "read_file",
    description: "Read a file by absolute path. Optional line range.",
    toolOptions: {
      absolutePath: { type: String },
      startLine: { type: Number },
      endLine: { type: Number },
    },
    required: ["absolutePath"],
    type: Object,
  },
  {
    name: "grep",
    description: "Regex search in files; optional include filter.",
    toolOptions: {
      pattern: { type: String },
      path: { type: String },
      include: { type: String },
    },
    required: ["pattern"],
    type: Object,
  },
];
