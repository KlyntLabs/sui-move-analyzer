# Cursor Setup

This guide covers setting up `sui-move-analyzer` as an MCP server for [Cursor](https://cursor.com), the AI-native code editor.

## Prerequisites

- Cursor installed
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Configuration

### Step 1: Open MCP Settings

1. Open Cursor
2. Go to **Settings** (`Cmd+,` on macOS, `Ctrl+,` on Windows/Linux)
3. Search for **"MCP"** or navigate to **Features** > **MCP Servers**

### Step 2: Add the MCP Server

Click **"Add new MCP server"** and configure:

- **Name:** `sui-move-analyzer`
- **Type:** `command`
- **Command:** `sui-move-analyzer --mcp --project-root .`

Alternatively, create or edit `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "sui-move-analyzer": {
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", "."]
    }
  }
}
```

### Step 3: Verify

Open a Sui Move project in Cursor. In the MCP settings panel, `sui-move-analyzer` should show a green status indicator. You can also check by opening the Cursor chat and asking about your Move code.

## Global Configuration

To make the server available across all Cursor workspaces, add it to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sui-move-analyzer": {
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", "."]
    }
  }
}
```

## Using with Cursor Agent

Once configured, Cursor's AI agent can use the MCP tools when you:

- Ask questions about your Sui Move code in the chat panel
- Use Composer mode to generate or modify Move code
- Request code reviews or error analysis

Examples:

- "What structs are defined in this file?" - uses `move_file_outline`
- "Check this file for errors" - uses `move_diagnostics`
- "Where is this function defined?" - uses `move_goto_definition`
- "What functions are available in the `coin` module?" - uses `move_completions`

## LSP + MCP Together

Cursor supports both LSP and MCP simultaneously. For the best experience, use both:

1. **LSP (editor features):** Since Cursor is built on VS Code, the [Sui Move Analyzer VS Code extension](../editor-setup/vscode.md) works in Cursor. Install it via Extensions (`Cmd+Shift+X`) and search "Sui Move Analyzer". This gives you real-time diagnostics, completions, hover, and go-to-definition.
2. **MCP (AI features):** Configure as described above. This gives Cursor's AI agent (chat, Composer) deep understanding of your Move codebase.

Each runs as a separate process — the LSP extension handles your direct editing, while the MCP server powers AI-assisted analysis.

## Troubleshooting

### Server Shows Red Status

1. Verify the binary:
   ```bash
   sui-move-analyzer --version
   ```

2. Test the MCP server:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | sui-move-analyzer --mcp --project-root .
   ```

3. Ensure your project has a `Move.toml` file.

### Agent Not Using Tools

Make sure the MCP server status is green in Settings > MCP Servers. If Cursor's agent mode is not enabled, enable it in Settings > Features.

### Custom Binary Path

```json
{
  "mcpServers": {
    "sui-move-analyzer": {
      "command": "/path/to/sui-move-analyzer",
      "args": ["--mcp", "--project-root", "."]
    }
  }
}
```

## Marketplace (Coming Soon)

We're working on a native Cursor marketplace integration so you can install the MCP server directly from Cursor without manual configuration. For now, follow the manual setup above.
