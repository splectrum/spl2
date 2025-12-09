# whoami/selfeval Twin Design

**Status:** Working document
**Project:** 11-app-architecture

---

## Core Insight

whoami and selfeval form a twin pair:
- **whoami**: reports actual state (descriptive)
- **selfeval**: validates against expected state (prescriptive)

The data from whoami feeds into selfeval for structural validation.

## Terminology

| Term | Meaning |
|------|---------|
| freetext | free-form prose, unstructured |
| structured | organized format (fields, schema), may contain natural language |

The axis is structure, not language type. Both can contain natural language.

## Report-First Architecture

whoami builds structured report as source of truth. Freetext is derived.

```
whoami
  ↓
structured report (source)
  ↓              ↓
freetext         comparator
(derived)        (consumes directly)
```

**Flow:**
1. whoami builds structured report
2. freetext is rendered FROM report (not separate logic)
3. gradedOutput levels = different renderings of same data

```
report (structured)
  ↓
topline:  render(report, 'topline')   → "schemas - input.avsc, metaoutput.avsc"
summary:  render(report, 'summary')   → "schemas:\n  input.avsc - ..."
detail:   render(report, 'detail')    → "schemas:\n  input.avsc - ...\n    fields..."
enriched: render(report, 'enriched')  → "schemas:\n  ... + DSL lookups"
```

No duplication. Report is built once, rendered at requested level.

## Report Format Contract

Report format serves multiple consumers:

```
whoami --report
    ↓
┌─────────────────────────────────┐
│  report format (the contract)  │
└─────────────────────────────────┘
    ↓              ↓
selfeval        general use
comparator      (inspection, tooling, humans)
```

**Format requirements:**
- Consistent shape across all components (predictable)
- Self-describing (understandable without context)
- Directly comparable (no transformation needed for selfeval)
- Compositional (assemble parts as needed)

## Accumulation Model

whoami uses additive accumulation - each call adds to existing report:

```
{}
  → whoami({ report, component: 'schemas' })   → { facets: { schemas: {...} } }
  → whoami({ report, component: 'lib' })       → { facets: { schemas: {...}, lib: {...} } }
  → whoami({ report, component: 'container' }) → { facets: {...}, container: {...} }
  → whoami({ report, component: 'wrapper' })   → { wrapper: {...}, container: {...}, facets: {...} }
```

**Properties:**
- Single method, mode determines behavior
- Each call adds to the accumulator
- Wrapper must be last (it introspects accumulated content)
- Partial reports are valid (just missing wrapper)

**Open composition:**
Report can accumulate from multiple sources:

```
report = {}
report = whoami(api/foo, { report, component: 'schemas' })
report = whoami(api/bar, { report, component: 'schemas' })
report = whoami(package, { report, component: 'wrapper' })
```

Enables rollup reports, selective assembly, hierarchical binding.

**Report-as-container:**
The report itself is a general data container. Wrapper applies the same whoami functionality to the report - it's whoami on the accumulated data. No special cases.

## Reducer Components

Wrapper is one type of reducer - operates on accumulated report:

| Reducer | Purpose |
|---------|---------|
| wrapper | TOC + structural summary |
| (future) execSummary | Key findings, highlights |
| (future) diff | Changes from baseline |

Each reducer takes accumulated report, produces distinct output, stays in its lane.

**Wrapper scope (spider principle):**
- Reports on: what's in this report, aggregation context, report meta
- Does NOT report on: container internals, facet details
- Wrapper is the table of contents, not the chapters

### Report Structure

Three components, all following same format:

```json
{
  "wrapper": { ... },     // report meta
  "container": { ... },   // root files (index.js, README.json, ...)
  "facets": { ... }       // internal folders (_schemas, _lib, _reqs, ...)
}
```

| Component | Maps to | Contents |
|-----------|---------|----------|
| wrapper | report itself | meta: what's in this report |
| container | root files | index.js, README.json, etc. |
| facets | internal folders | _schemas, _lib, _reqs, _selfevals |

### Component Format

Each component has topline/summary/detail/enriched, but schemas can vary.

**Schema flexibility:**
- Schema can vary by level (topline vs summary vs detail vs enriched)
- Schema can vary by component (wrapper vs container vs facets)
- Schema can vary by facet (schemas vs methods vs lib vs reqs)
- Only constraint: freetext render can make sense of it

**Output format per level (consistent):**

| Level | Output format | Schema → Rendering |
|-------|--------------|-------------------|
| topline | title | any schema → single title line |
| summary | prose | any schema → brief paragraph |
| detail | table | records with fields → table |
| enriched | annotated table | table + context (topline/summary per item) |

