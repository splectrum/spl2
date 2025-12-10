**Type:** plain req
**Version:** 1.0.0

# module_instance

## Spec

The work module - logical parent of all packages. Provides the universal module interface via `_lib/module.js`.

**Note:** Named `module_instance` not `work_module_instance` because contents will move to another module when complete. Exception documented in spl/module type.

**Provides:**
- Universal module interface (bound to record, passed to all execution contexts)
- Foundation lib that methods, libs, and scripts receive as single arg: `module`

### Output

Methods produce two types of output:
- **freetext** (metaoutput) - human/AI readable narrative
- **structured** (output) - data for parsing/chaining

**Signature:**

```js
module.output(freetext, structured)
```

- `freetext` - string, goes to metaoutput (printed to terminal)
- `structured` - object, goes to output (printed as JSON when --report)

### Output Levels

Both freetext and structured support four levels:

| Level | Purpose |
|-------|---------|
| topline | Minimal, one-liner |
| summary | Key information, scannable |
| detail | Full breakdown |
| enriched | Maximum depth, includes source code |

### Output Flags

**--meta**: Controls freetext output level
- `--meta=topline` → topline
- `--meta=summary` or `--meta` or (default) → summary
- `--meta=detail` → detail
- `--meta=enriched` → enriched
- `--meta=report` → echoes structured as JSON

**--report**: Controls structured output level
- (not set) → no structured output
- `--report=topline` → topline level
- `--report=summary` or `--report` → summary level
- `--report=detail` → detail level
- `--report=enriched` → enriched level

### Flag Helpers

```js
module.getMetaLevel()    // returns 'topline'|'summary'|'detail'|'enriched'|'report'
module.getReportLevel()  // returns null|'topline'|'summary'|'detail'|'enriched'
module.getDetailLevel()  // returns max of meta and report levels
```

`getDetailLevel()` tells method how deep to build content. Avoids building enriched when only topline needed.

| Meta flag | Report flag | getDetailLevel() |
|-----------|-------------|------------------|
| --meta=topline | --report (summary) | summary |
| --meta=enriched | --report (summary) | enriched |
| (default) summary | --report=enriched | enriched |

### Flag Categories

**Execution flags (lib-internal):**
- `--dry-run` - changes what the method does
- `--fail-fast` - changes control flow

These are woven into each method's specific logic. Each lib handles them internally.

**Output flags (module-level):**
- `--meta[=level]` - freetext output level
- `--report[=level]` - structured output level

These affect result presentation. Method calls `module.output(freetext, structured)` directly.

## Self-eval

- [ ] module.output(freetext, structured) sets metaoutput and output
- [ ] module.getMetaLevel() returns correct level from --meta flag
- [ ] module.getReportLevel() returns correct level from --report flag
- [ ] module.getDetailLevel() returns max of meta and report levels
- [ ] --meta=report echoes structured as JSON to freetext
- [ ] Flags read from input (record state)

## Comments

The output pattern enables:
- Separate freetext (narrative) and structured (data) outputs
- Independent level control via --meta and --report flags
- Progressive disclosure at four levels: topline, summary, detail, enriched
- requiredLevel() optimization - build only what's needed
