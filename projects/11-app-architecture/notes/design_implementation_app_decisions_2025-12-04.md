# Design & Implementation App - Initial Decisions

**Date:** 2025-12-04
**Context:** Project 11, Item 3 - Development Experience
**Builds on:** natural_language_bridge_2025-12-04.md

---

## Purpose

Create a design & implementation app that:
- Implements single-word verb API for app-internal operations
- Works with Splectrum formal syntax
- Provides built-in functional help via PAC pattern
- Manages context state for short-form commands

---

## Key Decisions

### 1. API Naming: Single-Word Verbs

**Decision:** App-internal operations use single-word verbs (no `/` separator)

**Rationale:**
- No clash with package names (first segment of formal syntax)
- Package names are nouns, verbs cannot be packages
- Clean parsing: `set` is a verb, `spl` is a package

**Examples:**
```
set      # verb - app internal
clear    # verb - app internal
reset    # verb - app internal
status   # verb - app internal

spl/...  # package path - formal syntax
pr09/... # package path - formal syntax
```

### 2. Multi-Command: Multiline Parsing

**Decision:** Start with simple multiline parsing (one command per line)

**Rationale:**
- Simple to implement
- No special separator syntax needed
- Glue syntax (`with ... do`) comes at higher maturity

**Example:**
```
$ spl <<EOF
set api-context spl/project
set method-context spl/dev
status
EOF
```

### 3. Work Module Stack

**Decision:** Use overlay pattern from dev bundle

**Structure:**
```
modules/
  work_<name>/      # work package - implementation
    overlays onto:
      bm_<name>/    # base module - defaults
      type_<name>/  # type module - reqs, specs, selfevals, howtos
```

### 4. PAC Pattern (Prompt And Confirm)

**Decision:** Built-in functional help from day one using prompt + confirm

**Flow:**
```
$ spl set api-context spl/project

Will set:
  api-context: spl/project
  (previously: <none>)

Proceed? [y/n]
```

**Benefits:**
- Every method is self-documenting
- Safe execution - see before doing
- Learning built into the interaction

### 5. Output Control Flags

**Decision:** Two orthogonal controls - PAC and verbose

| Flag | Purpose |
|------|---------|
| `pac` / `nopac` | Control confirmation prompt |
| `verbose` / `silent` | Control explanation output |

**Combinations:**
```
--pac --verbose      # prompt + full explanation (learning mode)
--pac --silent       # prompt only, minimal output
--nopac --verbose    # no prompt, but explain what happened
--nopac --silent     # just do it, minimal output (scripting mode)
```

### 6. Defaults

**Decision:** Default to maximum visibility

| Setting | Default |
|---------|---------|
| pac | on |
| verbose | on |

**Rationale:**
- New users / sessions get full learning experience
- Safe by default
- Can be turned off when comfortable

### 7. Override Levels

**Decision:** Three levels of control, lower overrides higher

```
1. Global app setting     spl set pac on/off
                          spl set verbose on/off

2. Method spec default    pac: true/false (in method schema/reqs)

3. Invocation flag        --pac / --nopac
                          --verbose / --silent
```

---

## Initial State Management Verbs

| Verb | Purpose | PAC default |
|------|---------|-------------|
| `set` | Set context value | on |
| `clear` | Clear specific context | on |
| `reset` | Reset all context to defaults | on |
| `status` | Query current state | off (read-only) |

---

## Context Types

Initial context types for `set`/`clear`:

| Context | Purpose |
|---------|---------|
| `api-context` | What data structure I'm working ON |
| `method-context` | What methods (tools) I'm using |
| `pac` | Global PAC setting |
| `verbose` | Global verbose setting |

---

## Implementation Order

1. Work module structure (overlay pattern)
2. App shell with state management
3. `set`, `clear`, `reset`, `status` verbs
4. PAC pattern implementation
5. Multiline input parsing
6. Context display in output

---

## Open Questions

None currently - ready to implement.

---

## Origin

Emerged from development experience discussion. User proposal: "create a 'design & implementation' app that implements a single word API for 'app internal' operations and works with splectrum formal syntax."

PAC pattern ensures functional help is built-in from day one, not bolted on later.
