# Installation

This guide covers how to install the `sui-move-analyzer` language server for Sui Move development.

## Download Pre-built Binaries

Pre-built binaries are available for the following platforms from [GitHub Releases](https://github.com/KlyntLabs/sui-move-analyzer/releases):

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

You should see output like:
```
sui-move-analyzer 0.1.0
```

If you get "command not found", ensure the installation directory is in your PATH:

```bash
# Check if the binary exists
which sui-move-analyzer  # Linux/macOS
where sui-move-analyzer  # Windows

# If not found, add the directory to your PATH
# Linux/macOS (add to ~/.bashrc or ~/.zshrc):
export PATH="$PATH:/usr/local/bin"

# Windows: Add via System Properties > Environment Variables
```

## Next Steps

Once installed, proceed to configure your editor:

- [Neovim Setup](editor-setup/neovim.md)
- [VS Code Setup](editor-setup/vscode.md)
- [Helix Setup](editor-setup/helix.md)
- [Generic LSP Client Setup](editor-setup/generic.md)

For troubleshooting installation issues, see the [Troubleshooting Guide](troubleshooting.md).
