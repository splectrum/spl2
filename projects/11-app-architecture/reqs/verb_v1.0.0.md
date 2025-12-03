# verb

**Version:** 1.0.0
**Type:** Structure
**Context:** Splectrum app-internal operations

---

## Definition

A verb is an app-internal command - a single-word operation that executes within the app context.

## Purpose

Verbs provide app-internal operations that cannot clash with package names. Since packages are nouns (spl, pr09, etc.), verbs (set, clear, reset) are unambiguously app commands.

## Characteristics

- Single word (no `/` separator)
- Always an action word (verb in grammatical sense)
- Cannot be a package name
- Operates on app state, not module methods

## Examples

| Verb | Purpose |
|------|---------|
| set | Set a context value |
| clear | Remove a context value |
| reset | Reset all context to defaults |
| status | Query current state |

## Parsing Rule

When parsing input:
- If first token contains `/` → package path (formal syntax)
- If first token is single word → check if verb, else error

## Relationship to Methods

Verbs are NOT methods. Methods live in the module hierarchy (package/api/method). Verbs are built-in app operations that manage context for method invocation.

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
