# Claude Desktop Setup

This guide covers setting up `sui-move-analyzer` as an MCP server for [Claude Desktop](https://claude.ai/download), Anthropic's desktop application.

## Prerequisites

- Claude Desktop installed
- `sui-move-analyzer` installed ([Installation Guide](../installation.md))

## Configuration

### Step 1: Open Claude Desktop Settings

1. Open Claude Desktop
2. Go to **Settings** (gear icon or `Cmd+,` on macOS)
3. Navigate to **Developer** > **Edit Config**

This opens `claude_desktop_config.json`.

### Step 2: Add the MCP Server

Add `sui-move-analyzer` to the `mcpServers` section:

```json
{
  "mcpServers": {
    "sui-move-analyzer": {
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", "/path/to/your/sui-project"]
    }
  }
}
```

Replace `/path/to/your/sui-project` with the absolute path to your Sui Move project directory (the one containing `Move.toml`).

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop for the configuration to take effect.

## Configuration File Location

The config file is located at:

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

## Multiple Projects

To work with multiple Sui Move projects, add separate server entries:

```json
{
  "mcpServers": {
    "sui-move-project-a": {
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", "/path/to/project-a"]
    },
    "sui-move-project-b": {
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", "/path/to/project-b"]
    }
  }
}
```

## Custom Binary Path

If `sui-move-analyzer` is not on your system PATH, use the full path to the binary:

```json
{
  "mcpServers": {
    "sui-move-analyzer": {
      "command": "/usr/local/bin/sui-move-analyzer",
      "args": ["--mcp", "--project-root", "/path/to/your/sui-project"]
    }
  }
}
```

## Example Usage

Once configured, you can ask Claude about your Sui Move code in natural language. Claude will automatically use the right MCP tools behind the scenes:

- "What modules and structs are defined in `sources/my_contract.move`?"
- "Are there any errors in my Move code?"
- "Where is `AdminCap` defined?"
- "Find all places that call `transfer::public_transfer`"
- "Help me understand the structure of this project"

## Troubleshooting

### Server Not Connecting

1. Verify the binary works:
   ```bash
   sui-move-analyzer --version
   ```

2. Ensure the `--project-root` path is absolute and contains a `Move.toml`.

3. Check Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`

### Tools Not Showing

After editing the config, you must restart Claude Desktop. The MCP server tools should appear as available tool icons in the chat interface.
