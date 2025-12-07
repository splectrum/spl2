**Type:** plain req
**Version:** 1.0.0

# selfeval_method

## Spec

The `selfeval` method is an introspection method on container that validates structural conformance against declared constraints.

**Invocation:**
- `spl <container>/selfeval` - run all facets
- `spl <container>/selfeval --facet=<name>` - run specific facet
- `spl <container>/selfeval --dry-run` - list facets without executing

**Data source:**
- Reads target container's `_selfevals/selfevals.json` manifest
- Loads `selfeval_<facet>.json` for each facet to run
- Passes parsed JSON data to runner functions

**Runner functions:**
- Generic functions in `_lib/selfeval.js`
- Data-driven: same logic, different data per container
- Each facet has a corresponding runner function

**Initial facets:**
- `structure` - validates file/folder presence against requirements

**Output modes:**

| Flag | Output | Use case |
|------|--------|----------|
| (default) | Freetext summary | Quick interactive check |
| `--report` | Structured JSON only | CI, parsing, scripts |
| `--verbose` | Both freetext + JSON | Debugging, full picture |

Structured format: `{ results: [{ facet, checks: [{ name, pass, message }] }], pass: boolean }`

**Flags:**
- `--dry-run` - list facets that would run, don't execute
- `--facet=<name>` - run only specified facet (default: all)
- `--fail-fast` - quiet mode, stop on first failure
- `--report` - output structured JSON only (no freetext)
- `--verbose` - output both freetext and structured JSON

## Self-eval

- [ ] Method container has standard structure (README.md, README.json, index.js)
- [ ] Runner functions in `_lib/selfeval.js`
- [ ] Reads manifest from target's `_selfevals/selfevals.json`
- [ ] Supports `--facet` argument for selective execution
- [ ] Supports `--dry-run` for facet listing
- [ ] Default output is freetext summary only
- [ ] `--fail-fast` stops on first failure, quiet output
- [ ] `--report` outputs structured JSON only
- [ ] `--verbose` outputs both freetext and JSON

## Comments

Part of the introspection API facet alongside `whoami` and `typeof`. The natural language selfevals live in req files (Self-eval section); this method executes the machine-readable implementations.

Chicken-and-egg: selfeval needs selfevals to validate itself. Bootstrap with minimal constraints, expand as implementation stabilizes.
