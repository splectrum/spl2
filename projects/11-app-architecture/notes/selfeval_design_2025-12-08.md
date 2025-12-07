# Selfeval Design

**Date:** 2025-12-08
**Context:** Project 11, implementing selfevals for container validation
**Builds on:** type_carries_tooling_2025-12-05.md

---

## Summary

Selfevals are structural validation checks that verify a container conforms to its type requirements. Implemented as an introspection method on container, driven by declarative data.

---

## API Facet Change

Rename "types" facet to "introspection":

```json
{
  "api": {
    "introspection": ["whoami", "typeof", "selfeval"],
    "crud": ["create", "read", "delete"],
    "xpath": ["select"]
  }
}
```

All three introspection methods are about a container examining itself:

| Method | Question |
|--------|----------|
| `whoami` | "What am I?" (structure, context) |
| `typeof` | "What type am I?" (identity) |
| `selfeval` | "Am I valid?" (conformance) |

---

## Invocation

```bash
spl spl/container/selfeval                    # --facet=all (default)
spl spl/container/selfeval --facet=structure  # specific facet
spl spl/container/selfeval --dry-run          # list what would run
spl spl/container/selfeval --dry-run --facet=structure  # list specific facet
```

The `--dry-run` flag (already implemented) serves as the discovery/selection mechanism.

---

## Method Structure

```
spl/container/selfeval/
  _lib/
    selfeval.js           # runner functions
  _selfevals/
    selfevals.json        # selfeval's own structural constraints
  index.js                # orchestrator
  README.json
```

The selfeval method carries its own lib with generic runner functions. These functions are reusable across all containers.

---

## Data Structure Per Container

Each container declares its constraints in `_selfevals/`:

```
spl/container/
  _selfevals/
    selfevals.json              # manifest (lists available facets)
    selfeval_structure.json     # structure facet data
    selfeval_schemas.json       # schemas facet data
```

**Manifest format:**
```json
{
  "facets": ["structure", "schemas", "content"]
}
```

**Facet data format (example - structure):**
```json
{
  "required_files": ["README.md", "README.json"],
  "required_folders": ["_reqs"],
  "optional_folders": ["_lib", "_schemas", "_selfevals", "_tests"]
}
```

---

## Runner Functions

Generic functions in `_lib/selfeval.js`:

```javascript
export function create(module) {
  return {
    structure: async function(containerPath, data) {
      // data = parsed selfeval_structure.json
      // returns validation results
    },
    schemas: async function(containerPath, data) {
      // data = parsed selfeval_schemas.json
    },
    content: async function(containerPath, data) {
      // data = parsed selfeval_content.json
    }
  }
}
```

Runners are data-driven. Each container provides different data, same runner logic.

---

## Execution Flow

1. `selfeval` method receives target container path
2. Reads target's `_selfevals/selfevals.json` manifest
3. Filters facets by `--facet` argument (default: all)
4. For each facet:
   - Loads `selfeval_<facet>.json` (parsed JSON)
   - Calls corresponding lib function with containerPath + data
   - Collects results
5. Returns aggregated results via `module.output()`

---

## Natural Language Selfevals

The natural language description of selfevals lives in the req file (spec + self-eval section), not in `_selfevals/`. The JSON data files are the executable implementation of those requirements.

```markdown
# container_v1.0.0.md

## Self-eval
- [ ] Has README.md
- [ ] Has README.json
- [ ] Internal folders have underscore prefix
```

The `selfeval_structure.json` implements these checks declaratively.

---

## Distinction: _selfevals vs _tests

| Folder | Purpose | Target |
|--------|---------|--------|
| `_selfevals/` | Structural validation | Container conformance |
| `_tests/` | Behavioral testing | index.js implementation |

**Selfevals:** "Is this container well-formed?"
**Tests:** "Does this method work correctly?"

Two orthogonal validation dimensions.

---

## Future Extension

If declarative data proves insufficient for some validation, a script runner facet can be added:

```json
{
  "facets": ["structure", "schemas", "custom"],
  "custom": {
    "runner": "script",
    "script": "selfeval_custom.js"
  }
}
```

Build what's needed, extend when necessary.

---

## Implementation Order

1. Update README.json: rename "types" → "introspection", add "selfeval"
2. Create selfeval method structure
3. Implement structure runner (simplest, validates file/folder presence)
4. Add selfeval data to container's `_selfevals/`
5. Test end-to-end
6. Add schemas runner
7. Add content runner if needed

---

## Output Modes

Graduated disclosure pattern for introspection methods:

| Flag | Output | Use case |
|------|--------|----------|
| (default) | Freetext summary | Quick interactive check |
| `--fail-fast` | Quiet, stop on first failure | CI, quick validation |
| `--report` | Structured JSON only | Parsing, scripts |
| `--verbose` | Both freetext + JSON | Debugging, full picture |

```bash
spl spl/container/selfeval               # full detail per facet
spl spl/container/selfeval --fail-fast   # "[structure] OK" or stop on failure
spl spl/container/selfeval --report      # { results: [...], pass: true }
spl spl/container/selfeval --verbose     # text + JSON
```

This pattern applies across introspection methods (`selfeval`, `whoami`, `typeof`):
- Default gives the gist (human-friendly)
- `--report` gives everything (machine-friendly)
- `--verbose` gives both (debugging)

The structured data is always computed internally; flags control what gets output.

---

## Origin

Emerged from discussion about how to execute selfevals. Key decisions:
- Method on container (not standalone runner) - consistent with "type carries tooling"
- Declarative data + generic lib functions - reusable, not per-container scripts
- Lib functions in method's own `_lib/` - self-contained
- Facet selection via `--facet` argument, discovery via `--dry-run`
