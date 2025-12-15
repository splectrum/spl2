**Type:** plain req
**Version:** 2.0.0
**Instantiates:** spl/method
**Supersedes:** spl_container_whoami_v1.0.0

# spl_container_whoami

## Spec

Comprehensive container introspection. Returns structured information about a container at configurable depth and detail.

### Flags

**Four orthogonal dimensions:**

| Dimension | Flag | Values | Default |
|-----------|------|--------|---------|
| Meta level | `--meta` | topline, summary, detail, enriched, report | summary |
| Report level | `--report` | topline, summary, detail, enriched | (none) |
| Facet filter | `--facet` | container, api, handler, schemas, lib, reqs | all |
| Depth level | `--levels` | 0, 1, 2, ... n, full | 0 (this container only) |

**--meta**: Controls freetext output (metaoutput)
- `--meta=topline` → topline
- `--meta=summary` or `--meta` or (default) → summary
- `--meta=detail` → detail
- `--meta=enriched` → enriched
- `--meta=report` → echoes structured as JSON

**--report**: Controls structured output (output)
- (not set) → no structured output
- `--report=topline` → topline level
- `--report=summary` or `--report` → summary level
- `--report=detail` → detail level
- `--report=enriched` → enriched level

### Output Levels

Output is hierarchical: container wraps facets.

**topline**: Container identity + facet one-liners
```
spl/container - API
  api - 3 facets, 7 methods
  handler - base container type
  schemas - input.avsc, metaoutput.avsc
  lib - report.js, freetext.js, selfeval.js
  reqs - empty
```

**summary**: Container purpose + facet contents
```
spl/container - API
  Base container type - structural unit for all containers
  api - 3 facets, 7 methods
    introspection: whoami, typeof, selfeval
    crud: create, read, delete
    xpath: select
  handler - base container type
  schemas - input.avsc, metaoutput.avsc
    Universal handler flags and output structure
  lib - report.js, freetext.js, selfeval.js
    Container core libs
  reqs - empty
```

**detail**: Full breakdown per facet
```
spl/container - API
  Base container type - structural unit for all containers
  api - 3 facets, 7 methods
    introspection: whoami, typeof, selfeval
    crud: create, read, delete
    xpath: select
  handler - base container type
  schemas - input.avsc, metaoutput.avsc
    Universal handler flags and output structure
  lib - report.js, freetext.js, selfeval.js
    Container core libs
    report.js: buildContainer, buildApi, buildHandler, buildSchemas, buildLib, buildReqs
    freetext.js: renderContainerTopline, renderContainerSummary, ...
    selfeval.js: loadRegistry, loadRunner, runAll, renderFreetext
  reqs - empty
```

**enriched**: Detail + source code (function bodies)

### Levels Flag

Controls type chain traversal:

- `--levels=0` (default): This container only
- `--levels=1`: This container + immediate type
- `--levels=2`: + one more base type
- `--levels=full`: Full chain to root

For an instance:
```
work_module (instance)
  └─ spl/module (type, levels=1)
       └─ spl/container (base, levels=2)
            └─ ... (levels=full)
```

Each level shows whoami output for that container.

### Facet Flag

Filters to specific facets (comma-delimited):

- `container` - Container identity and purpose
- `api` - API facets and methods
- `handler` - Handler type info
- `schemas` - _schemas folder
- `lib` - _lib folder
- `reqs` - _reqs folder

Examples:
- `--facet=lib` - lib at requested level, container as topline wrapper
- `--facet=container,lib` - container + lib at requested level
- `--facet` or (not set) - all facets at requested level

Container is always present as the envelope. If `container` is in the facet list, it returns at the requested detail level. If not, it returns at topline level (wrapper only).

Use facet filtering to limit output size, especially with `--meta=enriched` or `--report=enriched`.

### Levels + Facets Interaction

`--levels=full --facet=api`:
- Shows api facet for each level in chain
- Includes inherited API facets with provenance
- Shows which methods come from which level

Example:
```
spl/container (this):
  introspection: whoami, selfeval
spl/api (type):
  crud: create, read, delete
```

### Expected Flow

1. Process flags (meta, report, facet, levels)
2. Build container with facets at required detail level
3. If depth > 0, traverse type chain
4. Render freetext at meta level
5. Output freetext and structured (if report requested)

### Use Cases

**Quick check:**
```
spl spl/container/whoami
→ summary freetext (default)
```

**Minimal output:**
```
spl spl/container/whoami --meta=topline
→ one-liner per facet
```

**Full detail:**
```
spl spl/container/whoami --meta=detail
→ full breakdown with function names
```

**Get structured data:**
```
spl spl/container/whoami --report
→ freetext + JSON structured output
```

**JSON only (for AI parsing):**
```
spl spl/container/whoami --meta=report
→ structured output as JSON freetext
```

**Filter to specific facet:**
```
spl spl/container/whoami --facet=lib --meta=detail
→ lib facet only, full detail
```

**Full chain:**
```
spl spl/container/whoami --levels=full --report=detail
→ complete structural understanding with type chain
```

## Self-eval

- [ ] Conforms to spl_method_type structural requirements
- [ ] Supports --meta flag (topline, summary, detail, enriched, report)
- [ ] Supports --report flag (topline, summary, detail, enriched)
- [ ] Supports --facet flag for filtering
- [ ] Supports --levels flag for chain traversal
- [ ] Method flow visible in index.js, details in lib
- [ ] topline shows container + facet one-liners
- [ ] summary shows container purpose + facet contents
- [ ] detail shows full breakdown with function names
- [ ] enriched shows detail + source code
- [ ] Handles missing folders gracefully

## Comments

whoami is the primary introspection tool. With --report=enriched and full chain, it provides complete structural understanding of a container in one call - replacing ad-hoc file scanning.

The four orthogonal dimensions (meta, report, facet, levels) compose cleanly for targeted queries.
