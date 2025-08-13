#!/usr/bin/env node

import { program } from "commander";
import dotenv from "dotenv";
import readline from "node:readline";
import path from "node:path";
import { Processor } from "./processor";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

program
  .name("simple-ai")
  .description("Minimal AI coding CLI (read_file, grep)")
  .version("0.1.0")
  .option("-q, --query <text>", "one-shot query")
  .parse();

const opts = program.opts<{ query?: string }>();

async function run() {
  const rootDir = process.cwd();
  const p = new Processor(rootDir);

  if (opts.query) {
    await p.processQuery(opts.query);
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = () =>
    rl.question("Query> ", async (line) => {
      const q = line.trim();
      if (!q || q.toLowerCase() === "exit") {
        rl.close();
        process.exit(0);
      }
      await p.processQuery(q);
      ask();
    });
  ask();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
