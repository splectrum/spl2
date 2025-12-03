# silent

**Version:** 1.0.0
**Type:** flag
**Context:** Splectrum output control

---

## Definition

silent is an invocation flag that suppresses explanation output. Minimal output mode - only essential information.

## Syntax

```
spl <command> --silent
```

## Purpose

1. **Scripting** - Clean output for parsing
2. **Speed** - Reduce output noise
3. **Automation** - Minimal feedback for batch operations

## Behavior

When --silent is specified:
1. Operation provides minimal output
2. Only essential results/confirmations
3. No explanatory text

## Example

```
$ spl set api-context spl/project --silent
[spl/project]
```

Minimal confirmation, no explanation.

## Override Levels

1. Global app setting: `set verbose on/off`
2. Invocation flag: `--silent` or `--verbose` (overrides)

## Relationship

- `silent` - minimal output
- `verbose` - full explanation output
- These are opposites; invocation flag takes precedence

## Orthogonal to PAC

verbose/silent controls OUTPUT explanation
pac/nopac controls CONFIRMATION prompt

Combinations:
- `--pac --silent` - prompt only, no explanation
- `--nopac --silent` - scripting mode (minimal everything)

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
