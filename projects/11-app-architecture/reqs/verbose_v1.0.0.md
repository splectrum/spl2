# verbose

**Version:** 1.0.0
**Type:** flag
**Context:** Splectrum output control

---

## Definition

verbose is an invocation flag that enables full explanation output. Learning mode - operations explain what they do/did.

## Syntax

```
spl <command> --verbose
```

## Purpose

1. **Learning** - Understand what operations do
2. **Debugging** - See detailed execution information
3. **Transparency** - Full visibility into effects

## Behavior

When --verbose is specified:
1. Operation provides detailed output
2. Explains context, paths, effects
3. Shows before/after state where applicable

## Example

```
$ spl set api-context spl/project --verbose

Setting context:
  Type: api-context
  Value: spl/project
  Previous: <none>

Context set successfully.
Current state:
  api-context: spl/project
  method-context: <none>
```

## Override Levels

1. Global app setting: `set verbose on/off`
2. Invocation flag: `--verbose` or `--silent` (overrides)

## Relationship

- `verbose` - full explanation output
- `silent` - minimal output
- These are opposites; invocation flag takes precedence

## Orthogonal to PAC

verbose/silent controls OUTPUT explanation
pac/nopac controls CONFIRMATION prompt

Both can be combined:
- `--pac --verbose` - prompt + full explanation
- `--pac --silent` - prompt only
- `--nopac --verbose` - no prompt, explain result
- `--nopac --silent` - minimal, scripting mode

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
