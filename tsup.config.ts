import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  clean: true,
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  ...options,
}));
