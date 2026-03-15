# Architecture

These documents describe the internal design and performance characteristics of `sui-move-analyzer`. They're intended for developers who want to understand how the tool works under the hood.

## Documents

| Document | Description |
|----------|-------------|
| [Performance Guidelines](performance-guidelines.md) | Latency targets, benchmark data, memory usage, session stability |
| [Salsa Query Architecture](salsa-queries.md) | How incremental computation enables sub-millisecond response times |

## Key Design Choices

- **Salsa incremental computation** — The same framework used by rust-analyzer. Automatically caches query results and only recomputes what changed when a file is edited.
- **Single binary, dual mode** — One binary serves both LSP (editor) and MCP (AI assistant) modes using the same analysis engine. See [Configuration Reference](../configuration.md#operating-modes).
- **Pull-based diagnostics** — Uses LSP 3.17 pull diagnostics rather than push, giving the editor control over when to request error checking.
