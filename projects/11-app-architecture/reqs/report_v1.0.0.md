# report

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Structured data set; written account of state.

Machine-readable output alongside human-readable. The data dimension orthogonal to text output levels.

### Character

- Structured: parseable data format
- Account: captures state at a point in time
- Orthogonal: independent of text verbosity (topline/summary/detail/debug)

### Usage

Can combine with output levels:
- `--report` - structured data at default level
- `--report=detail` - structured data at detail level
- `--report=debug` - structured data at debug level

## Self-eval

- [ ] Data is structured/parseable
- [ ] Represents state accurately
- [ ] Independent of text output level

## Comments

Enables tooling, automation, AI consumption of output.
