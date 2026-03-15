# Helix Setup

This guide covers setting up `sui-move-analyzer` with [Helix](https://helix-editor.com/) for Sui Move development.

## Prerequisites

- Helix 23.03 or later
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Configuration

Helix configuration files are located at:
- Linux/macOS: `~/.config/helix/`
- Windows: `%AppData%\helix\`

### Step 1: Configure Language Support

Create or edit `~/.config/helix/languages.toml`:

```toml
# Define the Move language
[[language]]
name = "move"
scope = "source.move"
file-types = ["move"]
roots = ["Move.toml"]
comment-token = "//"
indent = { tab-width = 4, unit = "    " }
language-servers = ["sui-move-analyzer"]

# Configure the LSP server
[language-server.sui-move-analyzer]
command = "sui-move-analyzer"
args = []
```

### Step 2: Add Syntax Highlighting (Optional)

If Helix doesn't have built-in Move syntax highlighting, you can add tree-sitter queries. Create the directory structure:

```bash
mkdir -p ~/.config/helix/runtime/queries/move
```

Create `~/.config/helix/runtime/queries/move/highlights.scm` with basic highlighting rules:

```scheme
; Comments
(line_comment) @comment
(block_comment) @comment

; Keywords
[
  "module"
  "public"
  "fun"
  "struct"
  "has"
  "let"
  "mut"
  "if"
  "else"
  "while"
  "loop"
  "return"
  "abort"
  "use"
  "as"
  "const"
  "friend"
  "native"
  "entry"
  "acquires"
  "copy"
  "move"
  "phantom"
] @keyword

; Types
(type_identifier) @type
(primitive_type) @type.builtin

; Functions
(function_identifier) @function

; Variables
(variable_identifier) @variable

; Constants
(constant_identifier) @constant

; Strings
(string_literal) @string

; Numbers
(number_literal) @number

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
  "&"
  "|"
  "^"
] @operator
```

> **Note:** This is a basic example. The exact query syntax depends on the Move tree-sitter grammar you have installed. If highlighting doesn't work, check the [Helix tree-sitter documentation](https://docs.helix-editor.com/guides/adding_languages.html) for your grammar's node types. Even without tree-sitter highlighting, the LSP server provides semantic tokens for enhanced highlighting.

### Step 3: Verify Configuration

1. Open Helix and check language configuration:
   ```
   :log-open
   ```

2. Open a `.move` file and verify the language is detected:
   ```
   :show-language
   ```
   Should display `move`

3. Check LSP status:
   ```
   :lsp-workspace-command
   ```

## Using LSP Features

Helix provides keybindings for LSP features in normal mode:

| Keybinding | Action |
|------------|--------|
| `gd` | Go to definition |
| `gy` | Go to type definition |
| `gr` | Go to references |
| `gi` | Go to implementation |
| `K` | Show hover documentation |
| `<space>r` | Rename symbol |
| `<space>a` | Code actions |
| `<space>s` | Document symbols |
| `]d` | Go to next diagnostic |
| `[d` | Go to previous diagnostic |
| `<space>d` | Show diagnostics picker |

### Completion

Completion triggers automatically as you type. You can also:

- Press `Ctrl+x` to trigger completion manually
- Use `Tab` / `Shift+Tab` to navigate completion items
- Press `Enter` to confirm selection

### Diagnostics

Diagnostics appear inline in the editor. Use these commands:

- `]d` / `[d` - Navigate between diagnostics
- `<space>d` - Open diagnostics picker for the current file
- `<space>D` - Open workspace diagnostics picker

## Advanced Configuration

### Custom LSP Arguments

To pass additional arguments to the language server (e.g., debug logging):

```toml
[language-server.sui-move-analyzer]
command = "sui-move-analyzer"
args = ["--log-level", "debug"]
```

### TCP Mode

For debugging or remote development, you can connect via TCP:

1. Start the server manually:
   ```bash
   sui-move-analyzer --tcp 9000
   ```

2. Configure Helix to connect:
   ```toml
   [language-server.sui-move-analyzer]
   command = "nc"
   args = ["localhost", "9000"]
   ```

   Or if your system supports it, use TCP transport directly (check Helix documentation for current TCP support).

### Multiple Workspaces

Helix automatically detects the project root using the `roots` configuration. With `Move.toml` specified, it will find the correct project root for each file.

## Troubleshooting

### LSP Server Not Starting

1. Verify the binary is in PATH:
   ```bash
   which sui-move-analyzer
   sui-move-analyzer --version
   ```

2. Check Helix logs:
   ```
   :log-open
   ```
   Look for errors related to `sui-move-analyzer`

3. Test the configuration:
   ```
   :config-reload
   ```

### Language Not Detected

1. Verify file extension is `.move`

2. Check language configuration:
   ```
   :show-language
   ```

3. Ensure `languages.toml` syntax is correct (TOML is sensitive to formatting)

### No Completions or Hover

1. Verify LSP is running:
   ```
   :lsp-workspace-command
   ```

2. Ensure the file is in a valid Move project (has `Move.toml`)

3. Wait a moment after opening a file for the LSP to initialize

### Debug Logging

Enable server-side debug logging:

```toml
[language-server.sui-move-analyzer]
command = "sui-move-analyzer"
args = ["--log-level", "debug"]
```

Server logs go to stderr, which Helix captures. Check `:log-open` for output.

For more troubleshooting tips, see the [Troubleshooting Guide](../troubleshooting.md).

## Resources

- [Helix Documentation](https://docs.helix-editor.com/)
- [Helix Language Configuration](https://docs.helix-editor.com/languages.html)
- [Helix Keymap Reference](https://docs.helix-editor.com/keymap.html)
