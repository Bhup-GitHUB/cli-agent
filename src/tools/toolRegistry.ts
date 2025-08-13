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
  {
    name: "write_file",
    description: "Write a file to an absolute path; creates parent directories if needed.",
    toolOptions: {
      absolutePath: { type: String },
      content: { type: String },
    },
    required: ["absolutePath", "content"],
    type: Object,
  },
  {
    name: "mkdir",
    description: "Create a directory recursively at an absolute path.",
    toolOptions: {
      absolutePath: { type: String },
    },
    required: ["absolutePath"],
    type: Object,
  },
];
