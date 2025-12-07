**Type:** plain req
**Version:** 1.0.0

# module_instance

## Spec

The work module - logical parent of all packages. Provides the universal module interface via `_lib/module.js`.

**Note:** Named `module_instance` not `work_module_instance` because contents will move to another module when complete. Exception documented in spl/module type.

**Provides:**
- Universal module interface (bound to record, passed to all execution contexts)
- Foundation lib that methods, libs, and scripts receive as single arg: `module`

### Graded Output

Methods produce output in chunks with graduated disclosure levels. Each chunk contains content at four levels.

**Signature:**

```js
module.gradedOutput({ topline, summary, detail, debug })
```

Called per chunk. Same content used for both metaoutput (freetext) and output (data/report), selected by different flags.

**Levels:**

| Level | Purpose |
|-------|---------|
| topline | Minimal, one-liner |
| summary | Key information, scannable |
| detail | Full breakdown |
| debug | Maximum verbosity |

**Text flags (metaoutput):**

| Flag | Level selected |
|------|----------------|
| --silent | topline |
| (default) | summary |
| --verbose | detail |
| --debug | debug |

Most verbose wins if multiple present.

**Data flags (output):**

| Flag | Level selected |
|------|----------------|
| (not set) | none (no data output) |
| --report | summary |
| --report=detail | detail |
| --report=debug | debug |

**Behavior:**
- Reads flags from input (record state)
- Appends selected text level to metaoutput
- Appends selected data level to output (if --report set)
- Two orthogonal axes: text level and data inclusion

### requiredLevel Helper

Methods need to know what depth of content to produce before building chunks.

**Signature:**

```js
module.requiredLevel()  // returns 'topline', 'summary', 'detail', or 'debug'
```

Returns the MAX of text level and data level. Methods use this to avoid producing content they don't need, or to ensure they produce enough for both outputs.

| Text flag | Report flag | requiredLevel() |
|-----------|-------------|-----------------|
| --silent (topline) | --report (summary) | summary |
| --debug | --report (summary) | debug |
| (default) summary | --report=debug | debug |

**Input sources (future merge):**
- API defaults
- Previous output (chaining)
- Method explicit input

Later layers override earlier. Method sees unified input.

### Flag Categories

**Execution flags (lib-internal):**
- `--dry-run` - changes what the method does
- `--fail-fast` - changes control flow

These are woven into each method's specific logic. Each lib handles them internally.

**Output flags (module-level):**
- `--silent` - suppress text output
- `--verbose` - detail text level
- `--debug` - debug text level
- `--report[=level]` - include data output

These affect result presentation. Module handles them uniformly via `gradedOutput`.

## Self-eval

- [ ] gradedOutput accepts { topline, summary, detail, debug }
- [ ] Text level selected by --silent/--verbose/--debug flags
- [ ] Data level selected by --report flag value
- [ ] Flags read from input (record state)
- [ ] Chunks append to output (not replace)

## Comments

The graded output pattern enables:
- Consistent flag behavior across all methods
- Progressive disclosure for different use cases
- Single input structure for both text and data output
- Highly reusable, very versatile
