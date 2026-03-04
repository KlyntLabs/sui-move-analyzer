# Sui Move Analyzer

A language server (LSP) and MCP server for [Sui Move](https://docs.sui.io/concepts/sui-move-concepts) smart contract development.

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
- **MCP Server** — AI assistant integration for deep codebase understanding

## Installation

### Pre-built Binaries

Download the latest binary for your platform from the [Releases](https://github.com/KlyntLabs/sui-move-analyzer/releases) page.

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

# Linux (ARM64)
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-aarch64-unknown-linux-gnu
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/
```

For Windows, download `sui-move-analyzer-x86_64-pc-windows-msvc.exe` from the [Releases](https://github.com/KlyntLabs/sui-move-analyzer/releases) page.

### VS Code Extension

Install the **Sui Move Analyzer** extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=KlyntLabs.sui-move-analyzer). The extension will offer to download the language server binary automatically.

## Editor Setup

The language server works with any LSP-compatible editor:

- **VS Code** — Install the [Sui Move Analyzer](https://marketplace.visualstudio.com/items?itemName=KlyntLabs.sui-move-analyzer) extension
- **Neovim** — Configure via nvim-lspconfig
- **Helix** — Native LSP support
- **Sublime Text, Emacs, Zed** — Any editor with LSP client support

## MCP Server (AI Assistant Integration)

The same binary runs as an MCP server for AI coding assistants:

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

Compatible with Claude Code, Claude Desktop, Cursor, VS Code Copilot, Windsurf, and other MCP clients.

## Issues

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/KlyntLabs/sui-move-analyzer/issues).

## License

Apache License 2.0
