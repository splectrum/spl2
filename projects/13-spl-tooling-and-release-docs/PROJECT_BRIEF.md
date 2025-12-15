**Requirements:** projects/04-bare-runtime-hello-world/Exploration_project_requirements_v1.1.0.md
**Requirements:** projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md

# Project 13: spl Tooling and Release Documentation

**Type:** Exploration Project
**Created:** 2025-12-15
**Status:** Initiated

---

## Overview

Complete spl tool coverage, implement systematic history tracking (faf), and build release documentation generator for validation and session transfer support.

## Problem

- Current sessions drift to non-splectrum tooling (bash, grep, raw file ops)
- No systematic history tracking - can't audit what we're not tracking
- Release documentation would enable defect/omission detection
- Generated docs support session transfer and CLAUDE.md context

## Scope

### Part 1: Tool Coverage + History

**Improve existing tooling:**
- Fill gaps in current spl tools
- Ensure all common operations have spl equivalents
- Move away from bash/external tools

**Create additional tooling:**
- Tools for operations currently done manually
- Scripting helpers where needed

**Systematic history tracking (faf):**
- Fire-and-forget event capture
- Record spl operations
- Foundation for later audit capability

### Part 2: Release Documentation Generator

**Generate from release:**
- Container catalog with hierarchy
- API reference (methods, inputs, outputs)
- Type documentation
- Req summaries per container
- Schema documentation

**Use cases:**
- Detect defects/omissions in req/implementation/structure
- Collaborative review of intentions vs reality
- Evaluate work done against roadmap vision
- Feed CLAUDE.md with fresh context

## Products

*To be defined during initiation phase (collaborative)*

## Quality Criteria

*To be defined during initiation phase (collaborative)*

## Success Criteria

1. Common operations have spl equivalents (reduced drift to external tools)
2. History tracking captures spl operations (foundation for audit)
3. Release doc generator produces useful output
4. Generated docs enable defect/omission detection

## Open Questions

- What operations most commonly drift to bash/external tools?
- faf storage format and location?
- Release doc output format (markdown, JSON, both)?
- Integration with existing CLAUDE.md workflow?

## Related

- Backlog item: projects/backlog/spl-tooling-and-release-docs.md
- Enables: Audit processing (subsequent project)
- Enables: Dynamic CLAUDE.md session entry
