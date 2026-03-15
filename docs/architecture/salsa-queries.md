# Salsa Query Architecture

This document explains how `sui-move-analyzer` achieves sub-millisecond response times for most IDE operations using incremental computation.

## Overview

The LSP uses [Salsa 0.23](https://github.com/salsa-rs/salsa) — the same incremental computation framework used by [rust-analyzer](https://rust-analyzer.github.io/) — to automatically cache query results and invalidate them when inputs change. When you edit a file, Salsa only recomputes the queries affected by that change, leaving everything else cached. This is why operations like go-to-definition take 2-3 µs on warm cache.

For the performance targets and benchmarks this architecture enables, see [Performance Guidelines](performance-guidelines.md).

## Query Types

The query system has three layers: inputs (raw data), interned types (efficient identifiers), and tracked queries (cached computations). Understanding this layering helps when diagnosing performance or extending the analyzer.

### Input Types (5)

Inputs are the base data that drive all computation. When an input changes, Salsa automatically invalidates dependent queries.

| Input | Location | Description |
|-------|----------|-------------|
| `FileText` | `base-db/src/inputs.rs:48` | File content as `Arc<str>` |
| `FileIdSet` | `base-db/src/inputs.rs:36` | Set of file IDs |
| `PackageIdSet` | `base-db/src/inputs.rs:42` | Set of package IDs |
| `PackageRootInput` | `base-db/src/inputs.rs:55` | Package root with file set |
| `PackageMetadataInput` | `base-db/src/inputs.rs:76` | Package metadata from Move.toml |
| `PackageId` | `base-db/src/package_root.rs:13` | Unique package identifier |

### Interned Types (3)

Interned types provide efficient equality comparison and storage for frequently used values.

| Interned | Location | Description |
|----------|----------|-------------|
| `FileIdInput` | `base-db/src/inputs.rs:18` | Interned file ID for query parameters |
| `SyntaxLocInput` | `lang/src/loc.rs:244` | Interned syntax location for caching |
| `PackageId` | `base-db/src/package_root.rs:13` | Interned package identifier |

### Tracked Queries (12)

Tracked queries are memoized and automatically invalidated when their dependencies change.

#### Source Database Queries (`base-db/src/source_db.rs`)

| Query | Line | Description |
|-------|------|-------------|
| `parse` | 93 | Parse file into syntax tree (cached per file) |
| `parse_errors` | 101 | Extract parse errors from parse result |
| `metadata_for_package_id` | 111 | Get package metadata by ID |

#### HIR Database Queries (`lang/src/hir_db.rs`)

| Query | Line | Description |
|-------|------|-------------|
| `source_file_ids_in_package` | 30 | List files in a package |
| `transitive_dep_package_ids` | 44 | Get all transitive dependencies |
| `reverse_transitive_dep_package_ids` | 119 | Get reverse dependencies |
| `named_addresses_tracked` | 90 | Collect named addresses from all packages |
| `file_scope_index` | 201 | Index module scopes for O(1) lookup |
| `modules_in_package` | 279 | List modules in a package with address info |

#### Type Database Queries (`lang/src/types/ty_db/`)

| Query | Location | Description |
|-------|----------|-------------|
| `try_lower_type_tracked` | `mod.rs:79` | Lower AST type to HIR type |
| `lower_primitive_type_tracked` | `mod.rs:178` | Lower primitive types |
| `lower_function_tracked` | `function.rs:41` | Lower function signatures |

## Durability Settings

Salsa uses durability levels to optimize invalidation. Higher durability means less frequent changes.

| Durability | Usage | Example |
|------------|-------|---------|
| `LOW` | Local file content | User-edited files |
| `MEDIUM` | (Not currently used) | - |
| `HIGH` | Library packages | Sui framework files |

**Current Configuration:**
- Local packages: `Durability::LOW` (frequent changes expected)
- Library packages: `Durability::HIGH` (rarely change during editing)

See `RootDatabase::set_file_text` in `ide-db/src/root_db.rs:75-78`.

## Query Flow Example

This is the key concept. When a user triggers go-to-definition, the query chain looks like:

```
goto_definition(position)
    └── resolve_name_at_position
        └── file_scope_index(file_id)     [CACHED per file]
            └── parse(file_id)             [CACHED per file]
                └── file_text(file_id)     [INPUT]
```

**What happens when you edit a file:**

1. Only `file_text` is updated for the changed file
2. Salsa marks `parse` as stale for **that file only**
3. `file_scope_index` is marked stale (depends on parse)
4. Next query triggers recomputation only for the changed file
5. All other files' caches remain valid — no wasted work

This is why editing one file in a 50-module project doesn't cause the entire project to be re-analyzed.

## Design Decisions

### Type Inference Not Cached

Type inference results (`InferenceResult`) are intentionally **not cached** at the query level because they contain AST node references. Instead:

1. Inference is computed per-expression as needed
2. The `file_scope_index` cache provides fast symbol lookup
3. Individual type lookups are inexpensive

### FileScopeIndex for O(1) Lookups

Instead of scanning modules on every name resolution, we cache all scope entries:

```rust
#[salsa::tracked(returns(ref))]
pub fn file_scope_index(db: &dyn SourceDatabase, file_id: FileIdInput) -> FileScopeIndex
```

This makes repeated lookups in the same file essentially free.

### Transitive Dependencies Cached

Package dependency graphs are cached to avoid repeated BFS traversal:

```rust
#[salsa::tracked]
pub fn transitive_dep_package_ids(db: &dyn SourceDatabase, package_id: PackageId) -> Vec<PackageId>
```

## Performance Characteristics

Measured benchmarks showing the impact of Salsa caching:

| Operation | Warm Cache | Cold Start | Speedup |
|-----------|------------|------------|---------|
| goto_definition | 2-3 µs | 60-550 µs | ~100-200x |
| hover | 1-18 µs | — | — |
| completions | 2-3 µs | — | — |
| find_references | 1-3 µs | — | — |
| semantic_tokens | 10-37 ms | 16-142 ms | ~2-4x |

With warm cache, most operations complete in **single-digit microseconds** — 3-4 orders of magnitude faster than the NFR targets (which are set at 100ms). The only operation that takes milliseconds is semantic tokens, which must process the entire file for syntax highlighting.

See [Performance Guidelines](performance-guidelines.md) for the full NFR targets and project-size scaling data.

## References

- [Salsa Book](https://salsa-rs.github.io/salsa/) — The incremental computation framework
- [rust-analyzer Architecture](https://github.com/rust-lang/rust-analyzer/blob/master/docs/dev/architecture.md) — Similar LSP architecture that inspired this design
- [Performance Guidelines](performance-guidelines.md) — NFR targets, benchmarks, and optimization strategies
