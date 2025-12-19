# CLAUDE.md - Splectrum

## Session Entry (MANDATORY)

Treat MANDATORY as MANDATORY, it is there for a reason.
Do all this before doing anything else:

1. `spl get-started crud` - file operations (create, read, write, delete resources)
2. `spl get-started tools` - tool wrapper principles (use spl tools/X not raw X)
3. `spl get-started` - general operational reference
4. Read `status/CURRENT.md` - current project, next tasks, known issues
5. Speed is not important, quality is.

## Quick Start

```bash
spl get-started           # Operational reference
spl get-started libs      # lib require pattern and factory model
spl get-started <topic>   # Topic detail (ai-first, reqs, crud, etc.)
```

## Project Purpose

Splectrum is a platform for AI to create and manage software solutions. AI-optimized, maximum freedom of implementation.

## CRITICAL: Collaboration First

**This is collab land. If in any doubt, ASK.**

- Don't assume external conventions apply - splectrum has its own approach
- If it's not in a req, discuss it first before implementing
- Don't jump to solutions - discuss design choices
- When unsure: stop, think, ask

**Use splectrum tools:** Always prefer `spl` commands over raw bash/file operations.

**Never guess commands:** If you don't know a command, consult `spl get-started` or ask. Do not invent or guess command names.
