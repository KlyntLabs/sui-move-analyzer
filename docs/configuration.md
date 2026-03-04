# Configuration Reference

This document provides a complete reference for `sui-move-analyzer` command-line arguments and server capabilities.

## Command-Line Arguments

### `--stdio` (default)

Run in stdio mode. The server communicates via stdin/stdout using JSON-RPC messages. This is the standard LSP communication mode used by most editors.

```bash
sui-move-analyzer --stdio
```

This is the default mode if no communication mode is specified:

```bash
sui-move-analyzer  # Equivalent to --stdio
```

### `--tcp <PORT>`

Run in TCP mode on the specified port. The server listens for connections on the specified TCP port. Useful for remote development scenarios or debugging.

```bash
sui-move-analyzer --tcp 9000
```

**Port range:** 1-65535

**Note:** Ports below 1024 require elevated privileges (root/administrator) on most systems.

The `--tcp` and `--stdio` flags are mutually exclusive.

### `--mcp`

Run as an MCP (Model Context Protocol) server for AI assistant integration. Exposes IDE features as MCP tools via JSON-RPC over stdin/stdout.

```bash
sui-move-analyzer --mcp --project-root /path/to/sui-project
```

The `--mcp` flag is mutually exclusive with `--stdio` and `--tcp`.

See the [MCP Setup Guide](mcp-setup/) for platform-specific configuration.

### `--project-root <PATH>`

Set the project root directory for MCP mode. The server discovers and indexes all `Move.toml` packages under this directory.

```bash
sui-move-analyzer --mcp --project-root /path/to/sui-project
```

**Requires:** `--mcp`

**Default:** Current working directory (if `--mcp` is used without `--project-root`)

### `--log-level <LEVEL>`

Set logging verbosity level. Logs are written to stderr to avoid interfering with LSP communication.

```bash
sui-move-analyzer --log-level debug
```

**Available levels (from least to most verbose):**

| Level | Description |
|-------|-------------|
| `error` | Only error messages |
| `warn` | Warnings and errors |
| `info` | Informational messages, warnings, and errors (default) |
| `debug` | Debug information and all above |
| `trace` | Trace-level information (most verbose) |

**Default:** `info`

The `trace` level includes very detailed diagnostic output such as document sync notifications. Use sparingly as this generates significant output.

### `--version`

Print version information and exit.

```bash
sui-move-analyzer --version
```

### `--help`

Print help information and exit.

```bash
sui-move-analyzer --help
```

## Example Configurations

### Default (stdio, info logging)

```bash
sui-move-analyzer
```

### Debug logging for troubleshooting

```bash
sui-move-analyzer --log-level debug
```

### TCP mode for remote development

```bash
sui-move-analyzer --tcp 9000 --log-level info
```

### Minimal logging for production

```bash
sui-move-analyzer --log-level error
```

### MCP mode for AI assistants

```bash
sui-move-analyzer --mcp --project-root /path/to/sui-project
```

### MCP mode with debug logging

```bash
sui-move-analyzer --mcp --project-root . --log-level debug
```

## Server Capabilities

During the LSP initialize handshake, the server advertises the following capabilities:

### Text Document Synchronization

- **Mode:** Full document sync
- **Description:** The entire document content is sent on each change

### Completion

- **Trigger characters:** `:`, `.`
- **Description:** Auto-completion for module paths (triggered by `:`) and struct fields/methods (triggered by `.`)

### Hover

- **Description:** Shows type information, documentation, and signatures when hovering over symbols

### Go to Definition

- **Description:** Navigate to the definition of functions, types, constants, and other symbols

### Find References

- **Description:** Find all references to a symbol across the project

### Rename

- **Prepare support:** Yes
- **Description:** Rename symbols with project-wide updates. The client can call `textDocument/prepareRename` to validate the rename before applying it.

### Semantic Tokens

- **Full support:** Yes
- **Range support:** Yes
- **Description:** Provides semantic syntax highlighting for keywords, types, functions, variables, and more

### Diagnostics

- **Mode:** Pull-based (LSP 3.17)
- **Inter-file dependencies:** Yes
- **Description:** Client requests diagnostics via `textDocument/diagnostic`. Server notifies client to refresh via `workspace/diagnosticRefresh`.

### Inlay Hints

- **Description:** Shows inline hints for type annotations, parameter names, etc.

### Code Actions

- **Supported kinds:** Quick Fix
- **Description:** Provides quick fixes for diagnostics (e.g., add missing imports)

## MCP Tools (AI Assistant Mode)

When running in MCP mode (`--mcp`), the server exposes these tools:

| Tool | Description |
|------|-------------|
| `move_project_info` | List indexed packages, dependencies, and file counts |
| `move_file_outline` | Symbol outline of a `.move` file (structs, functions, constants, enums) |
| `move_goto_definition` | Find the definition of a symbol at a position |
| `move_hover` | Get type signatures and documentation for a symbol |
| `move_diagnostics` | Get errors and warnings for a file |
| `move_find_references` | Find all usages of a symbol across the project |
| `move_completions` | Get code completion suggestions at a position |
| `move_rename` | Compute rename edits (does not write to disk) |
| `move_open_file` | Register in-memory file content for analysis |

See the [MCP Setup Guide](mcp-setup/) for configuration details per platform.

## Project Detection

The language server automatically detects Sui Move projects by looking for a `Move.toml` file in the workspace. The project root is determined by:

1. The workspace folder sent during initialization
2. The directory containing the `Move.toml` file

If no `Move.toml` is found, basic editing features will still work but project-wide features (like cross-file navigation) may be limited.

## See Also

- [Installation Guide](installation.md)
- [Troubleshooting Guide](troubleshooting.md)
- [Editor Setup Guides](editor-setup/)
- [MCP Setup Guides](mcp-setup/)
