# VS Code Setup

This guide covers setting up `sui-move-analyzer` with Visual Studio Code for Sui Move development.

## Prerequisites

- Visual Studio Code 1.75 or later
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Install the Extension

Install the **Sui Move Analyzer** extension from the VS Code Marketplace:

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` on macOS, `Ctrl+Shift+X` on Windows/Linux)
3. Search for **"Sui Move Analyzer"**
4. Click **Install**

Alternatively, install from the command line:

```bash
code --install-extension KlyntLabs.sui-move-lsp
```

That's it. Open a Sui Move project (with `Move.toml`) and the extension activates automatically.

## Configuration

Open VS Code Settings (`Cmd+,` on macOS, `Ctrl+,` on Windows/Linux) and search for "Sui Move Analyzer".

| Setting | Default | Description |
|---------|---------|-------------|
| `suiMoveAnalyzer.server.path` | `sui-move-analyzer` | Path to the language server binary |
| `suiMoveAnalyzer.server.logLevel` | `info` | Log level: `error`, `warn`, `info`, `debug`, `trace` |
| `suiMoveAnalyzer.trace.server` | `off` | LSP trace: `off`, `messages`, `verbose` |

### Custom Binary Path

If `sui-move-analyzer` is not on your PATH, set the full path in settings:

```json
{
  "suiMoveAnalyzer.server.path": "/path/to/sui-move-analyzer"
}
```

## Workspace Settings

For Sui Move projects, you can create a `.vscode/settings.json` in your project root:

```json
{
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "[move]": {
    "editor.tabSize": 4,
    "editor.insertSpaces": true
  }
}
```

## Keybindings

VS Code provides default keybindings for LSP features:

| Keybinding | Action |
|------------|--------|
| `F12` or `Ctrl+Click` | Go to definition |
| `Ctrl+Hover` | Show hover documentation |
| `Shift+F12` | Find references |
| `F2` | Rename symbol |
| `Ctrl+.` | Code actions |
| `F8` | Go to next diagnostic |
| `Shift+F8` | Go to previous diagnostic |

## Troubleshooting

### LSP Server Not Starting

1. Verify the binary is installed and in PATH:
   ```bash
   which sui-move-analyzer  # macOS/Linux
   where sui-move-analyzer  # Windows
   ```

2. Check the Output panel:
   - Open Output panel (`Ctrl+Shift+U`)
   - Select **"Sui Move Analyzer"** from the dropdown

3. Test the server manually:
   ```bash
   sui-move-analyzer --version
   ```

### No IntelliSense

1. Ensure `.move` files show **"Move"** as the language mode in the VS Code status bar
2. Verify your project has a `Move.toml` file at the workspace root
3. Reload the VS Code window: `Ctrl+Shift+P` > "Developer: Reload Window"

### Debug Logging

Enable debug logging to diagnose issues:

```json
{
  "suiMoveAnalyzer.server.logLevel": "debug",
  "suiMoveAnalyzer.trace.server": "verbose"
}
```

Check the **"Sui Move Analyzer"** and **"Sui Move Analyzer Trace"** channels in the Output panel.

For more troubleshooting tips, see the [Troubleshooting Guide](../troubleshooting.md).
