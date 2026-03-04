# Windsurf Setup

This guide covers setting up `sui-move-analyzer` as an MCP server for [Windsurf](https://codeium.com/windsurf), Codeium's AI code editor.

## Prerequisites

- Windsurf installed
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Configuration

### Step 1: Open MCP Configuration

1. Open Windsurf
2. Go to **Windsurf Settings** > **Cascade** > **MCP Servers**
3. Click **"Add Server"** or edit the configuration file directly

The config file is located at `~/.codeium/windsurf/mcp_config.json`.

### Step 2: Add the MCP Server

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

### Step 3: Restart Windsurf

Close and reopen Windsurf for the changes to take effect. The server should appear in the MCP settings panel.

## Using with Cascade

Once configured, Windsurf's Cascade AI can use the MCP tools:

- Ask about code structure in the chat panel
- Use Cascade to analyze errors and suggest fixes
- Generate Move code with awareness of your project's types and modules

Examples:

- "List all the structs in my contract" - uses `move_file_outline`
- "Check for errors in `sources/my_module.move`" - uses `move_diagnostics`
- "Where is the `transfer` function defined?" - uses `move_goto_definition`

## Troubleshooting

### Server Not Connecting

1. Verify the binary:
   ```bash
   sui-move-analyzer --version
   ```

2. Ensure your project has a `Move.toml` file.

3. Check the MCP server status in Windsurf Settings > Cascade > MCP Servers.

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
