# sui-move-analyzer

A Language Server Protocol (LSP) implementation for [Sui Move](https://docs.sui.io/concepts/sui-move-concepts), providing IDE features and AI assistant integration for Sui Move smart contract development.

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
- **MCP Server** — AI assistant integration with 9 tools for deep codebase analysis

## Quick Start

### 1. Install the Language Server

Download the pre-built binary for your platform from [Releases](https://github.com/KlyntLabs/sui-move-analyzer/releases):

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

**Windows:** Download `sui-move-analyzer-x86_64-pc-windows-msvc.exe` from [Releases](https://github.com/KlyntLabs/sui-move-analyzer/releases), rename to `sui-move-analyzer.exe`, and add to your PATH.

### 2. Verify Installation

```bash
sui-move-analyzer --version
```

> **macOS users:** If you see a security warning, run `xattr -d com.apple.quarantine /usr/local/bin/sui-move-analyzer` or allow it in System Preferences > Security & Privacy.

### 3. Configure Your Editor

The language server works with any LSP-compatible editor:

- **[VS Code](docs/editor-setup/vscode.md)** — Install the [Sui Move Analyzer](https://marketplace.visualstudio.com/items?itemName=KlyntLabs.sui-move-lsp) extension
- **[Neovim](docs/editor-setup/neovim.md)** — Using nvim-lspconfig or manual configuration
- **[Helix](docs/editor-setup/helix.md)** — Native LSP support
- **[Other Editors](docs/editor-setup/generic.md)** — Sublime Text, Emacs, Zed, and more

### 4. Set Up MCP for AI Assistants (Optional)

The same binary also runs as an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server, giving AI coding agents deep understanding of your Sui Move codebase:

- **[Claude Code](docs/mcp-setup/claude-code.md)** — Anthropic's CLI coding agent
- **[Claude Desktop](docs/mcp-setup/claude-desktop.md)** — Anthropic's desktop app
- **[Cursor](docs/mcp-setup/cursor.md)** — AI-native code editor
- **[VS Code + Copilot](docs/mcp-setup/vscode-copilot.md)** — GitHub Copilot agent mode
- **[Windsurf](docs/mcp-setup/windsurf.md)** — Codeium's AI editor
- **[Other MCP Clients](docs/mcp-setup/generic.md)** — Any MCP-compatible client

Quick example — add `.mcp.json` to your project root:

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

See the [MCP Setup Guide](docs/mcp-setup/) for details and all 9 available tools.

## Documentation

- [Installation Guide](docs/installation.md) — Detailed installation instructions
- [Configuration Reference](docs/configuration.md) — CLI arguments and server capabilities
- [Editor Setup](docs/editor-setup/) — Editor-specific configuration guides
- [MCP Setup](docs/mcp-setup/) — AI assistant integration guides
- [Troubleshooting](docs/troubleshooting.md) — Common issues and solutions

## Usage

The language server runs in stdio mode by default:

```bash
sui-move-analyzer
```

For debugging, enable verbose logging:

```bash
sui-move-analyzer --log-level debug
```

For remote development or debugging, use TCP mode:

```bash
sui-move-analyzer --tcp 9000
```

For AI assistant integration, use MCP mode:

```bash
sui-move-analyzer --mcp --project-root /path/to/your/sui-project
```

See the [Configuration Reference](docs/configuration.md) for all available options.

## Project Setup

Your Sui Move project needs a `Move.toml` file:

```toml
[package]
name = "my_sui_project"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
my_sui_project = "0x0"
```

## Issues

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/KlyntLabs/sui-move-analyzer/issues).

## License

Apache License 2.0
