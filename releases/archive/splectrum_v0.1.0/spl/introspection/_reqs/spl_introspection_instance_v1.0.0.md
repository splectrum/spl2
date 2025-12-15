**Type:** plain req
**Version:** 1.0.0

# spl_introspection_instance

## Spec

The spl/introspection API - introspection methods available on containers that extend this type.

**API:**

| Method | Purpose |
|--------|---------|
| whoami | Container identity and structure |
| selfeval | Validate container against requirements |

**Methods:**

- `whoami` - Shows container identity, api, handler, schemas, lib, reqs
  - `--meta` - Output detail level (oneliner, topline, summary, detail)
  - `--report` - Include structured JSON in output
  - `--facet` - Filter to specific facets
  - `--levels` - Show type inheritance levels
  - `--usage` - Show input schema as usage information

- `selfeval` - Runs validation runners from type stack
  - `--runner` - Run specific runner(s)
  - `--dryRun` - Show what would run without executing
  - `--failFast` - Stop on first failure
  - `--levels` - Run specific level(s) of type stack

**Virtual introspection:**

Introspection methods can examine containers that don't physically exist by walking the type stack. This enables `--help` on any valid container path.

## Self-eval

- [ ] Methods whoami, selfeval callable
- [ ] whoami returns valid container structure
- [ ] selfeval runs registered runners

## Comments

This is the base introspection API. Types extending spl/introspection inherit these methods.