Schema varies, output format consistent. Renderer is pattern-aware.

**Each level owns its concern:**
- **topline**: identifiers for title
- **summary**: descriptions for prose
- **detail**: full data for table
- **enriched**: external context with wrapper

**Enriched structure (has its own wrapper):**
```json
"enriched": {
  "wrapper": {
    "sources": ["glossary/dsl.json"],
    "description": "DSL term lookups for schema fields"
  },
  "items": {
    "dryRun": { "topline": "native", "summary": "show execution plan..." }
  }
}
```

Enriched items show topline/summary of context - not full detail of external source.

### Filesystem Mapping

```
spl/container/
  ├── README.json       ← container component
  ├── index.js          ← container component
  ├── _schemas/         ← facets.schemas
  ├── _lib/             ← facets.lib
  ├── _reqs/            ← facets.reqs
  ├── _selfevals/       ← facets.selfevals
  └── whoami/           ← child container (method)
```

### Levels Syntax

Type chain traversal using range syntax:

| Syntax | Meaning |
|--------|---------|
| `1` | just this container |
| `1-2` | this + immediate parent |
| `1-3` | this + 2 levels up |
| `1-` | this + all ancestors (full chain) |

In wrapper:
```json
"wrapper": {
  "summary": {
    "container": "spl/api",
    "levels": "1-2",
    "resolved": ["spl/api", "spl/container"]
  }
}
```

### Sparse Handling

**whoami** = reports what IS (descriptive)
- If exists → in report
- If doesn't exist → not in report
- No "required/optional" markers
- No "missing" indicators
- Just actual state

**selfeval** = compares against expectations (prescriptive)
- Compares whoami output vs requirements
- Determines what's missing
- Pass/fail judgments

whoami reports presence, not absence. Sparse is natural.

### Example Report

```json
{
  "wrapper": {
    "topline": {
      "container": "spl/container",
      "facets": ["schemas", "lib"],
      "children": ["whoami", "selfeval"]
    },
    "summary": {
      "container": "spl/container",
      "levels": "1",
      "resolved": ["spl/container"],
      "facets": ["schemas", "lib"],
      "children": ["whoami", "selfeval"]
    },
    "detail": { ... },
    "enriched": { ... }
  },

  "container": {
    "topline": {
      "name": "spl/container",
      "extends": null
    },
    "summary": {
      "extends": null,
      "instantiates": null,
      "purpose": "Base container type"
    },
    "detail": {
      "extends": null,
      "instantiates": null,
      "purpose": "Base container type",
      "files": ["index.js", "README.json"]
    },
    "enriched": {
      "wrapper": {
        "sources": ["glossary/dsl.json"],
        "description": "DSL lookups for container terms"
      },
      "items": {
        "container": { "topline": "native", "summary": "envelope around a data structure..." }
      }
    }
  },

  "facets": {
    "schemas": {
      "topline": {
        "files": ["input.avsc", "metaoutput.avsc"]
      },
      "summary": {
        "input.avsc": "Universal handler flags",
        "metaoutput.avsc": "Narrative output structure"
      },
      "detail": {
        "input.avsc": [
          { "name": "dryRun", "type": "boolean", "doc": "Preview only" },
          { "name": "silent", "type": "boolean", "doc": "Omit narrative" }
        ]
      },
      "enriched": {
        "wrapper": {
          "sources": ["glossary/dsl.json"],
          "description": "DSL lookups for schema fields"
        },
        "items": {
          "dryRun": { "topline": "native", "summary": "show execution plan..." },
          "silent": { "topline": "foreign", "summary": "maps to topline" }
        }
      }
    }
  }
}
```

### Composition Model

Report is compositional building blocks, not monolithic:

```
render(topline)  = wrapper.topline + container.topline + facets[].topline
render(summary)  = wrapper.summary + container.summary + facets[].summary
render(detail)   = wrapper.detail + container.detail + facets[].detail
render(enriched) = TOC(all toplines) + wrapper.enriched + container.enriched + facets[].enriched
```

Benefits:
- Request single facet → get just that block
- Request container only → identity info
- Compose full report from parts
- No duplication in format
- Flexible assembly

## Two Comparison Modes

Same source data enables two comparison paths:

### Freetext Comparison (AI-powered)

```
req (freetext) ←→ whoami freetext → AI → pass/fail
```

