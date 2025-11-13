# Backlog Register Requirements v1.1.0

**Created:** Project 02 (initial-workplan)
**Version:** 1.1.0
**Updated:** 2025-11-13 (clarity and format requirements)
**Applies to:** projects/BACKLOG.md
**Status:** Mature - based on evidence from Projects 02-04

Requirements for Project Backlog register using TDC validation framework.

---

## Purpose

BACKLOG.md is a **work queue** listing projects to be executed in order. Top item is next to execute.

**Not a status tracker** - INDEX.md tracks project status (completed/active/planned).

---

## Requirements

### Structure

Table format with 5 columns:

1. **Backlog Item**
   - Clean project name linked to detail file in `projects/backlog/[name].md`
   - No status indicators (e.g., "COMPLETED", "Initiated", "PROJECT 04")
   - Format: `[Project Name](backlog/project-name.md)`

2. **Priority**
   - MUST be exactly one of: `Critical` | `High` | `Medium` | `Low`
   - No parenthetical explanations (e.g., NOT "High (Foundational)")
   - No compound values (e.g., NOT "High (possibly Critical)")
   - Clean value only

3. **Dependencies**
   - Newline-separated list of backlog item names
   - Empty cell if no dependencies (not "None", not "N/A")
   - Each dependency on separate line in markdown cell
   - Example: `Runtime Hello World<br>Kafka Records`
   - Example (no deps): `` (empty cell)

4. **Addons**
   - Newline-separated list of addon names or references
   - Empty cell if no addons (not "N/A")
   - Each addon on separate line in markdown cell
   - Example: `Phase 1 Dev Setup<br>Import Resolution Experiment`
   - Example (no addons): `` (empty cell)

5. **Comments**
   - What the project IS (objective, scope, deliverables)
   - NOT status (no "COMPLETED", "Initiated", etc.)
   - NOT estimated duration (no "1-2 weeks", "3-5 days")
   - Brief description of project content
   - Example: "Validate Bare platform basics through minimal implementation"

### Execution Order

- Items listed in **execution order** (top to bottom)
- **Top item is next project to execute**
- When project initiated: **remove from BACKLOG.md** (moves to INDEX.md as "Active")
- Backlog represents remaining work only

### Separation of Concerns

**BACKLOG.md:** Work queue (what's next, in order)
**INDEX.md:** Status tracking (what's active, completed, planned)

Do not mix concerns. Status goes in INDEX, work order goes in BACKLOG.

---

## Validation Tests

### Column Format Test

**Each column entry must be clean:**
- Priority: Exact match to `Critical | High | Medium | Low`
- Dependencies: Newline-separated names OR empty
- Addons: Newline-separated names OR empty
- Comments: Content description (no status, no duration)
- Backlog Item: Clean name (no status indicators)

If any column has extraneous format → Fails

### Execution Order Test

**Natural language test:** Is the top item the next project to execute?

If yes → Good
If no (e.g., top item already completed) → Fails

### Dependency Clarity Test

**Natural language test:** Can we see what depends on what without ambiguity?

If dependencies are clear and unambiguous → Good
If "None" vs empty vs "N/A" creates confusion → Fails

---

## Quality Standard

**Good enough:**
- Clean column entries (no format pollution)
- Clear execution order (top = next)
- Unambiguous dependencies and addons
- Comments describe content (not status/duration)
- Maintained: initiated projects removed from backlog

---

## Lifecycle Integration

**At project initiation:**
1. Create new **Project** from backlog item (see STEPPING_STONES_GLOSSARY.md for Project requirements)
2. Remove top item from BACKLOG.md
3. Add project to INDEX.md as "Active"

**Operational definition:** A **Project** exists when it has a folder in `projects/` containing required artifacts (PROJECT_BRIEF.md, DAILY_LOG.md, RISKS.md). Project requirements define creation process.

**At project completion:**
1. Update INDEX.md status to "Complete"
2. BACKLOG.md unchanged (already removed at initiation)

**During backlog grooming:**
- Add new items discovered
- Reorder if priorities/dependencies change
- Remove obsolete items
- Keep backlog focused (8-10 items ideal)

---

## Example Entry

```markdown
| [Bare Runtime Compatibility](backlog/bare-runtime-compatibility.md) | High | Bare Runtime Hello World | Phase 2 Dev Setup | Deep dive into Node.js → Bare workflow, tooling compatibility, SPL2 patterns on Bare platform |
```

**Correct format:**
- Priority: `High` (clean, no explanation)
- Dependencies: `Bare Runtime Hello World` (clean name, no status)
- Addons: `Phase 2 Dev Setup` (clean reference)
- Comments: Describes content (what the project does)

**Incorrect format examples:**
- Priority: `High (Foundational)` ❌
- Dependencies: `None` ❌ (should be empty)
- Addons: `N/A` ❌ (should be empty)
- Comments: `**PROJECT 04 - Initiated** - 3-5 days` ❌ (status + duration)

---

## Changes from v1.0.0

**v1.1.0 changes:**
- Added explicit priority level list (Critical/High/Medium/Low only)
- Changed Dependencies: newline-separated names, empty when none (not "None")
- Changed Addons: newline-separated names, empty when none (not "N/A")
- Changed Comments: content description only (no status, no duration)
- Added execution order requirement (top = next, remove at initiation)
- Added separation of concerns (BACKLOG = work queue, INDEX = status)
- Enhanced validation tests to catch format violations
- Added lifecycle integration guidance
- Added example entry with correct/incorrect formats

**Rationale:** Evidence from Projects 02-04 showed confusion from mixed concerns (status in backlog), ambiguous formats ("None" vs "N/A" vs empty), and priority explanations polluting clean values. These changes enforce clean work queue semantics.
