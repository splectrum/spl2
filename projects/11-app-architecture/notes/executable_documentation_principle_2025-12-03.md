# Executable Documentation Principle

**Date:** 2025-12-03
**Context:** Project 11, Item 3 - Development Experience discussion

---

## The Insight

For AI development, the distinction between "documentation" and "executable code" should collapse. Well-documented scripts both **explain** and **do**.

## The Principle

**Scripts are howtos. Howtos are scripts.**

An executable howto:
1. **Does the work** - actually creates, configures, executes
2. **Explains as it goes** - comments, structure, naming that teaches
3. **Can be studied** - reading the script teaches the pattern
4. **Can be run** - applying the pattern is one command

## Why This Matters for AI

| Traditional (Human) | Splectrum (AI) |
|---------------------|----------------|
| Documentation explains | Code explains AND does |
| Code does | Same artifact serves both purposes |
| Two artifacts to maintain | One source of truth |
| Can drift apart | Cannot drift - it either works or it doesn't |

## The Problem with Alternatives

**Templates alone:**
- Static, need separate documentation
- Don't adapt to context
- AI must remember how to use them

**Documentation alone:**
- AI must translate to action
- Can be outdated or incomplete
- Gap between understanding and doing

**Executable documentation:**
- Reading teaches the pattern
- Running applies the pattern
- The gap between understanding and doing collapses

## Implications for Development Experience

Every development task should have an executable howto:

| Task | Executable Howto |
|------|------------------|
| Create a method | `spl new-method <path>` |
| Inspect state | `spl state [options]` |
| List methods | `spl methods [pattern]` |
| Test a method | `spl test <method>` |
| Debug | `spl debug <method>` |

The script itself documents:
- What inputs are needed
- What structure gets created
- What patterns are canonical
- What the expected outcome is

## Two Modes: Fixed Scripts and Model Implementations

Not all tasks are the same. The executable documentation principle manifests in two modes:

### Fixed Scripts (Deterministic)

For simple, repetitive tasks with a fixed recipe:

```bash
spl new-method pr09/console/greet
```

- Always produces the same structure
- No creativity needed - just execution
- Script IS the complete specification

**Examples:** Create method, inspect state, list methods, run tests

### Model Implementations (Creative)

For complex tasks where the pattern matters but details vary:

```bash
spl new-api foo --like=spl/cli-static
```

- Uses existing implementation as template
- Shows the flow, leaves room for creativity
- Model provides structure, AI provides detail

**Examples:** New API extending another, complex integrations, domain-specific implementations

### The `--like` Mechanism

The `--like` syntax is key to model-based creation:

1. Reference an existing working implementation
2. Copy its structure (reqs, schema, selfevals, code patterns)
3. Adapt the details for the new context

**Why this eliminates bureaucracy:**

