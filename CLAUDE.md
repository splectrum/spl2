# CLAUDE.md - SPL2 Project

## Project Purpose

SPL2 is a simplified, AI-friendly reimplementation of the SPL1 project. This is a clean restart designed to remove unnecessary internal implementation constraints while maintaining complete output data and metadata.

## Core Principles

**Primary Goals:**
- **Simplest Implementation**: Remove overly complicated constraints on internal implementation
- **Complete Output**: Ensure all output data and metadata is complete in raw form
- **Maximum AI Freedom**: Allow AI maximal freedom of implementation choices

**Approach:**
- Clean start from scratch (not a migration or refactor)
- Reference spl1 archive only for proven good solutions
- No legacy constraints or technical debt
- AI-optimized structure and patterns

## Repository Structure

```
spl2/
├── archive/
│   ├── spl1-docs/        # Reference: documentation from spl1
│   └── spl1-spl-dev/     # Reference: implementation from spl1
├── CLAUDE.md             # This file - operational guidance
├── README.md             # Project overview
└── [new implementation]  # To be designed based on user notes
```

## Archive Contents

The `archive/` folder contains reference materials from spl1:
- **spl1-docs/**: All documentation, guides, and specifications from spl1
- **spl1-spl-dev/**: Complete implementation code from spl1

**Important**: The archive is for reference only. Selectively adopt what worked well, but don't feel constrained by spl1's architecture or patterns.

## Next Steps

1. Review user's notes on new implementation approach (location TBD)
2. Design minimal core structure based on requirements
3. Implement with maximum freedom for AI decision-making
4. Reference spl1 archive when specific proven solutions are needed

## Working in SPL2

- All work should be done in the spl2 repository
- spl1 is legacy - refer to archive/ when needed
- Focus on simplicity and AI-friendliness over matching spl1 patterns
- Complete output/metadata is mandatory; implementation approach is flexible

## Context from Initial Conversation

**User Requirements:**
- Wants to recreate spl1 project but simplified and more AI-friendly
- Finds spl1 overly complicated due to unnecessary internal constraints
- Primary goal: Most simple implementation that is complete in terms of output data and metadata
- Wants to allow AI maximal freedom of implementation

**Decision Made:**
- Created fresh spl2 repository
- Archived spl1 materials for reference
- Starting clean to avoid legacy baggage
- Will define new structure based on user's design notes
