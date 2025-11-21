# spl/bug API (Phase 1)

**Priority:** High
**Type:** Implementation Project
**Dependencies:** spl/pipeline API
**Phase:** 1 - Implementation Pipeline

---

## Overview

Early bug report infrastructure. Captures execution failures with complete context for reconstruction. Enables exact failure reproduction.

---

## Scope

### Core Components

| Component | Description |
|-----------|-------------|
| **Bug capture** | Create bug report from execution failure |
| **Context packaging** | Bundle all reconstruction context |
| **Report format** | Structured bug report schema |
| **Storage** | Where bug reports live |

### Context to Capture

- Code version (git commit, file hashes)
- Input data that triggered failure
- Environment state
- Execution trace/stack
- Error details

### Questions to Explore

- Minimum context for reconstruction?
- Report format - AVRO schema?
- Integration with dev cycle (bug → fix workflow)
- Naming: spl/bug vs spl/problem vs spl/issue (revisit at ITIL introduction)

---

## Why Phase 1

1. **Natural follow-on from spl/execute** - failures need somewhere to go
2. **Reconstruction-based architecture** - core SPL2 pattern
3. **Enables automated bug fix workflows** - bug report as requirement input
4. **Early feedback** - learn what context actually matters

---

## Expected Products

1. `spl/bug` API design
2. Bug report schema (capture format)
3. Report creation from execution failure
4. Storage mechanism
5. Self-eval specs for the API

---

## Success Criteria

1. Execution failure produces structured bug report
2. Bug report contains sufficient context for reconstruction
3. Report can serve as input to fix workflow
4. Self-eval validates capture completeness

---

## Notes

- Naming TBD - using "bug" for Phase 1 pragmatism
- Will revisit vocabulary when ITIL introduction happens
- Keep minimal - learn from use what's actually needed

---

**Created:** 2025-11-21
**Source:** Project 09 planning chat
