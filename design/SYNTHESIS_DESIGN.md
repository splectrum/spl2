# Synthesis and AI Context Design

**Purpose:** Design for documentation synthesis, analysis, and AI context optimization
**Status:** Draft (vision crystallizing)
**Created:** 2025-12-16

---

## Vision

Splectrum is AI-first. The platform should optimize context, visibility, and insight for AI collaboration. Synthesis is the foundational capability that enables this.

**Traditional documentation:** Written for humans, scattered across files, AI must grep/scan to understand.

**Synthesized model:** Structured for query, optimized for context injection, AI asks and gets coherent answers.

---

## The Problem

Documentation naturally distributes across the codebase:
- Req files in `_reqs/` describe individual containers
- Package-level docs describe groupings
- Type definitions describe structure and behavior
- Design docs capture architecture decisions
- Glossaries define vocabulary

This distribution is correct - "local rules apply" means each container is self-describing. But it creates a visibility challenge:
- No single view of the whole
- Hard to see connections and gaps
- AI must spider manually to build understanding
- Consistency issues hide in the distribution

---

## The Approach: Distributed Sources, Synthesized View

### Principle

Keep documentation distributed (where it belongs), but synthesize a coherent view on demand.

```
Distributed Sources              Synthesized View
───────────────────              ────────────────
_reqs/*.md          ──┐
package docs        ──┼──→  Spider  ──→  Aggregate  ──→  Synthesize
type definitions    ──┤                                      │
design docs         ──┘                                      ▼
                                                    Queryable Model
```

Each container remains self-contained. Synthesis weaves them into a coherent picture.

### What Gets Synthesized

| Source | Extracts |
|--------|----------|
| `_reqs/*.md` | Requirements, specs, roadmap items |
| `index.json` | Identity, type, extends chain |
| `_schemas/*.avsc` | Data contracts, interfaces |
| Package structure | Organizational groupings |
| Type hierarchy | Inheritance, capabilities |
| Selfeval results | Quality state, validation status |

### Output: The Install Model

Synthesis produces a model of the install:

```javascript
{
  identity: { name, version, description },
  packages: [
    {
      name: "spl/introspection",
      purpose: "...",
      types: [...],
      methods: [...],
      reqs: [...],
      quality: { selfeval_status, coverage }
    }
  ],
  types: {
    hierarchy: [...],
    definitions: [...]
  },
  roadmap: {
    planned: [...],
    in_progress: [...],
    gaps: [...]
  },
  vocabulary: {
    glossary_terms: [...],
    patterns: [...]
  }
}
```

This model IS the documentation - structured, queryable, complete.

---

## Analysis Layer

Synthesis enables analysis. Once you have a model, you can query it.

### Consistency Checks

- Do requirements contradict each other?
- Do type definitions conflict?
- Do extends chains resolve correctly?
- Do schemas align across boundaries?

### Coverage Analysis

- What's speced but not implemented?
- What's implemented but not tested?
- What's implemented but not documented?
- What types are defined but never instantiated?

### Roadmap Analysis

- What's referenced but doesn't exist?
- What's marked TODO/FUTURE?
- What's blocked by what?
- What's the dependency graph?

### Quality State

- Selfeval aggregated across all containers
- Pass/fail/skip counts
- Trend over time
- Problem areas highlighted

---

## AI Context Optimization

### The Vibe Engineering Approach

Splectrum optimizes for AI collaboration through "vibe engineering":
- Right context at the right time
- Coherent understanding, not scattered facts
- Insight emerges from structure

Synthesis is the infrastructure for this.

### RAG-Ready Architecture

The synthesized model enables retrieval-augmented generation:

```
AI Task: "Add a new introspection method"
    │
    ▼
Query synthesis model:
    - What is spl/introspection? (type, purpose)
    - What methods exist? (whoami, selfeval, select)
    - What patterns apply? (lib pattern, four-level output)
    - What's the roadmap? (select is planned)
    │
    ▼
Receive: coherent context chunk
    │
    ▼
Work with insight, not grep
```

### Context Injection Patterns

**Task-based retrieval:**
```
Task type              Retrieve from synthesis
──────────             ──────────────────────
Add method         →   Package structure, type patterns, naming conventions
Fix bug            →   Related reqs, selfeval results, type chain
Understand system  →   Package overview, type hierarchy, vocabulary
Check quality      →   Selfeval aggregation, coverage gaps
```

**Depth control:**
- Topline: one-sentence summaries
- Summary: paragraph descriptions
- Detail: full specifications
- Enriched: with examples, history, connections

(Mirrors the four-level output pattern from introspection)

---

## Implementation: Introspection Methods

Synthesis fits naturally as introspection methods:

### `spl spl/introspection/synthesize`

Build the model for a container/package/install:

```bash
spl spl/introspection/synthesize              # whole install
spl spl/introspection/synthesize spl/crud     # specific package
```

**Output:** The synthesized model (JSON structure)

### `spl spl/introspection/analyze`

Run analysis on the synthesized model:

```bash
spl spl/introspection/analyze --consistency
spl spl/introspection/analyze --coverage
spl spl/introspection/analyze --roadmap
spl spl/introspection/analyze --quality
spl spl/introspection/analyze --all
```

**Output:** Analysis report with findings

### `spl spl/introspection/context`

Get context for a specific task:

```bash
spl spl/introspection/context "adding a method to spl/introspection"
spl spl/introspection/context "understanding the type system"
```

**Output:** Relevant context chunk, RAG-optimized

---

## Connection to Existing Patterns

### Mycelium

Synthesis is mycelium-native:
- Spider through entrypoints
- Each node self-describes
- Weave into coherent web
- No central orchestrator - synthesis emerges from structure

### Introspection

Synthesis extends introspection:
- `whoami` = what is this one container?
- `synthesize` = what is this collection of containers?
- Same pattern, different scope

### Selfeval

Analysis extends selfeval:
- Container selfeval = does this container meet its reqs?
- Install analysis = does this install meet quality standards?
- Meta-selfeval at system level

### Four-Level Output

Synthesis follows the established output pattern:
- Topline → Summary → Detail → Enriched
- Depth appropriate to need
- Same libs (report.js, freetext.js)

---

## Benefits

### For Human

- Single view of distributed documentation
- Visibility on what's there and what's missing
- Quality state at a glance
- Roadmap clarity

### For AI

- Coherent context, not scattered files
- Query-based understanding
- RAG-ready structure
- Work with insight, not grep

### For System

- Consistency enforcement
- Coverage tracking
- Quality metrics
- Self-documenting installs

---

## Evolution Notes

This design crystallizes from ongoing discussions about:
- Documentation visibility challenges
- AI context optimization
- Vibe engineering approach
- RAG integration patterns

The vision has become clearer through use - not a change of course, but focus sharpening. The foundational patterns (mycelium, introspection, selfeval) already pointed this way. Synthesis makes the implicit explicit.

---

## Roadmap

1. **synthesize** - Build the model (spider, aggregate, structure)
2. **analyze** - Run checks (consistency, coverage, quality)
3. **context** - Task-based retrieval (RAG integration)
4. Libs shared for reuse across methods

---

## Related

- `spl/introspection/_reqs/spl_introspection_type_v1.0.0.md` - Base introspection type
- `design/API_DESIGN.md` - Four-level output pattern
- `projects/11-app-architecture/elevator-pitch/MYCELIUM_BLOCK.md` - Mycelium patterns
- `projects/11-app-architecture/elevator-pitch/VIBE_ENGINEERING_COMPARISON.md` - Vibe engineering context
