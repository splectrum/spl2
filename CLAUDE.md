# CLAUDE.md - SPL2 Project Navigation

## Project Purpose

SPL2 is a platform for AI to create and manage software solutions with a focus on P2P applications. Clean restart from spl1 - simplified, AI-optimized, with maximum freedom of implementation.

## Start Here (New Session)

**Understand how we work:**
- Read `foundations/WOW.md` - Philosophy, PRINCE2, TDC methodologies
- Read `foundations/PRINCIPLES.md` - What SPL2 is, design principles

**Understand current state:**
- Read `projects/INDEX.md` - Completed projects and current status
- Read `projects/BACKLOG.md` - Next work to do (9 projects with priorities)

**Everything else references from these foundation documents.**

## Repository Structure

```
spl2/
├── foundations/          # How we work (WOW) and what we build (PRINCIPLES)
│   ├── WOW.md           # References versioned detail files in projects/
│   └── PRINCIPLES.md    # References versioned detail files in projects/
├── projects/            # All project work
│   ├── INDEX.md         # Project status register
│   ├── BACKLOG.md       # Work to do (with priorities/dependencies)
│   ├── backlog/         # Individual backlog item details
│   ├── 01-*/            # Completed project 01 with artifacts
│   └── 02-*/            # Completed project 02 with artifacts
├── archive/             # Reference: spl1 materials (legacy)
├── CLAUDE.md            # This file - navigation guide
└── README.md            # Project overview
```

## How Documentation Works

**Living documents pattern:**
- Foundations (WOW.md, PRINCIPLES.md) are **headlines** - concise, stable
- Detail files live in project folders - **versioned** (e.g., Philosophy_v1.1.0.md)
- Foundations reference current version of detail files
- Each project folder contains artifacts created during that project
- All artifacts reference their requirements document (first line)

**Example:** WOW.md says "See Philosophy_v1.1.0.md for current philosophy" - that file lives in the project folder where it was created/evolved.

## Key Patterns Established

**Artifact-to-requirements pinning:**
- All artifacts reference their requirements version (first line)
- Enables quality assessment and versioned evolution
- See TDC_framework_v1.1.0.md for full pattern

**Minimal and complete:**
- Start minimal, add based on evidence
- Over-engineering is ongoing risk (see Philosophy_v1.1.0.md)
- Question every addition: is this needed NOW?

**Explorative projects:**
- Discover through doing, not planning upfront
- Twin pair pattern (deliverable + template in parallel)
- Skip work when discovery reveals it's unnecessary

## Where to Find Things

**How we work:** `foundations/WOW.md` → references detail files
**What we're building:** `foundations/PRINCIPLES.md` → references detail files
**Project status:** `projects/INDEX.md`
**Next work:** `projects/BACKLOG.md`
**Completed project artifacts:** `projects/01-*/`, `projects/02-*/`
**Lessons learned:** `projects/XX-*/LESSONS_LEARNED.md` in each project folder
**Detailed methodology:** Follow references from WOW.md to versioned files

## Archive (Reference Only)

`archive/spl1-docs/` and `archive/spl1-spl-dev/` contain legacy spl1 materials. Reference when specific proven solutions are needed, but don't feel constrained by spl1's architecture.
