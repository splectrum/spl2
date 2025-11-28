# Implementation Approach Design

**Project:** 10 - Dev Env v0 Bundle Continued
**Created:** 2025-11-28
**Status:** Working document - to be formalized at project closure

---

## Overview

Implementation pace should match the maturity of requirements and structure. Rushing implementation without foundation creates technical debt that slows future work.

## The Relationship

```
Requirements coverage → Autonomy level → Implementation pace
```

- **High req coverage** → AI can work autonomously → Fast pace
- **Low req coverage** → Collaborative mode needed → Slow pace

This is not a bug - it's appropriate calibration.

## Implementation Contexts

| Context | Req State | Structure | Approach | Pace |
|---------|-----------|-----------|----------|------|
| Mature | Reqs exist with acceptance criteria | In place | Autonomous execution | Fast |
| Designed | Working doc exists, design clear | Partially in place | Semi-autonomous, milestone check-ins | Medium |
| Emerging | Design being discussed | Being created | Collaborative, step by step | Slow |
| Greenfield | Unclear scope | None | Discussion first, no code until aligned | Very slow |

## Signals to Slow Down

- Making assumptions without checking
- Creating structure alongside implementation
- Backfilling documentation after the fact
- "Let me just get this working" mindset
- Multiple design decisions in single implementation step
- Finding gaps mid-implementation that require discussion

## Signals Autonomy is Appropriate

- Requirements document exists with clear acceptance criteria
- Working against established, documented patterns
- Structure already in place to receive the work
- Changes are mechanical/routine
- Similar work has been done before with documented approach

## Anti-Patterns

### Fast Implementation Without Structure

**What happens:**
1. Rush to get something working
2. Skip structure, docs, reqs
3. It works! Ship it.
4. Later: backfill structure in collaborative mode
5. Slow pace because foundation wasn't laid
6. Technical debt accumulates

**This project's example:**
- Focused on fast implementation of dev env
- Skipped: node structure, event persistence, proper reqs
- Now backfilling in highly collaborative mode
- Each decision needs discussion

### Autonomous Execution Without Reqs

**What happens:**
1. AI makes reasonable assumptions
2. Implements based on implicit understanding
3. Result doesn't match human's mental model
4. Rework required
5. Trust/alignment suffers

**Better:**
- Slow down when reqs are missing
- Make assumptions explicit through discussion
- Capture in working doc before implementing
- Build shared understanding first

## The Right Approach

### When Structure is Missing

1. **Stop** - Don't implement into a vacuum
2. **Discuss** - What should the structure be?
3. **Document** - Capture in working doc
4. **Create structure** - Folders, READMEs, patterns
5. **Then implement** - Into the prepared space

### When Reqs are Missing

1. **Stop** - Don't guess at requirements
2. **Discuss** - What exactly should this do?
3. **Document** - Capture in working doc or req
4. **Validate** - Does this match understanding?
5. **Then implement** - Against documented spec

### Pace Calibration

Ask: "What would I need to execute this autonomously?"

If the answer involves:
- "I'd need to know X" → Discuss X first
- "I'd assume Y" → Make Y explicit
- "The structure for Z doesn't exist" → Create Z first

## Sustainable Pace

Fast pace is sustainable when:
- Reqs are clear
- Structure exists
- Patterns are established
- Work is routine

Slow pace is appropriate when:
- Building foundation
- Establishing patterns
- Design is emerging
- First time doing something

**Trying to go fast when slow is appropriate = debt**
**Going slow when fast is possible = inefficiency**

The skill is reading the context correctly.

## Application to Current Work

**Current state (Session 6):**
- Node structure: designed but not implemented
- Event persistence: discussed but no req
- App model: conceptual, no implementation

**Appropriate approach:**
- Collaborative, step by step
- Discuss before implementing
- Capture decisions in working docs
- Build structure before filling it

**Not appropriate:**
- "Let me implement event persistence quickly"
- Making assumptions about record format
- Creating folders without READMEs

---

## Implementation Levels

Three levels of implementation maturity:

| Level | Style | State | Description |
|-------|-------|-------|-------------|
| **POC** | Freestyle | Proving | Prove it works, adhoc, throwaway ok |
| **Pilot** | Formalized | Initial | Structured, deployed, still evolving |
| **Production** | Formalized | Final | Stable, tested, documented |

### POC (Proof of Concept)

- **Freestyle implementation** - free scripts, adhoc code
- **No corners cut** - this IS the appropriate way to work at POC level
- **Scripts live within the app** - reflects implementation mode
- **Throwaway ok** - learning matters, not the code

### Pilot

- **Formalized** - proper module structure, requirements
- **Initial deployment** - real usage, but still evolving
- **Feedback loop** - learn from pilot usage, refine

### Production

- **Formalized** - same structure as pilot
- **Final state** - stable, tested, documented
- **Changes go through proper process** - not adhoc

### POC Scripts Location

When an app is in POC state, its implementation scripts live within the app:

```
apps/cli-static/           # POC app
├── index.js
├── scripts/               # POC implementation scripts
│   └── faf.js             # Freestyle, proving it out
└── requests/
```

**Why inside the app?**
- Reflects the app's implementation mode (POC)
- Natural place for adhoc experimentation
- No pollution of node-level scripts
- When scripts mature, they graduate to node-level or become modules

### Graduation Path

```
POC script (app/scripts/)
  ↓ proves itself
Node script (splectrum/scripts/)
  ↓ formalizes
Module method (splectrum/modules/)
```

Each level has appropriate expectations. POC work isn't "cutting corners" - it's POC-appropriate work.

## Script and Module Interface Alignment

Scripts and modules share the same interface:

**Same for both:**
- Input: record (Kafka-style)
- Output: result via record
- Use `createSpl` wrapper if needed

**Freedom in scripts:**
- No _lib folder model
- No type module inheritance
- No API constraints
- No formal requirements

**Constrained in modules:**
- Folder structure required
- Type inheritance chain
- Requirements and selfevals

The difference is structure, not interface. Formalizing a script = move to module structure. Code stays same.

## Development Pipeline

```
1. Creative coding (collaborative)
   └── Freestyle scripts, POC, prove it works

2. Create work module (autonomous)
   └── Package into bm_* from implementation result

3. Formal implementation (autonomous)
   └── Add reqs, selfevals, evolve to base module (b_*)
```

**Characteristics:**
- Step 1: Often collaborative, exploratory, creative
- Steps 2-3: Can be offloaded to autonomous agents
- Aligned interface enables clean handoff between steps

**Division of labor:**
- Creative mode: exploring, solving, innovating
- Disciplined mode: packaging, constraining, formalizing

Same AI can do both, but as different activities. Or specialized agents for each.

## Bootstrap Layer

`lib/moduleBootstrap.js` is a real file (not symlink) that provides:

```javascript
export async function requireSpl(methodPath, input, runtime)
```

**Purpose:** Resolve module, import, wrap with createSpl. Returns prepared instance.

**Why separate:** Cannot be inside a module because it enables module loading (chicken-egg).

**Module resolution with app override:**
1. If `runtime.appModuleOverride` and `runtime.appId`: scan `apps/<appId>/modules/` first
2. Then scan `modules/`

---

## Notes

This document captures learnings from Project 10 about matching implementation approach to project maturity. To be refined and potentially added to CLAUDE.md guidance at project closure.
