# Claude Code Setup

This guide covers setting up `sui-move-analyzer` as an MCP server for [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's CLI coding agent.

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Configuration

Add the MCP server to your project-level Claude Code settings.

### Step 1: Create or Edit `.mcp.json`

In your Sui Move project root (where `Move.toml` is), create `.mcp.json`:

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

### Step 2: Verify

Launch Claude Code in your project directory:

```bash
cd /path/to/your/sui-project
claude
```

Claude Code will automatically start the MCP server. You can verify by asking:

```
What Sui Move packages are in this project?
```

Claude will use the `move_project_info` tool to list your packages.

## Global Configuration

To make the MCP server available across all projects, add it to `~/.claude/settings.json`:

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

## Custom Binary Path

If `sui-move-analyzer` is not in your PATH:

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

## Example Usage

Once configured, Claude Code can use the tools naturally:

- "Show me the outline of `sources/my_module.move`" - uses `move_file_outline`
- "What errors are in this file?" - uses `move_diagnostics`
- "Go to the definition of `transfer::public_transfer`" - uses `move_goto_definition`
- "Find all references to `AdminCap`" - uses `move_find_references`
- "What completions are available after `coin::`?" - uses `move_completions`

## Troubleshooting

### Server Not Starting

1. Verify the binary works:
   ```bash
   sui-move-analyzer --version
   ```

2. Test the MCP server directly:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | sui-move-analyzer --mcp --project-root .
   ```

3. Check that `Move.toml` exists in your project root.

### Tools Not Appearing

Run `/mcp` in Claude Code to see the status of connected MCP servers. If `sui-move-analyzer` shows an error, check the command path and arguments.

### Debug Logging

Add `--log-level debug` for verbose output (logs go to stderr):

```json
{
  "mcpServers": {
    "sui-move-analyzer": {
      "command": "sui-move-analyzer",
      "args": ["--mcp", "--project-root", ".", "--log-level", "debug"]
    }
  }
}
```
