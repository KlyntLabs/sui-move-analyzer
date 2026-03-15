# Troubleshooting Guide

This guide covers common issues with `sui-move-analyzer` and their solutions.

## Installation Issues

### macOS Security Warning (Most Common)

**Symptom:** macOS blocks the binary with "cannot be opened because the developer cannot be verified" or similar

**Solution:**

```bash
xattr -d com.apple.quarantine /usr/local/bin/sui-move-analyzer
```

Or go to **System Settings > Privacy & Security** and click **Allow Anyway**.

This happens because the binary is downloaded from the internet and isn't code-signed with an Apple Developer certificate. The binary is safe — it's built from source in [GitHub Actions](https://github.com/KlyntLabs/sui-move-analyzer/actions) and you can verify the release checksums.

### Binary Not Found

**Symptom:** `command not found: sui-move-analyzer` or similar error

**Solutions:**

1. Verify the binary exists:
   ```bash
   # Check if installed
   which sui-move-analyzer   # Linux/macOS
   where sui-move-analyzer   # Windows
   ```

2. Check if it's in your PATH:
   ```bash
   echo $PATH   # Linux/macOS
   echo %PATH%  # Windows
   ```

3. Add the installation directory to PATH:
   ```bash
   # Linux/macOS - add to ~/.bashrc or ~/.zshrc
   export PATH="$PATH:/usr/local/bin"

   # Or if installed to ~/.local/bin
   export PATH="$PATH:$HOME/.local/bin"
   ```

4. Reload your shell:
   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

### Permission Denied

**Symptom:** `Permission denied` when running the binary

**Solutions:**

1. Make the binary executable:
   ```bash
   chmod +x /path/to/sui-move-analyzer
   ```

2. On macOS, see [macOS Security Warning](#macos-security-warning-most-common) above.

### Wrong Architecture

**Symptom:** `cannot execute binary file` or `Exec format error`

**Solution:** Download the correct binary for your platform:
- macOS ARM64 (M1/M2/M3/M4): `sui-move-analyzer-aarch64-apple-darwin`
- macOS Intel: `sui-move-analyzer-x86_64-apple-darwin`
- Linux x86_64: `sui-move-analyzer-x86_64-unknown-linux-gnu`
- Linux ARM64: `sui-move-analyzer-aarch64-unknown-linux-gnu`

Check your architecture:
```bash
uname -m  # Linux/macOS
```

## LSP Connection Issues

### Server Not Starting

**Symptom:** Editor shows "LSP server failed to start" or similar

**Diagnosis:**

1. Test the server manually:
   ```bash
   sui-move-analyzer --version
   ```

2. Try running with debug logging:
   ```bash
   sui-move-analyzer --log-level debug 2>&1 | head -50
   ```

**Solutions:**

1. Ensure the binary path in your editor config matches the actual location
2. If using a relative path, try an absolute path instead
3. Check that no other process is blocking the server

### Connection Timeout

**Symptom:** Editor times out waiting for LSP response

**Solutions:**

1. Increase timeout in editor settings if possible
2. Check system resources (memory, CPU)
3. Try with a smaller project first to isolate the issue

### TCP Mode Connection Refused

**Symptom:** Cannot connect to server in TCP mode

**Solutions:**

1. Verify the server is running:
   ```bash
   # Start server
   sui-move-analyzer --tcp 9000

   # In another terminal, check if port is listening
   lsof -i :9000  # macOS/Linux
   netstat -an | findstr 9000  # Windows
   ```

2. Check firewall settings
3. Ensure you're connecting to the correct host:port

## Diagnostic Issues

### No Errors Shown

**Symptom:** Code has errors but no diagnostics appear

**Diagnosis:**

1. Check if LSP is attached:
   - Neovim: `:LspInfo`
   - VS Code: Check Output panel for LSP extension
   - Helix: `:log-open`

2. Verify the file is in a Move project:
   ```bash
   ls Move.toml  # Should exist in project root
   ```

**Solutions:**

1. Ensure your editor supports pull-based diagnostics (LSP 3.17)
2. Check that `Move.toml` exists and is valid
3. Try closing and reopening the file
4. Restart the language server

### Stale Diagnostics

**Symptom:** Diagnostics don't update after fixing issues

**Solutions:**

1. Save the file (some editors only update on save)
2. Close and reopen the file
3. Restart the language server
4. Check if your editor caches diagnostics

### Missing Diagnostics for Dependencies

**Symptom:** Errors in imported modules not shown

**Note:** This is expected behavior. The server provides diagnostics for the current file. Dependency errors are shown when you open those files.

## Completion Issues

### No Completions

**Symptom:** Auto-complete doesn't show suggestions

**Diagnosis:**

1. Check if LSP is attached
2. Verify completion is triggered (type `:` or `.`)

**Solutions:**

1. Ensure cursor is in a valid completion context
2. Check that the module/file has no syntax errors that prevent parsing
3. Try triggering completion manually (Ctrl+Space in most editors)

### Slow Completions

**Symptom:** Completion popup takes a long time to appear

**Solutions:**

1. Large projects may take longer - wait for initial indexing
2. Enable debug logging to check what's happening:
   ```bash
   sui-move-analyzer --log-level debug
   ```
3. Close and reopen large files to reset state

### Missing Completions

**Symptom:** Some expected completions don't appear

**Possible causes:**

1. The symbol is not in scope - check imports
2. The file has syntax errors - fix errors first
3. The completion context is ambiguous

## Navigation Issues

### Go-to-Definition Not Working

**Symptom:** "Definition not found" or jumps to wrong location

**Solutions:**

1. Ensure the target file is part of the project (referenced in `Move.toml`)
2. Check that the symbol is defined (not just declared)
3. Try Find References first to verify the symbol is indexed

### Find References Returns Empty

**Symptom:** No references found for a symbol

**Solutions:**

1. Save all open files (references from unsaved changes may not appear)
2. Wait for indexing to complete after opening a large project
3. Verify the symbol exists and is used somewhere

## Project Setup Issues

### Move.toml Not Found

**Symptom:** Project features don't work, server can't find dependencies

**Solutions:**

1. Create a `Move.toml` file in your project root:
   ```toml
   [package]
   name = "my_project"
   edition = "2024.beta"

   [dependencies]
   Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

   [addresses]
   my_project = "0x0"
   ```

2. Open VS Code/editor at the project root (directory containing `Move.toml`)

### Wrong Project Root

**Symptom:** Some files work but others don't

**Solutions:**

1. Open your editor at the project root directory
2. Check that there's only one `Move.toml` in your workspace
3. If using workspaces, ensure each project has its own `Move.toml`

## Logging and Debugging

### Enable Debug Logging

To see detailed server logs:

```bash
sui-move-analyzer --log-level debug 2>/tmp/sui-move-analyzer.log
```

Then check the log file:
```bash
tail -f /tmp/sui-move-analyzer.log
```

### Log Levels Explained

| Level | What's Logged |
|-------|---------------|
| `error` | Only errors |
| `warn` | Warnings and errors |
| `info` | General information (default) |
| `debug` | Detailed debugging info |
| `trace` | Very verbose, including all LSP messages |

### Reading Log Output

Common log patterns:

```
INFO  Server starting...
INFO  Received initialize request
DEBUG Parsing file: /path/to/file.move
DEBUG Found 5 symbols in file
ERROR Failed to parse: unexpected token
```

## MCP Issues

### Server Crashes with "expected absolute path"

**Symptom:** `panicked at ... expected absolute path, got .` when starting the MCP server

**Cause:** The `--project-root` argument requires an absolute path. Relative paths (including `.`) are not supported.

**Solution:** Use an absolute path when running the server manually:

```bash
# Wrong — will crash
sui-move-analyzer --mcp --project-root .

# Correct
sui-move-analyzer --mcp --project-root /Users/you/my-sui-project
```

> **Note:** If you're using `.mcp.json` with `"."` as the project root, that's fine — MCP clients (Claude Code, Cursor, etc.) resolve `.` to an absolute path before launching the server.

## Performance Issues

### Slow Startup on Large Projects

**Symptom:** Server takes a long time to start or respond after opening a large project

**Solutions:**

1. The server indexes all `.move` files and dependencies on startup. Initial indexing is expected to take longer for projects with many dependencies.
2. Subsequent operations should be fast after indexing completes.
3. Use `--log-level debug` to see indexing progress.
4. Ensure your `Move.toml` dependencies use a pinned `rev` rather than a branch name — branch references require git resolution on every startup.

### High Memory Usage

**Symptom:** Server uses significant memory

**Note:** This is expected for projects with large dependency trees (e.g., the full Sui framework). The server keeps an in-memory index of all symbols. Memory usage scales with the number of indexed files.

## FAQ

### Q: Why doesn't syntax highlighting work?

A: Syntax highlighting is typically provided by your editor's Move language support, not the LSP server. Install a Move syntax highlighting extension for your editor. The LSP server provides _semantic_ tokens for enhanced highlighting, but basic highlighting requires a grammar.

### Q: Can I use this with the Move standard library?

A: Yes, ensure your `Move.toml` includes the Sui framework dependency. The server will index all dependencies.

### Q: How do I report a bug?

A: Open an issue at [github.com/KlyntLabs/sui-move-analyzer/issues](https://github.com/KlyntLabs/sui-move-analyzer/issues) with:
- Your OS and architecture
- Editor and version
- Steps to reproduce
- Debug logs if available

### Q: The server crashes. What should I do?

A:
1. Get the crash log with debug logging enabled
2. Note what you were doing when it crashed
3. Report the issue with the crash log

### Q: Is there a VS Code extension?

A: Yes! Install the **Sui Move Analyzer** extension from the VS Code Marketplace. Search for "Sui Move Analyzer" in the Extensions panel or install via command line: `code --install-extension KlyntLabs.sui-move-lsp`. See the [VS Code setup guide](editor-setup/vscode.md) for details.

### Q: Can I use both sui-move-analyzer and move-analyzer?

A: It's not recommended to run both on the same files as they may conflict. Use `sui-move-analyzer` for Sui Move projects and `move-analyzer` for core Move projects.

## Getting Help

If your issue isn't covered here:

1. Check the [GitHub Issues](https://github.com/KlyntLabs/sui-move-analyzer/issues) for similar problems
2. Open a new issue with detailed information
3. Include debug logs and steps to reproduce
