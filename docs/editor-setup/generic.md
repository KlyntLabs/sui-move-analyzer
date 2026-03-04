# Generic LSP Client Setup

This guide provides information for setting up `sui-move-analyzer` with any LSP-compatible editor or client.

## LSP Protocol Overview

The Language Server Protocol (LSP) standardizes communication between editors and language servers. `sui-move-analyzer` implements LSP 3.17 and supports two communication modes:

### Stdio Mode (Default)

The server communicates via stdin/stdout using JSON-RPC messages. This is the most common and recommended mode.

```bash
sui-move-analyzer
# or explicitly
sui-move-analyzer --stdio
```

### TCP Mode

The server listens for connections on a specified TCP port. Useful for remote development or debugging.

```bash
sui-move-analyzer --tcp 9000
```

Connect your client to `localhost:9000` (or the appropriate host:port).

## Command-Line Reference

| Argument | Description | Default |
|----------|-------------|---------|
| `--stdio` | Use stdin/stdout for communication | Yes (default) |
| `--tcp <PORT>` | Listen on TCP port (1-65535) | - |
| `--log-level <LEVEL>` | Set logging verbosity | `info` |
| `--version` | Print version and exit | - |
| `--help` | Print help and exit | - |

**Log levels:** `error`, `warn`, `info`, `debug`, `trace`

## Server Capabilities

The server advertises these capabilities during initialization:

```json
{
  "capabilities": {
    "textDocumentSync": {
      "openClose": true,
      "change": 1
    },
    "completionProvider": {
      "triggerCharacters": [":", "."],
      "resolveProvider": false
    },
    "hoverProvider": true,
    "definitionProvider": true,
    "referencesProvider": true,
    "renameProvider": {
      "prepareProvider": true
    },
    "semanticTokensProvider": {
      "full": true,
      "range": true,
      "legend": { ... }
    },
    "diagnosticProvider": {
      "interFileDependencies": true,
      "workspaceDiagnostics": false
    },
    "inlayHintProvider": {
      "resolveProvider": false
    },
    "codeActionProvider": {
      "codeActionKinds": ["quickfix"]
    }
  }
}
```

### Supported LSP Methods

| Method | Description |
|--------|-------------|
| `initialize` | Server initialization |
| `textDocument/didOpen` | Document opened |
| `textDocument/didChange` | Document changed |
| `textDocument/didClose` | Document closed |
| `textDocument/completion` | Auto-completion |
| `textDocument/hover` | Hover information |
| `textDocument/definition` | Go to definition |
| `textDocument/references` | Find references |
| `textDocument/rename` | Rename symbol |
| `textDocument/prepareRename` | Validate rename |
| `textDocument/semanticTokens/full` | Full semantic tokens |
| `textDocument/semanticTokens/range` | Range semantic tokens |
| `textDocument/diagnostic` | Pull diagnostics |
| `textDocument/inlayHint` | Inlay hints |
| `textDocument/codeAction` | Code actions |

## Configuration Template

Use this template as a starting point for configuring your editor:

```json
{
  "languageServer": {
    "name": "sui-move-analyzer",
    "command": "sui-move-analyzer",
    "args": [],
    "fileTypes": ["move"],
    "rootPatterns": ["Move.toml", ".git"],
    "initializationOptions": {}
  }
}
```

### Key Configuration Points

1. **Command:** `sui-move-analyzer` (must be in PATH)
2. **File types:** Associate `.move` files with the Move language
3. **Root detection:** Look for `Move.toml` to identify project root
4. **Transport:** stdio (default) or TCP

## Initialization Parameters

The server accepts standard LSP initialization parameters:

```json
{
  "processId": 12345,
  "rootUri": "file:///path/to/project",
  "capabilities": {
    "textDocument": {
      "completion": { ... },
      "hover": { ... },
      "semanticTokens": { ... }
    }
  }
}
```

The `rootUri` should point to the directory containing `Move.toml`.

## Editor-Specific Resources

### Sublime Text

Use [LSP](https://packagecontrol.io/packages/LSP) package:

1. Install the LSP package
2. Add to LSP settings (`Preferences > Package Settings > LSP > Settings`):

```json
{
  "clients": {
    "sui-move-analyzer": {
      "enabled": true,
      "command": ["sui-move-analyzer"],
      "selector": "source.move",
      "schemes": ["file"]
    }
  }
}
```

3. Create syntax definition for Move files or install a Move syntax package

### Emacs

Use [lsp-mode](https://emacs-lsp.github.io/lsp-mode/) or [eglot](https://github.com/joaotavora/eglot):

**With lsp-mode:**

```elisp
(use-package lsp-mode
  :commands lsp
  :hook (move-mode . lsp))

(add-to-list 'lsp-language-id-configuration '(move-mode . "move"))

(lsp-register-client
  (make-lsp-client
    :new-connection (lsp-stdio-connection "sui-move-analyzer")
    :major-modes '(move-mode)
    :server-id 'sui-move-analyzer))
```

**With eglot:**

```elisp
(add-to-list 'eglot-server-programs
             '(move-mode . ("sui-move-analyzer")))
```

### Zed

Zed has built-in LSP support. Add to your settings:

```json
{
  "languages": {
    "Move": {
      "language_servers": ["sui-move-analyzer"]
    }
  },
  "lsp": {
    "sui-move-analyzer": {
      "binary": {
        "path": "sui-move-analyzer"
      }
    }
  }
}
```

### Kate/KTextEditor

Use the LSP Client plugin:

1. Enable LSP Client plugin in Kate settings
2. Add to `~/.config/kate/lspclient/settings.json`:

```json
{
  "servers": {
    "move": {
      "command": ["sui-move-analyzer"],
      "root": ["Move.toml", ".git"],
      "highlightingModeRegex": "^Move$"
    }
  }
}
```

### Other Editors

For editors not listed here, consult the editor's documentation for:

1. **LSP client configuration** - How to add a new language server
2. **File type associations** - How to associate `.move` files
3. **Root detection** - How to configure workspace root patterns

Most modern editors support LSP either natively or through plugins.

## Debugging Connection Issues

### Test Server Manually

1. Start the server:
   ```bash
   sui-move-analyzer 2>/tmp/sui-move-analyzer.log
   ```

2. Send an initialize request via stdin:
   ```json
   {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"processId":null,"rootUri":"file:///path/to/project","capabilities":{}}}
   ```

3. Check `/tmp/sui-move-analyzer.log` for errors

### Common Issues

1. **Server not found:** Ensure `sui-move-analyzer` is in PATH
2. **Permission denied:** Check binary has execute permission
3. **No response:** Ensure JSON-RPC messages are properly formatted
4. **Connection refused (TCP):** Server may not be running or port is wrong

### Enable Debug Logging

```bash
sui-move-analyzer --log-level debug 2>/tmp/sui-move-analyzer.log
```

Check the log file for detailed diagnostic information.

## See Also

- [Configuration Reference](../configuration.md) - Complete CLI argument documentation
- [Troubleshooting Guide](../troubleshooting.md) - Common issues and solutions
- [LSP Specification](https://microsoft.github.io/language-server-protocol/) - Official LSP documentation