- req freetext: "A container must have whoami, selfeval, typeof methods"
- whoami freetext: "methods: whoami, selfeval"
- AI evaluates: "typeof missing" → FAIL

### Structured Comparison (deterministic)

```
req → extraction → structured expected
                        ↓
whoami report ────→ diff → pass/fail
```

- expected: `{ required_methods: ["whoami", "selfeval", "typeof"] }`
- actual: `{ methods: ["whoami", "selfeval"] }`
- diff: "typeof missing" → FAIL

### Comparison Mode Selection

| Mode | When | Pros |
|------|------|------|
| freetext (AI) | exploratory, early stage | flexible, no extraction pipeline needed |
| structured | mature, CI | deterministic, fast, automatable |

## selfeval Report Dependency

selfeval consumes whoami report. The dependency chain:

```
whoami (builds report)
  ↓
report (structured data)
  ↓
selfeval (validates against expectations)
```

### selfeval Input Requirements

selfeval needs from whoami:
- **report.facets** - what exists to validate
- **report.container** - identity to check against type requirements
- **freetext** - for AI comparison mode

selfeval does NOT need:
- wrapper (that's for human consumption)
- enriched level (DSL context is whoami's domain)

### Component Dependencies

| selfeval validates | Needs from whoami |
|-------------------|-------------------|
| schemas compliance | facets.schemas (detail level) |
| method presence | facets.methods (topline level) |
| type chain | container (extends, instantiates) |

### Accumulation for selfeval

selfeval can request specific components:

```
report = {}
report = whoami({ report, component: 'schemas' })
report = whoami({ report, component: 'container' })
// no wrapper needed - selfeval consumes raw report
selfeval({ report, req: '...' })
```

selfeval works with partial reports - validates what's present.

## selfevalWhoami Harness

```
selfevalWhoami (harness)
  │
  ├── per facet iteration
  │     ├── whoami --facet=schemas --report → preprocessed actual
  │     ├── whoami --facet=methods --report → preprocessed actual
  │     ├── whoami --facet=reqs --report    → preprocessed actual
  │     └── ...
  │
  ↓
comparator (generic)
  │
  ├── expected (from req / AI interpretation)
  ├── actual (from whoami)
  └── diff → pass/fail
```

**whoami does preprocessing:**
- Discovers what exists
- Shapes per facet
- Outputs structured data ready for comparison

**selfevalWhoami harness:**
- Iterates facets
- Calls whoami per facet with --report
- Feeds to comparator
- Collects results

**Comparator:**
- Generic
- Expected vs actual (freetext or structured)
- Reports differences

## Pipeline Architecture (Future)

When structured comparison needed:

```
freetext req (source)
  ↓ [extraction] ← quality gate
intermediate
  ↓ [structuring] ← quality gate
structured test cases
  ↓ [comparison] ← quality gate
whoami report
  ↓
pass/fail
```

Pipeline enables quality gates (selfevals) at each transformation step.

Each step is:
- Inspectable (whoami)
- Validatable (selfeval)
- Traceable on failure

## mac Implementation

**Minimal:**
- whoami builds structured report, renders freetext
- selfevalWhoami compares req freetext ↔ whoami freetext via AI
- No extraction pipeline yet

**Complete:**
- Validation works
- Actual vs expected comparison happens
- Pass/fail result

**Good design:**
- Report-first architecture in place
- Structured comparison can be added later
- Pipeline emerges when needed

```
Now (mac):
  req freetext ←→ whoami freetext → AI → pass/fail

Later (when needed):
  req freetext → extraction → structured expected
                                    ↓
  whoami report (structured) ──→ diff → pass/fail
```

## Output Levels

Native progression:
- topline (minimal)
- summary (compact)
- detail (full)
- enriched (full + context)

Foreign mappings:
- silent → topline
- verbose → detail
- debug → enriched

## Implementation Steps

1. ✓ DSL glossary alignment (debug → enriched)
2. ✓ Fix whoami code (enriched, category lookup)
3. Refactor whoami: report-first architecture
   - Build structured report (wrapper, container, facets)
   - Render freetext from report per level
   - Pattern-aware renderer (title, prose, table, annotated)
4. Implement facets
   - schemas facet (already partial)
   - container component (README.json, root files)
   - wrapper component (report meta)
   - children listing (methods as child containers)
5. Add selfevalWhoami harness with AI comparison
6. Structured comparison pipeline (when needed)

## Open Questions

- How does AI comparison receive the req freetext?
- Which facets to prioritize after schemas?
- Renderer implementation: single smart function or per-level functions?
