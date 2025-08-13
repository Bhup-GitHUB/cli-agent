# cli-agent

Minimal AI-powered CLI that can read/search files and, with explicit approval, create files and folders. Uses Google Generative AI via the `ai` SDK.

## Demo

[![Watch the demo](demo.gif)](demo.mp4)

If the GIF does not load or you need audio, open the video directly: [demo.mp4](demo.mp4)

## Features
- Minimal interactive or one-shot CLI
- Tools:
  - `read_file`: Read absolute path files (optional line range)
  - `grep`: Regex search with optional include pattern
  - `mkdir`: Create directories (requires ALLOW_WRITE)
  - `write_file`: Create/overwrite files (requires ALLOW_WRITE)
- Write-safety gate: Writing is blocked unless you include `ALLOW_WRITE` in your query
- Windows-friendly absolute paths (e.g., `D:\path\to\file.ts`)

## Requirements
- Node.js >= 20
- A Google Generative AI API key

## Installation
```bash
npm i
npm run build
```

## Configuration
Create a `.env` file in the project root (not committed) or set the env var in your shell:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```
See `.env.example` for reference. Never commit your real key.

## Usage
- Interactive:
```bash
npm start
# or from anywhere
node D:\course\Learning_Coding_Projects\Projects\cli-agent\dist\index.js
```
At the prompt `Query>`:
- Read/search only:
  - `search for TODO in D:\path\to\project include .*\.ts$`
  - `read D:\path\to\project\src\index.ts`
- Allow writes (requires explicit token):
  - `ALLOW_WRITE create minimal express app at D:\path\to\xyz` 

- One-shot:
```bash
node dist/index.js --query "search for 'TODO' in D:\\path\\to\\xyz include .*\\.ts$"
```

### Working on another folder
- Change directory first, or provide absolute paths in your queries. The agent respects absolute Windows paths and will operate there.

## Security and safety
- Secrets: `.env` is gitignored. Do not commit real API keys. Use `.env.example` to share the variable names.
- If a secret was ever committed, rotate/revoke it immediately and force-push a history rewrite if necessary.
- Write-safety: The agent will not create or modify files unless the latest message contains the exact token `ALLOW_WRITE`.
- Recommended: run it in a sandbox folder and review planned writes before enabling them.

## CLI flags (current)
- `--query <text>`: run a single query non-interactively

## Roadmap
- `--cwd` and `--allow-write` flags
- Better JSON extraction and loop guards
- Default grep ignore for node_modules/dist

## License
MIT 