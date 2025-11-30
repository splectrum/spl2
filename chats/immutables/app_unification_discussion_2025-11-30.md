# App Unification Discussion

**Date:** 2025-11-30
**Context:** Post Project 10 closure, discussing next direction
**Status:** Design discussion capture - not yet formalized

---

## Starting Point

Project 10 achieved:
- Self-hosting dev cycle (deploy, cycle, publish, upgrade)
- Friction with dev bundle workflow led to discovering unified scripting
- App concept prototyped (cli-static)
- Free scripting as first-class citizen

Question: How to unify dev bundle, apps, and free scripting into a powerful unit?

---

## Key Insight: App as Container for Both Modes

The app can contain both freestyle and formal implementation:

```
apps/my-app/
├── scripts/          # Freestyle - prove it, iterate fast
├── modules/          # Formal - requirements, selfevals, types
├── config/           # How it's configured
├── state/            # What it remembers
└── session/          # Runtime (inbox/processing/outbox)
```

**The graduation path:**
```
inline script → library script → app script → app module → node module
     ↑                                                           ↑
  maximum freedom                                        maximum rigor
```

All share same interface: `record, spl, requireSpl, requireNonSpl`

---

## Expanded Vision: Apps as Universal Unit

Several capabilities converge in the app concept:

1. **App = container for freestyle + formal** (scripts + modules together)
2. **App = self-eval builder** (scripts test internals easily)
3. **App = overlay executor** (runs on virtual copy of codebase, isolated)
4. **Dev and Ops become apps themselves** (dog-fooding the pattern)

### Overlay Concept

App can run on its own codebase virtually (in overlay):
- Ideal for install - remains unaffected by mishaps
- Supports rollback
- Supports fixes in isolation

---

## Simplification

Initial thinking was over-engineered. Simplified model:

**The natural flow:**
```
Freestyle script → Works well → Becomes formal module
```

No ceremony needed. The graduation is just moving/structuring the file.

**What becomes redundant:**
- Separate environments
- Deploy/cycle/publish workflow
- Ops sidecar as separate infrastructure

**What remains (simple):**
- App as self-contained unit
- Clone = install (that's it)
- Scripts test things (self-eval is just scripts)
- Structure emerges when you need it

---

## Node From Scratch

```
1. Skeleton:  splectrum/ (folders)
2. Boot app:  apps/boot/
3. Boot installs what's needed
4. Done
```

**Boot app** is the key - it's the installer, the upgrader, the manager. One app that can:
- Create node structure
- Install other apps
- Install modules
- Self-update

---

## Development Workflow (Simplified)

```
1. Clone app (or start fresh)
2. Write scripts, iterate
3. Structure when stable
4. Test = run scripts
```

Standalone autonomous implementation just requires clone/install of the app.
Deployment can be done from an app.

---

## Bringing Dev Bundle and Apps Together

The functionality of dev bundle and ops bundle can be "apped":
- An app can run on its own codebase virtually (overlay)
- This is ideal for install - unaffected by mishaps, rollback, fixes
- Freestyle implementation feeds into formal implementations
- The two modes integrate rather than being separate workflows

---

## Open Questions

1. How exactly does overlay work? (Git-like? File copy? Virtual layer?)
2. Boot app design - what's the minimal viable boot?
3. How do apps discover/depend on each other?
4. Where do node-level modules live vs app-level modules?
5. What's the migration path from current structure?

---

## Next Steps (Not Yet Decided)

Options discussed:
- Start with boot app as foundation
- Solidify app pattern with cli-static first, then build boot
- Need to think carefully before rushing into diverse apps

---

## Key Quotes

"By bringing scripting into the heart of splectrum a lot of internals can be tested in an easy way, I believe apps will be great self eval builder."

"An app can run on its own codebase virtually (in overlay) so that is ideal for install as it can remain unaffected by mishaps / do rollback / fixes etc."

"A lot of the dev bundle becomes redundant. Standalone autonomous implementation just requires a clone or other install of the app."

---

## Status

Discussion captured. Not rushing into implementation - thinking it over carefully first.
