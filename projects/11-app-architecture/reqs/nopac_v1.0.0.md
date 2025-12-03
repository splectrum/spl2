# nopac

**Version:** 1.0.0
**Type:** flag
**Context:** Splectrum invocation control

---

## Definition

nopac is an invocation flag that skips the confirmation prompt. Opposite of pac. Enables scripting mode where operations execute without interactive confirmation.

## Syntax

```
spl <command> --nopac
```

## Purpose

1. **Scripting** - Non-interactive execution
2. **Speed** - Skip confirmation for known operations
3. **Batch processing** - Multiple commands without prompts

## Behavior

When --nopac is specified:
1. Operation executes immediately
2. No confirmation prompt
3. Output depends on verbose/silent setting

## Example

```
$ spl set api-context spl/project --nopac
[api-context: spl/project]
```

No prompt, immediate execution.

## Override Levels

1. Global app setting: `set pac on/off`
2. Method spec default: `pac: true/false`
3. Invocation flag: `--nopac` or `--pac` (overrides all)

## Relationship

- `nopac` - force prompt off
- `pac` - force prompt on
- These are opposites; invocation flag takes precedence

## Caution

Use with care for state-changing or destructive operations. The confirmation prompt exists to prevent mistakes.

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
