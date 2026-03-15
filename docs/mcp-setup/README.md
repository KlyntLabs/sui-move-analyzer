# MCP Server Setup

`sui-move-analyzer` includes an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that gives AI coding assistants deep understanding of your Sui Move codebase. Instead of treating your Move code as plain text, AI agents can use the same analysis engine that powers the LSP — navigating definitions, finding references, checking errors, and understanding your project structure.

## Prerequisites

- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))
- A Sui Move project with `Move.toml`

## Available Tools

The MCP server exposes 9 tools for codebase analysis:

| Tool | Description |
|------|-------------|
| `move_project_info` | List all indexed packages, dependencies, and file counts |
| `move_file_outline` | Get the full symbol outline of a `.move` file (structs, functions, constants, enums) |
| `move_goto_definition` | Jump to the definition of a symbol at a given position |
| `move_hover` | Get type signatures and doc comments for a symbol |
| `move_diagnostics` | Get errors and warnings for a file |
| `move_find_references` | Find all usages of a symbol across the project |
| `move_completions` | Get code completion suggestions at a position |
| `move_rename` | Compute rename edits for a symbol (does not write to disk) |
| `move_open_file` | Register in-memory file content for analysis |

## Platform Guides

| Platform | Guide | Notes |
|----------|-------|-------|
| Claude Code | [Setup](claude-code.md) | Anthropic's CLI coding agent |
| Claude Desktop | [Setup](claude-desktop.md) | Anthropic's desktop app |
| Cursor | [Setup](cursor.md) | Marketplace integration coming soon |
| VS Code + Copilot | [Setup](vscode-copilot.md) | GitHub Copilot agent mode |
| Windsurf | [Setup](windsurf.md) | Marketplace integration coming soon |
| Other MCP Clients | [Setup](generic.md) | Any MCP-compatible client |

## Quick Test

Verify the MCP server works:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | sui-move-analyzer --mcp --project-root /path/to/your/project
```

You should see a JSON response with `protocolVersion`, `capabilities`, and `serverInfo`.

## How It Works

The MCP server:

1. Discovers all `Move.toml` packages under the project root
2. Indexes all source files into an in-memory analysis database
3. Reads JSON-RPC requests from stdin, one per line
4. Returns JSON-RPC responses to stdout

This is the same analysis engine used by the LSP server, so you get identical accuracy for go-to-definition, diagnostics, completions, and all other features.
