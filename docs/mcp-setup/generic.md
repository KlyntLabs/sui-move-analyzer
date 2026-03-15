# Generic MCP Client Setup

This guide covers setting up `sui-move-analyzer` with any MCP-compatible client. Use this if your AI tool supports MCP but isn't listed in the [platform-specific guides](./), or if you're building a custom integration.

## Server Command

The MCP server is built into the `sui-move-analyzer` binary. Start it with:

```bash
sui-move-analyzer --mcp --project-root /path/to/your/sui-project
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `--mcp` | Yes | Enable MCP server mode |
| `--project-root <PATH>` | No | **Absolute path** to the project directory to index (defaults to current directory). Relative paths are not supported and will cause a crash. MCP clients like Claude Code and Cursor resolve `.` to an absolute path automatically, so `.` works in `.mcp.json` configs. |
| `--log-level <LEVEL>` | No | Log verbosity: `error`, `warn`, `info`, `debug`, `trace` (default: `info`) |

## Protocol Details

- **Transport:** stdio (JSON-RPC 2.0, one message per line)
- **Protocol version:** `2024-11-05`
- **Capabilities:** `tools`

The server reads JSON-RPC requests from stdin (one per line) and writes responses to stdout. Logs go to stderr.

## Standard MCP Configuration

Most MCP clients use a JSON configuration like this:

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

Adapt the key names and structure to your specific client.

## Handshake Example

### 1. Initialize

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": { "name": "sui-move-analyzer", "version": "0.1.0" }
  }
}
```

### 2. Initialized Notification

```json
{"jsonrpc":"2.0","method":"notifications/initialized","params":{}}
```

No response (notification).

### 3. List Tools

```json
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

### 4. Call a Tool

```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"move_project_info","arguments":{}}}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [{ "type": "text", "text": "{\"packages\":[...],\"total_files\":544}" }]
  }
}
```

## Available Tools

| Tool | Required Arguments | Optional Arguments |
|------|-------------------|-------------------|
| `move_project_info` | (none) | |
| `move_file_outline` | `file_path` | |
| `move_goto_definition` | `file_path`, `line`, `column` | |
| `move_hover` | `file_path`, `line`, `column` | |
| `move_diagnostics` | `file_path` | `include_warnings` |
| `move_find_references` | `file_path`, `line`, `column` | `include_declaration` |
| `move_completions` | `file_path`, `line`, `column` | `max_items` |
| `move_rename` | `file_path`, `line`, `column`, `new_name` | |
| `move_open_file` | `file_path`, `content` | |

### Argument Types

- `file_path` — Absolute path to the `.move` file (e.g., `/home/user/project/sources/my_module.move`)
- `line` — 0-based line number (integer)
- `column` — 0-based column as a UTF-8 byte offset (integer)
- `content` — File content as a string (used by `move_open_file` to register in-memory files for analysis without writing to disk — useful for AI agents editing code before saving)
- `include_warnings`, `include_declaration` — Boolean flags (default: `false`)
- `max_items` — Integer limit on results
- `new_name` — String for the new symbol name

## Error Handling

Tool-level errors return a result with `isError: true`:

```json
{
  "result": {
    "content": [{ "type": "text", "text": "Error: File not indexed: /some/path.move" }],
    "isError": true
  }
}
```

Protocol-level errors use standard JSON-RPC error codes:

| Code | Meaning |
|------|---------|
| -32700 | Parse error (malformed JSON) |
| -32601 | Method not found |
| -32603 | Internal error |

## Building Custom Integrations

The MCP server is a standard stdio process. You can integrate it with any language:

```python
import subprocess
import json

proc = subprocess.Popen(
    ["sui-move-analyzer", "--mcp", "--project-root", "/path/to/project"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)

# Initialize
proc.stdin.write(json.dumps({
    "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}
}) + "\n")
proc.stdin.flush()
response = json.loads(proc.stdout.readline())

# Call a tool
proc.stdin.write(json.dumps({
    "jsonrpc": "2.0", "id": 2, "method": "tools/call",
    "params": {"name": "move_project_info", "arguments": {}}
}) + "\n")
proc.stdin.flush()
response = json.loads(proc.stdout.readline())
print(response)
```
