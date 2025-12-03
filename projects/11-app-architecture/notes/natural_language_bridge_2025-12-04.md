# Natural Language Bridge

**Date:** 2025-12-04
**Context:** Project 11, Item 3 - Development Experience discussion (continued)
**Builds on:** cli_namespacing_and_context_2025-12-04.md

---

## The Realization

By having a strict formal syntax, we can create multiple fluent languages on top of it. This bridges the gap to natural language.

---

## The Full Stack

```
Natural language         "create a method called greet in the project api"
        ↓
    DSL Glossary         (semantic understanding - what terms mean)
        ↓
Fluent scripting         with api-context spl/project do
                         new-method greet
        ↓
Formal syntax            spl spl/dev/module/new-method --target=spl/project/greet
        ↓
   Confirmation          Will create method: spl/project/greet...
        ↓
   Execution             (the actual implementation)
```

---

## Multiple Fluent Layers

The formal layer is stable. Multiple fluent layers can sit on top:

| Layer | Example |
|-------|---------|
| Terse scripting | `with spl/project do new-method greet` |
| Verbose scripting | `with api-context spl/project do new-method greet` |
| Natural language | "create a greet method in the project api" |
| Domain-specific | whatever fits the user/context |

**All resolve to the same formal layer.**

---

## DSL Glossary as Semantic Foundation

The DSL glossary enables translation from natural language to formal syntax with *understanding*, not guessing.

### What DSL Glossary Provides

- **Validation:** Is this a real thing?
- **Semantics:** What does it mean?
- **Constraints:** What's allowed?
- **Relationships:** How do terms relate?

### Example Translation

```
Natural:  "Can you create me a new method 'create' in spl/project
           using the dev/module api?"

DSL lookup:
  - "method" → what is a method, its structure
  - "api" → what is an api, how it contains methods
  - "create" → standard CRUD operation semantics
  - "dev/module" → tooling for module operations

Formal:   spl spl/dev/module/new-method --target=spl/project/create
```

### Without vs With DSL Glossary

| Without | With |
|---------|------|
| Guessing at structure | Translating with understanding |
| May generate invalid syntax | Validated against known terms |
| No semantic grounding | Meaning-aware translation |

---

## Three Directions of Use

The DSL glossary enables multiple interaction patterns:

### 1. Do (Execute)

```
User: "Create a greet method in project"
  → DSL lookup → Formal syntax → Confirmation → Execute
```

### 2. Find (Discovery)

```
User: "Where could I find modules that allow me to create methods?"
  → DSL lookup → Discovery

AI: Looks up "method", "create method", "module", "dev"
    "The spl/dev/module API has operations for creating methods.
     Specifically: spl/dev/module/new-method"
```

### 3. Learn (Explanation)

```
User: "What is an api in Splectrum?"
  → DSL lookup → Explanation

AI: Returns definition, structure, relationships from glossary
```

**Same glossary, multiple uses.**

---

## Confirmation as Validation

The confirmation step validates the translation:

```
User: "create a greet method in the project api"

AI: Translates to formal syntax

Confirmation:
  Will create method: spl/project/greet
    Using: spl/dev/module/new-method
    Location: modules/bm_spl/spl/project/greet/
    Structure: index.js, reqs/, selfevals/, schema/, readme/

  Proceed? [y/n]

User: y (confirms translation was correct)
   or n (translation was wrong, try again)
```

The gap between human intent and machine execution shrinks to a confirmation prompt.

---

## The Complete Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    Natural Language                         │
│         "create a method called greet in project"           │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    DSL Glossary                             │
│         (semantic understanding, validation)                │
│                                                             │
│   method → structure, belongs to api                        │
│   api → contains methods, has state                         │
│   dev/module → tooling namespace                            │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                 Fluent Scripting Layer                      │
│         (multiple syntaxes possible)                        │
│                                                             │
│   with api-context spl/project do new-method greet          │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Formal Syntax                            │
│         (strict, unambiguous, stable)                       │
│                                                             │
│   spl spl/dev/module/new-method --target=spl/project/greet  │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Confirmation                             │
│         (functional help, validation)                       │
│                                                             │
│   Will create method: spl/project/greet                     │
│   Proceed? [y/n]                                            │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     Execution                               │
│         (the actual implementation)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Why This Matters

1. **Formal layer never compromises** - stable, testable, unambiguous
2. **Fluent layers evolve independently** - ergonomics without touching core
3. **Natural language is just another fluent layer** - not magic, just parsing
4. **DSL glossary grounds everything** - meaning, not just syntax
5. **Confirmation closes the loop** - validates before executing

AI can work at any level:
- Understand natural language
- Look up semantics in DSL glossary
- Emit formal syntax
- Validate via confirmation

---

## Origin

Emerged from observing that the `with ... do` scripting syntax enables multiple fluent layers. User insight: "by having a strict formal syntax we can then create multiple fluent languages to sit on top of it. And that should allow us to bridge the gap to natural language."

Further discussion revealed DSL glossary as the semantic foundation - enabling translation with understanding, not guessing. The glossary enables not just execution, but discovery ("where could I find modules that allow me to do this?") and explanation.
