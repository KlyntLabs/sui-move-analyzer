# Neovim Setup

This guide covers setting up `sui-move-analyzer` with Neovim for Sui Move development.

## Prerequisites

- Neovim 0.8.0 or later (0.10+ recommended for best LSP support)
- `sui-move-analyzer` installed and in your PATH ([Installation Guide](../installation.md))

## Method 1: Using nvim-lspconfig (Recommended)

[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) provides a simple way to configure LSP servers.

### Step 1: Install nvim-lspconfig

Using [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
{
  "neovim/nvim-lspconfig",
}
```

Using [packer.nvim](https://github.com/wbthomason/packer.nvim):

```lua
use "neovim/nvim-lspconfig"
```

### Step 2: Add Filetype Detection

Create or edit `~/.config/nvim/ftdetect/move.vim`:

```vim
autocmd BufRead,BufNewFile *.move set filetype=move
```

Or in Lua (`~/.config/nvim/ftdetect/move.lua`):

```lua
vim.filetype.add({
  extension = {
    move = "move",
  },
})
```

### Step 3: Configure the LSP Server

Add to your Neovim configuration (e.g., `~/.config/nvim/lua/lsp.lua` or `init.lua`):

```lua
local lspconfig = require("lspconfig")
local configs = require("lspconfig.configs")

-- Define sui-move-analyzer as a custom LSP server
if not configs.sui_move_analyzer then
  configs.sui_move_analyzer = {
    default_config = {
      cmd = { "sui-move-analyzer" },
      filetypes = { "move" },
      root_dir = lspconfig.util.root_pattern("Move.toml", ".git"),
      single_file_support = true,
      settings = {},
    },
  }
end

-- Setup the server with your preferred options
lspconfig.sui_move_analyzer.setup({
  on_attach = function(client, bufnr)
    -- Enable completion triggered by <c-x><c-o>
    vim.bo[bufnr].omnifunc = "v:lua.vim.lsp.omnifunc"

    -- Buffer-local keymaps
    local opts = { buffer = bufnr, noremap = true, silent = true }
    vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)
    vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)
    vim.keymap.set("n", "gr", vim.lsp.buf.references, opts)
    vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)
    vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts)
    vim.keymap.set("n", "[d", vim.diagnostic.goto_prev, opts)
    vim.keymap.set("n", "]d", vim.diagnostic.goto_next, opts)
    vim.keymap.set("n", "<leader>e", vim.diagnostic.open_float, opts)
  end,
  capabilities = vim.lsp.protocol.make_client_capabilities(),
})
```

## Method 2: Manual Configuration (Without Plugins)

If you prefer not to use nvim-lspconfig, you can configure the LSP client manually.

### Step 1: Add Filetype Detection

Same as Method 1 - create `~/.config/nvim/ftdetect/move.lua`:

```lua
vim.filetype.add({
  extension = {
    move = "move",
  },
})
```

### Step 2: Configure LSP Manually

Add to your Neovim configuration:

```lua
-- Start LSP for Move files
vim.api.nvim_create_autocmd("FileType", {
  pattern = "move",
  callback = function()
    vim.lsp.start({
      name = "sui-move-analyzer",
      cmd = { "sui-move-analyzer" },
      root_dir = vim.fs.dirname(vim.fs.find({ "Move.toml", ".git" }, { upward = true })[1]),
      capabilities = vim.lsp.protocol.make_client_capabilities(),
    })
  end,
})

-- Keymaps for LSP (applied to all LSP-enabled buffers)
vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(args)
    local bufnr = args.buf
    local opts = { buffer = bufnr, noremap = true, silent = true }

    vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)
    vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)
    vim.keymap.set("n", "gr", vim.lsp.buf.references, opts)
    vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)
    vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts)
    vim.keymap.set("n", "[d", vim.diagnostic.goto_prev, opts)
    vim.keymap.set("n", "]d", vim.diagnostic.goto_next, opts)
  end,
})
```

## Completion with nvim-cmp

For auto-completion popups, integrate with [nvim-cmp](https://github.com/hrsh7th/nvim-cmp):

### Install nvim-cmp and LSP Source

Using lazy.nvim:

```lua
{
  "hrsh7th/nvim-cmp",
  dependencies = {
    "hrsh7th/cmp-nvim-lsp",
  },
}
```

### Configure nvim-cmp

```lua
local cmp = require("cmp")
local cmp_lsp = require("cmp_nvim_lsp")

cmp.setup({
  sources = {
    { name = "nvim_lsp" },
  },
  mapping = cmp.mapping.preset.insert({
    ["<C-Space>"] = cmp.mapping.complete(),
    ["<CR>"] = cmp.mapping.confirm({ select = true }),
    ["<Tab>"] = cmp.mapping.select_next_item(),
    ["<S-Tab>"] = cmp.mapping.select_prev_item(),
  }),
})

-- Update LSP capabilities to include nvim-cmp
local capabilities = cmp_lsp.default_capabilities()

-- Use these capabilities when setting up the LSP
lspconfig.sui_move_analyzer.setup({
  capabilities = capabilities,
  -- ... rest of config
})
```

## Semantic Highlighting

Neovim supports LSP semantic tokens for enhanced syntax highlighting. To enable:

```lua
-- Enable semantic tokens (Neovim 0.9+)
vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if client and client.supports_method("textDocument/semanticTokens/full") then
      vim.lsp.semantic_tokens.start(args.buf, args.data.client_id)
    end
  end,
})
```

## Keybindings Reference

| Keybinding | Action |
|------------|--------|
| `gd` | Go to definition |
| `K` | Show hover documentation |
| `gr` | Find references |
| `<leader>rn` | Rename symbol |
| `<leader>ca` | Code actions |
| `[d` | Previous diagnostic |
| `]d` | Next diagnostic |
| `<leader>e` | Show diagnostic float |

## Troubleshooting

### LSP Not Starting

1. Verify the binary is installed:
   ```bash
   which sui-move-analyzer
   sui-move-analyzer --version
   ```

2. Check LSP logs in Neovim:
   ```vim
   :LspInfo
   :LspLog
   ```

3. Ensure filetype is detected:
   ```vim
   :set filetype?
   ```
   Should show `filetype=move`

### No Completions

1. Verify LSP is attached:
   ```vim
   :LspInfo
   ```

2. Check if nvim-cmp is configured correctly:
   ```vim
   :CmpStatus
   ```

3. Try triggering completion manually with `<C-Space>`

### Diagnostics Not Showing

1. Check if diagnostics are enabled:
   ```lua
   vim.diagnostic.config({ virtual_text = true })
   ```

2. Ensure the file is in a valid Move project (has `Move.toml`)

### Debug Logging

To see detailed server logs, start Neovim with LSP logging:

```bash
# Set log level to DEBUG
export NVIM_LSP_LOG_LEVEL=DEBUG
nvim your_file.move
```

Or check LSP log file:
```vim
:lua print(vim.lsp.get_log_path())
```

For more troubleshooting tips, see the [Troubleshooting Guide](../troubleshooting.md).
