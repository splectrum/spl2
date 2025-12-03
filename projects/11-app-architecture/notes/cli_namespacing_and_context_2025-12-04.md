# CLI Namespacing and Context Management

**Date:** 2025-12-04
**Context:** Project 11, Item 3 - Development Experience discussion (continued)

---

## The Problem

AI (Claude) working with the CLI has context challenges:

1. **No reliable cwd** - I work from repo root, don't consistently `cd` into modules
2. **State amnesia** - I might not remember CLI state set 20 exchanges ago
3. **Session-bound memory** - New conversation = fresh start

Full namespace is always unambiguous, but verbose:
```
spl spl/project/create
```

Can we make short forms safe for AI use?

---

## Namespace Structure

**Three-part format:** `<package>/<api>/<method>`

Where:
- `package` - the module package (e.g., `spl`)
- `api` - tells you the data structure you're working on (e.g., `project`)
- `method` - the operation (e.g., `create`)

Full invocation: `spl spl/project/create`

Short forms require context to resolve the omitted parts.

---

## Solution: Explicit Context Setting

### Two Context Dimensions

```
spl set api-context spl/project    # what data structure I'm working ON
spl set method-context spl/dev     # what methods I'm using (tools)
```

**Example flow:**

```
$ spl set api-context spl/project
$ spl set method-context spl/dev

$ spl new-method create

Will create method: spl/project/create      # API context
  Using: spl/dev/new-method                 # method context
```

**Query state:**

```
$ spl status

api-context:    spl/project
method-context: spl/dev
```

---

## Making Context Visible

### Context in Output

Every command output shows current context:

```
$ spl new-method create
[context: spl/project]
Created method: spl/project/create
```

AI sees context passively in output already being read.

### Interactive Confirmation (State Changes)

For any state-changing operation, show what will happen and prompt:

```
$ spl new-method create

Will create method: spl/project/create
  Location: modules/bm_spl/spl/project/create/
  Structure: index.js, reqs/, selfevals/, schema/, readme/
  Context: spl/project

Proceed? [y/n]
```

**What this provides:**

1. **Context visible** - full resolved path shown before execution
2. **Chance to abort** - if wrong, say no
3. **Built-in help** - run any command, read what it would do, decline to learn
4. **No memory needed** - the prompt tells everything

### Two Levels of Help

| Type | Purpose | Example |
|------|---------|---------|
| Traditional help | External, explains usage/options | `spl help new-method` |
| Interactive confirmation | Internal, shows THIS invocation's effect | The confirmation prompt itself |

- Help: "What can this method do?"
- Confirmation: "What will this method do right now?"

---

## Scoped Context: `with` vs `set`

### `set` - Persistent State Change

```
$ spl set api-context spl/project
$ spl new-method create
$ spl new-method plan
# context persists
```

### `with` - Scoped Context (Reverts After)

```
$ spl status
api-context: spl/dev

$ spl "with api-context spl/project | new-method create | new-method plan"
# executes in spl/project context

$ spl status
api-context: spl/dev    # unchanged, reverted
```

**Semantics:**
- `set` = change state, it stays
- `with` = borrow context, give it back

---

## Multi-Command Syntax (Future Maturity)

### Why Multi-Command?

Batch related operations, single confirmation, consolidated output.

### Multi-line Parsing (Simple)

```
$ spl <<EOF
with api-context spl/project do
new-method create
new-method plan
new-method close
EOF
```

**Parsing is trivial:**
1. First line: `with <context-type> <value> do` → set temporary context
2. Remaining lines: one command per line → execute in sequence
3. End: revert context

No special separators. Line-by-line processing. Splectrum already handles scripts this way.

### Consolidated Confirmation

```
[spl/project] Will execute:
  1. new-method create → spl/project/create
  2. new-method plan → spl/project/plan
  3. new-method close → spl/project/close

Proceed with 3 changes? [y/n]
```

One confirmation for the batch.

---

## Implementation Priority

**Start simple:**
1. `set` for persistent context
2. Context visible in output
3. Interactive confirmation for state changes

**Add later (higher maturity):**
4. `with` for scoped context
5. Multi-command `with ... do` syntax
6. Batch confirmation

---

## Summary

| Feature | Purpose | Priority |
|---------|---------|----------|
| Full namespace | Always unambiguous | Now (default) |
| `set api-context` | Persistent context | Now |
| `set method-context` | Tool namespace | Now |
| `spl status` | Query current state | Now |
| Context in output | Passive visibility | Now |
| Interactive confirmation | Safety + learning | Now |
| `with` scoped context | No side effects | Later |
| Multi-command syntax | Batch operations | Later |

**The key insight:**

Full namespace is always safe. Short forms become safe with:
- Visible context in output (I see it passively)
- Interactive confirmation (I verify before execution)
- `with` scoping (no persistent side effects to forget)

---

## Origin

Emerged from discussion about how AI reliably tracks CLI state. The user pushed on: "Would you remember what state the CLI is in?" - leading to solutions that don't require memory: visible context, confirmation prompts, scoped execution.
