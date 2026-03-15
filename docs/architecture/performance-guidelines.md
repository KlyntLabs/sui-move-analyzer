# Performance Guidelines

This document describes the performance characteristics, benchmarks, and optimization strategies for `sui-move-analyzer`. Understanding these helps developers evaluate whether the tool meets their project's needs and diagnose performance issues.

For the underlying caching architecture that makes this performance possible, see [Salsa Query Architecture](salsa-queries.md).

## Performance Targets

Every LSP operation has a latency target to ensure the editor feels responsive. These are the non-functional requirements (NFRs) the project is built against:

| NFR | Operation | Target | Description |
|-----|-----------|--------|-------------|
| NFR1 | Goto Definition | < 100ms | Navigation to symbol definition |
| NFR2 | Hover | < 100ms | Display symbol information |
| NFR3 | Completions | < 100ms | Code completion suggestions |
| NFR4 | Find References | < 500ms | Find all references to a symbol |
| NFR5 | Semantic Tokens | < 200ms | Syntax highlighting for a file |
| NFR6 | Initial Indexing | < 5s | Project load and initial analysis |
| NFR7 | Incremental Updates | < 50ms | Response after file change |
| NFR24 | Memory Usage | < 500MB | Maximum memory for large projects |

## Project Size Categories

The LSP is benchmarked against four fixture sizes:

| Size | Modules | Lines | Use Case |
|------|---------|-------|----------|
| Small | 1-2 | ~50 | Single file editing |
| Medium | 5-10 | ~1,000 | Typical project |
| Large | 8-12 | ~2,000 | Complex dApp |
| XLarge | 50+ | ~10,000 | Enterprise/Protocol |

### Performance by Project Size

Expected performance characteristics (p95 latency):

| Operation | Small | Medium | Large | XLarge |
|-----------|-------|--------|-------|--------|
| Goto Definition | <10ms | <30ms | <50ms | <100ms |
| Hover | <10ms | <30ms | <50ms | <100ms |
| Completions | <20ms | <50ms | <80ms | <150ms |
| Find References | <50ms | <100ms | <300ms | <800ms |
| Semantic Tokens | <20ms | <50ms | <100ms | <200ms |
| Initial Indexing | <0.5s | <1s | <2s | <5s |
| Incremental Update | <10ms | <20ms | <30ms | <80ms |

**Note**: XLarge projects may see up to 2x degradation from the Large baseline, which is acceptable.

## Memory Usage Expectations

Memory usage scales approximately linearly with project size:

| Project Size | Expected Memory | Maximum |
|--------------|-----------------|---------|
| Small | 10-30 MB | 50 MB |
| Medium | 30-80 MB | 150 MB |
| Large | 80-150 MB | 250 MB |
| XLarge | 150-300 MB | 500 MB |

### Memory Scaling Factors

- **File count**: ~0.5-1 MB per Move file
- **Total lines**: ~10-20 KB per 100 lines
- **Dependencies**: Sui framework adds ~50-100 MB base overhead
- **Caching**: Salsa query results are cached for faster repeated access

## Optimization Strategies

### How the LSP Stays Fast

The LSP uses several strategies to meet these targets:

1. **Salsa incremental caching** — All expensive computations go through the [Salsa query framework](salsa-queries.md), which automatically caches results and only recomputes what changed. Most operations hit warm cache and complete in microseconds.

2. **Lazy evaluation** — The server only computes what's needed for the current request. Opening a file doesn't trigger full project analysis.

3. **Batch operations** — When scanning across files (e.g., find references), the server batches database queries instead of making repeated small lookups.

4. **Smart memory sharing** — File contents are stored as `Arc<str>` (reference-counted strings) so multiple queries can share the same data without copying.

### For Users with Large Projects

1. **IDE Configuration**
   - Reduce autosave frequency to avoid frequent re-analysis
   - Close unused files to free memory
   - Consider splitting large packages into smaller ones

2. **Project Organization**
   - Keep related code in the same module to improve locality
   - Use clear module boundaries to limit cross-file analysis
   - Consider using workspaces for very large monorepos

3. **Hardware Recommendations**
   - 8GB+ RAM for XLarge projects
   - SSD recommended for faster file I/O
   - Multi-core CPU helps with parallel package loading

## Benchmarking (Contributors)

If you're contributing to the project and need to verify performance, the benchmark suite covers all LSP operations across four project sizes.

### Running Benchmarks

```bash
# Run all benchmarks
cargo bench --package ide

# Run specific benchmark group
cargo bench --package ide -- goto_definition

# Run benchmarks for a specific size
cargo bench --package ide -- xlarge

# Run with baseline comparison
cargo bench --package ide -- --baseline main
```

### Benchmark Fixtures

Test fixtures are located in `test-projects/benchmark/`:

| Fixture | Modules | Lines | Directory |
|---------|---------|-------|-----------|
| Small | 1-2 | ~50 | `small/` |
| Large | 8-12 | ~2,000 | `large/` |
| XLarge | 53 | ~10,000 | `large-50/` |

### Adding Custom Benchmarks

See `crates/ide/benches/analysis_benchmarks.rs` for benchmark patterns.

## Troubleshooting

### Slow Initial Indexing

1. **Check network**: First load fetches Sui framework from git
2. **Clear cache**: Delete `.move/` directory to rebuild
3. **Check disk space**: Ensure sufficient space for framework cache

### High Memory Usage

1. **Close unused files**: Each open file holds parsed AST
2. **Check for leaks**: Use `test_utils::MemoryTracker` in tests
3. **Profile memory**: Use system tools like `heaptrack` or `Instruments`

