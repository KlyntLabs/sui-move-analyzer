# MCP Server Setup

`sui-move-analyzer` includes an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that exposes Sui Move IDE features as tools for AI assistants. This allows AI coding agents to navigate, analyze, and understand your Sui Move codebase.

## Prerequisites

- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))
- A Sui Move project with `Move.toml`

## Available Tools

The MCP server exposes 9 tools:

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

- **[Claude Code](claude-code.md)** - Anthropic's CLI coding agent
- **[Claude Desktop](claude-desktop.md)** - Anthropic's desktop app
- **[Cursor](cursor.md)** - AI-native code editor
- **[VS Code + Copilot](vscode-copilot.md)** - GitHub Copilot agent mode
- **[Windsurf](windsurf.md)** - Codeium's AI editor
- **[Other MCP Clients](generic.md)** - Any MCP-compatible client

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
