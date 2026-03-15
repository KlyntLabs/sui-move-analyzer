# Installation

This guide covers how to install the `sui-move-analyzer` language server for Sui Move development. Pre-built binaries are available — no build tools or dependencies required.

## Download Pre-built Binaries

Download the latest binary for your platform from [GitHub Releases](https://github.com/KlyntLabs/sui-move-analyzer/releases):

| Platform | Architecture | Binary Name |
|----------|--------------|-------------|
| macOS | Apple Silicon (ARM64) | `sui-move-analyzer-aarch64-apple-darwin` |
| macOS | Intel (x86_64) | `sui-move-analyzer-x86_64-apple-darwin` |
| Linux | x86_64 | `sui-move-analyzer-x86_64-unknown-linux-gnu` |
| Linux | ARM64 | `sui-move-analyzer-aarch64-unknown-linux-gnu` |
| Windows | x86_64 | `sui-move-analyzer-x86_64-pc-windows-msvc.exe` |

### macOS

```bash
# For Apple Silicon (M1/M2/M3/M4)
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-aarch64-apple-darwin
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/

# For Intel Macs
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-x86_64-apple-darwin
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/
```

### Linux

```bash
# For x86_64
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-x86_64-unknown-linux-gnu
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/

# For ARM64
curl -L -o sui-move-analyzer https://github.com/KlyntLabs/sui-move-analyzer/releases/latest/download/sui-move-analyzer-aarch64-unknown-linux-gnu
chmod +x sui-move-analyzer
sudo mv sui-move-analyzer /usr/local/bin/
```

### Windows

1. Download `sui-move-analyzer-x86_64-pc-windows-msvc.exe` from the [releases page](https://github.com/KlyntLabs/sui-move-analyzer/releases)
2. Rename the file to `sui-move-analyzer.exe`
3. Move it to a directory in your PATH (e.g., `C:\Program Files\sui-move-analyzer\`)
4. Add the directory to your system PATH if not already included

## Verify Installation

After installation, verify the binary is accessible:

```bash
sui-move-analyzer --version
```

You should see the version number printed. If you get "command not found", ensure the installation directory is in your PATH:

```bash
# Check if the binary exists
which sui-move-analyzer  # Linux/macOS
where sui-move-analyzer  # Windows

# If not found, add the directory to your PATH
# Linux/macOS (add to ~/.bashrc or ~/.zshrc):
export PATH="$PATH:/usr/local/bin"

# Windows: Add via System Properties > Environment Variables
```

## macOS Security

macOS may block the binary because it was downloaded from the internet. If you see a security warning:

```bash
xattr -d com.apple.quarantine /usr/local/bin/sui-move-analyzer
```

Or go to **System Settings > Privacy & Security** and click **Allow Anyway** next to the blocked binary message.

## Next Steps

Once installed, set up your editor and optionally configure AI assistant integration:

- **Editor Setup:** [VS Code](editor-setup/vscode.md) · [Neovim](editor-setup/neovim.md) · [Helix](editor-setup/helix.md) · [Other Editors](editor-setup/generic.md)
- **AI Assistant Integration:** [MCP Setup Guide](mcp-setup/) — connect to Claude, Cursor, Copilot, Windsurf, and more

For troubleshooting installation issues, see the [Troubleshooting Guide](troubleshooting.md).
