# Sui Move Analyzer

Language server support for [Sui Move](https://docs.sui.io/concepts/sui-move-concepts) smart contract development in VS Code.

## Features

- **Code Completion** — Context-aware suggestions for modules, functions, types, and fields
- **Go to Definition** — Navigate to symbol definitions across your project
- **Find References** — Find all usages of functions, types, and variables
- **Hover Information** — View type signatures, documentation, and symbol details
- **Diagnostics** — Real-time error and warning detection
- **Rename** — Safely rename symbols across your project
- **Semantic Highlighting** — Enhanced syntax highlighting with semantic tokens
- **Inlay Hints** — Inline type annotations and parameter names
- **Code Actions** — Quick fixes for common issues

## Installation

### 1. Install this Extension

Install **Sui Move Analyzer** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=KlyntLabs.sui-move-analyzer).

### 2. Install the Language Server Binary

The extension will automatically prompt you to download the binary on first use. You can also install it manually:

```bash
# macOS (Apple Silicon)
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-aarch64-apple-darwin
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/

# macOS (Intel)
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-x86_64-apple-darwin
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/

# Linux (x86_64)
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-x86_64-unknown-linux-gnu
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/
```

See the [Installation Guide](https://github.com/KlyntLabs/sui-move-analyzer/blob/main/docs/installation.md) for all platforms.

### 3. Verify

```bash
sui-move-analyzer --version
```

Open a Sui Move project (with `Move.toml`) in VS Code — the extension activates automatically.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `suiMoveAnalyzer.server.path` | `sui-move-analyzer` | Path to the language server binary |
| `suiMoveAnalyzer.server.logLevel` | `info` | Log level: `error`, `warn`, `info`, `debug`, `trace` |
| `suiMoveAnalyzer.trace.server` | `off` | LSP trace: `off`, `messages`, `verbose` |

## Troubleshooting

If the extension fails to start, check:

1. The binary is installed and on PATH: `which sui-move-analyzer`
2. The Output panel (`View > Output > Sui Move Analyzer`) for error messages
3. Your project has a `Move.toml` at the workspace root

For more help, see the [Troubleshooting Guide](https://github.com/KlyntLabs/sui-move-analyzer/blob/main/docs/troubleshooting.md).

## Links

- [Project Repository](https://github.com/KlyntLabs/sui-move-analyzer)
- [Issue Tracker](https://github.com/KlyntLabs/sui-move-analyzer/issues)
- [Full Documentation](https://github.com/KlyntLabs/sui-move-analyzer/blob/main/docs/)

## License

Apache License 2.0
