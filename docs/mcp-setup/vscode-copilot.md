# VS Code + GitHub Copilot Setup

This guide covers setting up `sui-move-analyzer` as an MCP server for [GitHub Copilot agent mode](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) in Visual Studio Code.

## Prerequisites

- VS Code 1.99 or later
- GitHub Copilot extension installed and active
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Configuration

### Step 1: Create MCP Configuration

In your Sui Move project root, create `.vscode/mcp.json`:

```json
{
  "servers": {
    "sui-move-analyzer": {
      "type": "stdio",
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", "."]
    }
  }
}
```

### Step 2: Verify

1. Open your Sui Move project in VS Code
2. Open the Copilot chat panel (`Ctrl+Shift+I` or `Cmd+Shift+I`)
3. Switch to **Agent** mode (click the mode selector at the top of the chat)
4. You should see `sui-move-analyzer` tools listed as available

## User-Level Configuration

To make the server available across all VS Code workspaces, add it to your user settings (`settings.json`):

```json
{
  "mcp": {
    "servers": {
      "sui-move-analyzer": {
        "type": "stdio",
        "command": "sui-move-analyzer",
        "args": ["--mcp", "--project-root", "."]
      }
    }
  }
}
```

## LSP + MCP Together

For the complete experience, use both:

1. **LSP extension** - Install the [Sui Move Analyzer](../editor-setup/vscode.md) extension for real-time editor features (inline diagnostics, autocomplete, hover, go-to-definition)
2. **MCP server** - Configure as above for Copilot agent mode (chat-based analysis, code generation with Move awareness)

They complement each other: the LSP extension powers your direct editing experience, while the MCP server gives Copilot deep understanding of your Move codebase.

## Example Usage

In Copilot agent mode, you can ask:

- "What packages are in this Sui Move project?" - uses `move_project_info`
- "Show me the outline of `sources/my_module.move`" - uses `move_file_outline`
- "Are there any errors in my contract?" - uses `move_diagnostics`
- "Find where `AdminCap` is used" - uses `move_find_references`
- "What happens if I rename `my_function` to `process_request`?" - uses `move_rename`

## Troubleshooting

### Tools Not Appearing in Agent Mode

1. Ensure you are in **Agent** mode, not Ask or Edit mode
2. Check that `.vscode/mcp.json` is in the workspace root
3. Reload the window: `Ctrl+Shift+P` > "Developer: Reload Window"
4. Verify the binary:
   ```bash
   sui-move-analyzer --version
   ```

### Custom Binary Path

```json
{
  "servers": {
    "sui-move-analyzer": {
      "type": "stdio",
      "command": "/path/to/sui-move-analyzer",
      "args": ["--mcp", "--project-root", "."]
    }
  }
}
```

### Debug Logging

Add `--log-level debug` to see verbose server output in the Output panel:

```json
{
  "servers": {
    "sui-move-analyzer": {
      "type": "stdio",
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", ".", "--log-level", "debug"]
    }
  }
}
```
