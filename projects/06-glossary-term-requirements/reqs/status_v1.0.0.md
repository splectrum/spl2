**Type:** plain req

# status/

## Spec

**spot** - Check current state of repository across all aspects.

Activity: Understand what's happening now - active work, recent context, health indicators.

Contents:
- CURRENT.md - Active work, recent context, session entry point
- Other status artifacts as needed

Purpose: Single place for "current state" information. Reduces dynamic update load on other documents (CLAUDE.md, INDEX.md). Session starting point for understanding what's active.

Scope: Repository top-level spot.

## Self-eval

- [ ] Contains CURRENT.md with active work information
- [ ] Reduces need for frequent CLAUDE.md updates
- [ ] Provides clear session entry point
- [ ] Single concern: current repository state

## Comments

Emerged from Project 07 closure discussion about dynamic load minimisation. CLAUDE.md should point here for "what's happening now" rather than containing frequently-changing status information.