### Slow Incremental Updates

1. **Check file size**: Very large files (>1000 lines) may be slow
2. **Review dependencies**: Many cross-module references increase analysis time
3. **Disable unused features**: Turn off features you don't need

### Unresponsive Operations

1. **Check for blocking**: Long-running computations block the thread
2. **Review logs**: Enable debug logging to identify bottlenecks
3. **Profile**: Use `cargo flamegraph` to identify hot paths

## Monitoring

### Built-in Metrics

The LSP exposes these metrics in debug builds:

- `database.file_count` - Number of files indexed
- `database.package_count` - Number of packages loaded
- `analysis.query_count` - Salsa query invocations

### External Monitoring

For production deployments:

1. Monitor process memory with system tools
2. Log response latencies for LSP requests
3. Track crash/restart events

## Session Stability

The LSP is designed to remain stable during extended development sessions (2+ hours) without crashes, memory leaks, or performance degradation.

### Stability Targets

| Requirement | Target |
|-------------|--------|
| Session duration | 2+ hours without crashes or hangs |
| Error recovery | Recover from syntax errors without restart |

### Expected Session Characteristics

During a typical 2-hour session, the LSP handles:

| Operation Type | Expected Volume | Stability Target |
|----------------|-----------------|------------------|
| File opens | 500+ | No crashes |
| Incremental edits | 2000+ | < 50MB memory growth |
| Completions | 1000+ | p95 at end <= 2x p95 at start |
| Goto-definition | 500+ | Consistent response times |
| Find references | 200+ | No timeout or hang |

### Memory Stability Requirements

- **Total growth limit**: < 50MB over extended session
- **Monotonic growth**: No continuous memory growth pattern (indicates leak)
- **Cleanup**: Memory should stabilize after file close operations

### Performance Degradation Limits

Response times should remain consistent throughout a session:

- **Degradation ratio**: p95(second half) / p95(first half) < 2.0
- **Baseline**: Measure p95 latency in first 100 operations
- **Check point**: Compare against p95 in last 100 operations

### Error Recovery (NFR10)

The LSP should gracefully handle and recover from:

1. **Syntax errors**: Missing semicolons, braces, invalid tokens
2. **Missing imports**: Unknown module references
3. **Concurrent edits**: Rapid file modifications
4. **Invalid content**: Completely malformed files

Recovery means:
- No panics or crashes
- Diagnostics are produced when appropriate
- IDE features continue working on valid portions
- Full functionality restored when errors are fixed

### Testing Session Stability (Contributors)

```bash
# Run quick session tests (~10 seconds each)
cargo test --test session_stability

# Run comprehensive 2-hour simulation (~30 seconds)
cargo test --test session_stability -- --ignored

# Check memory stability specifically
cargo test --test session_stability test_session_no_memory_leak -- --nocapture
```

### Session Stability Troubleshooting

#### Memory Growing Continuously

1. **Identify the pattern**: Use `MemoryTracker` to sample memory over time
2. **Check for leaks**: `is_monotonic_growth(0.5)` detects sustained growth
3. **Review recent changes**: Check if new queries are being cached indefinitely
4. **Profile allocation**: Use `heaptrack` or similar tools

#### Performance Degradation Over Time

1. **Measure degradation**: Use `PerformanceMonitor::degradation_ratio()`
2. **Check cache effectiveness**: Salsa caches may be invalidated too often
3. **Review query dependencies**: Overly broad dependencies cause re-computation
4. **Monitor memory pressure**: High memory can cause GC pauses

#### Crashes After Extended Use

1. **Check for stack overflow**: Deep recursion in type resolution
2. **Memory corruption**: Use debug builds with sanitizers
3. **Resource exhaustion**: File handles, thread pools
4. **Review panic locations**: Enable `RUST_BACKTRACE=1`

### Session Stability Test Patterns (Contributors)

Example using `PerformanceMonitor`:

```rust
use test_utils::{OperationType, PerformanceMonitor};
use std::time::Instant;

let mut perf = PerformanceMonitor::new();

for i in 0..200 {
    let start = Instant::now();
    // ... perform operation ...
    perf.record(OperationType::Completion, start.elapsed());
}

// Verify performance consistency
let ratio = perf.degradation_ratio(OperationType::Completion).unwrap();
assert!(ratio < 2.0, "Performance degraded: {:.2}x", ratio);
```

Example using `MemoryTracker`:

```rust
use test_utils::MemoryTracker;

let mut tracker = MemoryTracker::new();

for i in 0..500 {
    // ... perform operations ...
    if i % 50 == 0 {
        tracker.sample();
    }
}

// Check for memory leaks
assert!(!tracker.is_monotonic_growth(0.5));
assert!(tracker.growth_mb().unwrap_or(0.0) < 50.0);
```

## Future Improvements

Areas being considered for optimization:

1. **Parallel analysis** - Analyze independent files concurrently
2. **Lazy parsing** - Parse files on-demand rather than upfront
3. **Incremental parsing** - Re-parse only changed regions
4. **Persistent cache** - Cache analysis across sessions
5. **Memory-mapped files** - Reduce memory for large files

## References

- [Salsa Book](https://salsa-rs.github.io/salsa/) - Incremental computation framework
- [rust-analyzer Performance](https://github.com/rust-lang/rust-analyzer/blob/master/docs/dev/architecture.md#performance) - Similar LSP's approach
- [LSP Specification](https://microsoft.github.io/language-server-protocol/) - Protocol details
