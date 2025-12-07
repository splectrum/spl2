**Type:** plain req
**Version:** 2.0.0
**Implements:** spl_method_type_v1.0.0
**Supersedes:** spl_container_whoami_v1.0.0

# spl_container_whoami

## Spec

Comprehensive container introspection. Returns structured information about a container at configurable depth and detail.

### Flags

**Three orthogonal dimensions:**

| Dimension | Flag | Values | Default |
|-----------|------|--------|---------|
| Chain depth | `--levels` | 0, 1, 2, ... n, full | 0 (this container only) |
| Facet filter | `--facet` | reqs, lib, methods, selfevals, schemas, tests | all |
| Detail level | graded output | --silent, (default), --verbose, --debug | summary |

Plus standard output flags: `--report[=level]`

### Graded Output Levels

**topline**: Facet list with status
```
reqs - 5 type definitions
lib - no lib files
methods - 2 introspection, 1 crud
selfevals - 2 facets
tests - not implemented
```

**summary**: Facet contents (names)
```
reqs:
  spl_container_type, spl_container_instance, lib_type, ...
methods:
  introspection: whoami, selfeval
  crud: create
```

**detail**: Descriptions from folder entrypoints
```
reqs:
  spl_container_type - What a container is
  lib_type - Lib folder pattern
methods:
  whoami - Returns container identity and structure
  selfeval - Validates container against constraints
```

**debug**: Full content + DSL glossary meanings
```
reqs:
  spl_container_type:
    Spec: Container is a folder with README.json...
    Self-eval: [checklist]
    Comments: Base type for all containers
methods:
  whoami:
    Purpose: Comprehensive container introspection
    Behavior: Reads README.json, traverses internal folders...
    Flags: --levels, --facet, --silent, --verbose, --debug, --report
schemas:
  input.avsc - Universal handler flags
    dryRun (boolean)
      DSL: Preview mode, no side effects
    silent (boolean)
      DSL: Minimal output (topline level)
```

DSL glossary integration at debug level provides horizontal language consistency - same terms mean the same thing across the platform.

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

Filters to specific internal folder type:

- `--facet=reqs`: _reqs folder
- `--facet=lib`: _lib folder
- `--facet=methods`: child method containers
- `--facet=selfevals`: _selfevals folder
- `--facet=schemas`: _schemas folder (implemented)
- `--facet=tests`: _tests folder

Without flag: all facets shown.

### Facet Grading: schemas

| Level | Output |
|-------|--------|
| topline | `schemas - input.avsc, metaoutput.avsc` |
| summary | entries with descriptions from schemas.json |
| detail | + field details from .avsc files |
| debug | + DSL glossary meanings for field names |

### Child Container Handling

When showing child containers (methods, etc.), show **external** view only:
- Purpose, spec, behavior, flags
- NOT internal folders (_lib, _reqs, etc.)

For internals, run whoami directly on that container.

### Levels + Facets Interaction

`--levels=full --facet=methods`:
- Shows methods facet for each level in chain
- Includes inherited API facets with provenance
- Shows which methods come from which level

Example:
```
spl/container (this):
  introspection: whoami, selfeval
spl/api (type):
  crud: create, read, delete
```

### Behavior

1. Resolve parent container from method path
2. Read README.json for identity
3. Traverse internal folders for facet info
4. If --levels > 0, recursively introspect type chain
5. Output via gradedOutput at requested detail level

### Use Cases

**Quick check:**
```
spl spl/container/whoami
→ topline facet list
```

**Understand methods:**
```
spl spl/container/whoami --facet=methods --verbose
→ all methods with descriptions
```

**Full introspection for AI:**
```
spl spl/container/whoami --levels=full --debug
→ complete structural understanding, replaces file scanning
```

**Trace inheritance:**
```
spl spl/container/whoami --levels=full --facet=reqs --debug
→ see how reqs flow through type chain
```

## Self-eval

- [ ] Conforms to spl_method_type structural requirements
- [ ] Supports --levels flag for chain traversal
- [ ] Supports --facet flag for filtering
- [ ] Uses gradedOutput for all output
- [ ] topline shows facets with status
- [ ] summary shows facet contents (names)
- [ ] detail shows descriptions from entrypoints
- [ ] debug shows full content (specs, behavior)
- [ ] Child containers show external view only
- [ ] Handles missing folders gracefully

## Comments

whoami is the primary introspection tool. At debug level with full chain, it provides complete structural understanding of a container in one call - replacing ad-hoc file scanning.

The three orthogonal dimensions (levels, facet, detail) compose cleanly for targeted queries.
