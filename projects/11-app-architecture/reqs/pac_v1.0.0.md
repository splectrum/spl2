# pac

**Version:** 1.0.0
**Type:** flag
**Context:** Splectrum invocation control

---

## Definition

PAC (Prompt And Confirm) is an invocation flag that forces the confirmation prompt before execution. Enables functional help - the prompt explains what the operation will do.

## Syntax

```
spl <command> --pac
```

## Purpose

1. **Safety** - See what will happen before it happens
2. **Learning** - Understand the operation without reading docs
3. **Validation** - Confirm intent before execution

## Behavior

When --pac is specified:
1. Operation prepares but does not execute
2. Displays what will happen (resolved paths, effects)
3. Prompts for confirmation (y/n)
4. Executes only on 'y'

## Example

```
$ spl spl/dev/new-method --target=spl/project/create --pac

Will create method: spl/project/create
  Location: modules/bm_spl/spl/project/create/
  Structure: index.js, reqs/, selfevals/, schema/, readme/

Proceed? [y/n]
```

## Override Levels

1. Global app setting: `set pac on/off`
2. Method spec default: `pac: true/false`
3. Invocation flag: `--pac` or `--nopac` (overrides all)

## Relationship

- `pac` - force prompt on
- `nopac` - force prompt off
- These are opposites; invocation flag takes precedence

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