| Traditional | Model-based |
|-------------|-------------|
| Type spec + Template + Docs + Example | Type spec + Model implementation |
| 4 artifacts to maintain | 2 artifacts (and they're real code) |
| Templates can drift from reality | Model is always a working implementation |
| Separate "how to create X" docs | The model IS the documentation |

### Choosing the Right Mode

| Task Characteristic | Mode |
|--------------------|------|
| Fixed structure, no variation | Fixed script |
| Complex, contextual, creative | Model implementation |
| Done frequently, same way each time | Fixed script |
| Done occasionally, needs judgment | Model implementation |

The spectrum runs from fully automated (fixed script) to guided creativity (model implementation). Both are executable documentation - they just offer different levels of flexibility.

## Three Navigation Modes: Spider, Glob, Index

Navigation in a knowledge/code system requires three complementary modes:

**Spider (top-down, creation/learning):**
- Direction: Top-down traversal
- Purpose: Create, learn, understand relationships
- Strengths: Like knitting - easy to create links, maintains consistency (immutables)
- Good for: Building the web, understanding context, learning the system
- Weakness: Slow for finding specific things in a large web

**Glob (lateral, neighbourhood exploration):**
- Direction: Lateral from current position
- Purpose: Explore the neighbourhood, find patterns locally
- Strengths: Fast, targeted, precise
- Good for: Finding files, searching within self-contained units
- Weakness: Noisy without context, misses relationships

**Index (jump-in, precise landing):**
- Direction: Direct jump to specific location
- Purpose: Land precisely in the web, then orient
- Strengths: Immediate access to the right spot
- Good for: Large webs where spidering from top is slow
- Enables: Jump in → glob neighbourhood → spider outward if needed

### The Navigation Flow

```
                    ┌─────────────────────────────────────┐
                    │            Large Web                │
                    │                                     │
  Spider ──────────►│  (top)                              │
  (from top)        │    ↓                                │
                    │    ↓                                │
                    │    ↓                                │
  Index ───────────►│    ●────► Glob (neighbourhood)      │
  (jump to spot)    │          ↓                          │
                    │          Spider (outward if needed) │
                    │                                     │
                    └─────────────────────────────────────┘
```

Without index, options are:
- Spider from the top (slow, exhaustive)
- Glob everywhere (noisy, no context)
- Glob self-contained units (works if you know which unit)

With index:
- Jump to the right spot
- Glob the neighbourhood
- Spider outward only if needed

### Reverse Indexing (not yet implemented)

Reverse index would map:
- Terms → locations in the web
- Concepts → modules that implement them
- Patterns → examples that demonstrate them

Like a book index: "authentication - see pages 42, 87, 156" - jump to page 42, then read around it.

This is a key piece for the layered module structure - needs consideration during work module implementation.

### Self-contained Views

Self-contained work modules serve as "views" - detached, complete packages that can be picked up and examined from different angles without understanding the whole web:

```
modules/bm_spl/
  spl/
    project/
      create/       # method: create a project
      plan/         # method: plan work
      run/          # method: execute tasks
      close/        # method: close project
      _lib/         # shared project utilities
      _models/      # model implementations to --like from
```

- **Glob works:** `spl/project/create/index.js` - find and read
- **Spider works:** Enter at `spl/project/`, see the shape, understand the workflow

The structure teaches. Each method has reqs, selfevals, schema, readme. Spider into any one to understand it. The arrangement reveals the process: create → plan → run → close.

**The key insight:**

Spidering builds the knowledge (the mycelium web). Views package it for use (self-contained units). Index enables efficient navigation within the web.

```
Mycelium web (spidering)     →     Self-contained view (glob target)
├── concepts                       ┌─────────────────────┐
├── relationships                  │ spl/project/        │
├── history                        │   create/           │
├── rationale                      │   plan/             │
└── everything connected           │   run/              │
                                   │   close/            │
                                   │   (all you need)    │
                                   └─────────────────────┘
```

I spider to learn. I glob to do. I index to jump efficiently.

**What this means for glossaries:**

If work modules are self-contained with internal navigation, the HOWTO glossary becomes less necessary. The entry point is the module itself. Spider from there.

Glossaries remain valuable for:
- **Stepping Stones** - cross-cutting concepts that don't live in one place
- **DSL** - vocabulary that spans modules
- **Spots** - may dissolve as structure becomes self-documenting

HOWTO glossary may dissolve entirely - the "how to do X" is answered by finding the module for X and spidering.

## Connection to Existing Patterns

This aligns with:
- **API-as-App model** - methods ARE handlers, no separation
- **Event-sourcing state** - the history IS the documentation of what happened
- **Module structure** - reqs/selfevals/schema/readme already embodies spec+implementation unity
- **Glossary-first lookup** - evolves: glossaries for concepts, modules for procedures

## Origin

Emerged from collaborative scaffolding work on Project 11. Building the app-session pipeline manually revealed that the code itself became the specification. The user observed: "well documented scripts explain it and do it."

Further discussion surfaced the two-mode pattern: fixed scripts for deterministic tasks, model implementations for creative work. The `--like` mechanism emerged as the key to model-based creation - reducing bureaucracy by using real implementations as templates rather than maintaining separate documentation.

The glob vs spider insight emerged from questioning whether HOWTO glossary was needed at all. If procedures become executable (methods/scripts) living in self-contained modules, the module structure itself becomes navigable.

The three navigation modes crystallized: Spider (top-down, creation/learning), Glob (lateral, neighbourhood), Index (jump-in, precise). Spidering is like knitting - easy to create and link, maintains consistency. But finding needles in a large web requires either self-contained views (glob targets) or reverse indexing (jump to spot, then glob/spider locally).

Key formulation: "I spider to learn. I glob to do. I index to jump efficiently."

Reverse indexing remains unimplemented but is flagged as important for the layered module structure work ahead.

---

## Status

Principle captured. Ready for:
- [ ] Implementation in development tooling
- [ ] Potential elevation to design principle (design/DESIGN_REGISTER.md)
- [ ] CIP if formal change process needed
