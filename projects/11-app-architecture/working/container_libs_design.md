# Container Libs Design

**Status:** Working document
**Project:** 11-app-architecture

---

## Overview

The core introspection and validation logic lives in `spl/container/_lib/`. Methods (whoami, selfeval) are thin orchestrators that call these libs.

## Architecture

```
spl/container/
  ├── index.json                 ← container identity (flat facts)
  ├── index.js                   ← container handler
  ├── _lib/
  │     ├── index.json           ← lib manifest
  │     ├── report.js            ← facet → four-level structure
  │     ├── freetext.js          ← four-level structure → natural language
  │     └── selfeval.js          ← four-level structure + req → validation
  ├── _schemas/
  │     └── index.json           ← schemas manifest (flat facts)
  ├── _reqs/
  │     └── index.json           ← reqs manifest (flat facts)
  ├── whoami/
  │     ├── index.json
  │     ├── index.js
  │     └── _lib/
  │           └── whoami.js      ← orchestration: components, accumulation
  └── selfeval/
        ├── index.json
        ├── index.js
        └── _lib/
              └── selfeval.js    ← orchestration: what to validate, aggregation
```

## Container Libs (`spl/container/_lib/`)

### report.js

Builds four-level structure from flat facts (index.json).

**Input:** facet index.json (flat facts)
**Output:** four-level structure (topline/summary/detail/enriched)

```js
export function create(module) {
  return {
    // Build report for a facet from its index.json
    buildFacet(facetName, indexJson) {
      return {
        name: facetName,
        topline: buildTopline(indexJson),
        summary: buildSummary(indexJson),
        detail: buildDetail(indexJson),
        enriched: buildEnriched(indexJson)
      }
    },

    // Build report for container identity
    buildIdentity(indexJson) { ... },

    // Build report for handler (from index.js header)
    buildHandler(headerComment) { ... }
  }
}
```

**Responsibilities:**
- Read flat facts from index.json
- Transform to four-level structure
- Compute rollups (counts, summaries)
- No orchestration - single facet at a time

### freetext.js

Renders four-level structure to natural language.

**Input:** four-level structure, level (1-4)
**Output:** natural language string

```js
export function create(module) {
  return {
    // Render a single facet at specified level
    renderFacet(facetReport, level) {
      // level 1: topline only
      // level 2: topline + summary
      // level 3: topline + summary + detail
      // level 4: topline + summary + detail + enriched
      return lines.join('\n')
    },

    // Render container line
    renderContainer(containerReport, level) { ... }
  }
}
```

**Responsibilities:**
- Convert structure to natural language
- Handle level accumulation (1 → 2 → 3 → 4)
- Format output (indentation, separators)
- No orchestration - single component at a time

### selfeval.js

Validates four-level structure against requirements.

**Input:** four-level structure, req (freetext or structured)
**Output:** validation result (pass/fail, differences)

```js
export function create(module) {
  return {
    // Validate a facet report against a req
    validateFacet(facetReport, req) {
      return {
        facet: facetReport.name,
        pass: boolean,
        differences: [...]
      }
    },

    // Freetext comparison (AI-powered)
    compareFreetext(actual, expected) { ... },

    // Structured comparison (deterministic)
    compareStructured(actual, expected) { ... }
  }
}
```

**Responsibilities:**
- Compare report against req
- Support freetext (AI) and structured comparison
- Return pass/fail with differences
- No orchestration - single facet at a time

## Method Libs

### whoami/_lib/whoami.js

Orchestrates report building across components.

**Responsibilities:**
- Determine which facets to include
- Call report.js for each facet
- Call freetext.js to render
- Handle accumulation (multi-container reports)
- Shape final output (array of entries)

```js
export function create(module) {
  const report = await module.require('lib/spl/container/report')
  const freetext = await module.require('lib/spl/container/freetext')

  return {
    async buildReport() {
      // Build container identity
      // Build each facet
      // Return structured report array
    },

    renderFreetext(report, level) {
      // Iterate components
      // Call freetext.renderFacet for each
      // Combine output
    }
  }
}
```

### selfeval/_lib/selfeval.js

Orchestrates validation across facets.

**Responsibilities:**
- Determine what to validate
- Load reqs for each facet
- Call selfeval.js for each validation
- Aggregate results (overall pass/fail)

```js
export function create(module) {
  const selfevalLib = await module.require('lib/spl/container/selfeval')

  return {
    async runValidation() {
      // Get facets to validate
      // Load reqs for each
      // Call selfevalLib.validateFacet for each
      // Aggregate and return results
    }
  }
}
```

## Data Flow

### whoami flow

```
index.json (flat facts)
    ↓
report.js (per facet)
    ↓
four-level structure
    ↓
freetext.js (per facet)
    ↓
natural language
    ↓
whoami.js (orchestration)
    ↓
final output (report array + freetext)
```

### selfeval flow

```
index.json (flat facts)
    ↓
report.js (per facet)
    ↓
four-level structure
    ↓
selfeval.js (per facet) + req
    ↓
validation result
    ↓
selfeval.js orchestrator
    ↓
aggregated pass/fail
```

## Contracts

### Four-level structure (report output)

```json
{
  "name": "schemas",
  "topline": { ... },
  "summary": { ... },
  "detail": { ... },
  "enriched": { ... }
}
```

### Flat facts (index.json input)

```json
{
  "name": "schemas",
  "purpose": "...",
  "files": [...]
}
```

### Validation result

```json
{
  "facet": "schemas",
  "pass": true,
  "differences": []
}
```

## Invariants

1. **Structure is fixed** - four levels, same everywhere, no overrides
2. **Container libs are per-facet** - no cross-facet logic
3. **Method libs orchestrate** - call container libs, aggregate results
4. **Flat facts in, structure out** - report.js transformation
5. **Structure in, text out** - freetext.js transformation
6. **Structure + req in, validation out** - selfeval.js transformation

## Implementation Order

1. Create `spl/container/_lib/report.js`
2. Create `spl/container/_lib/freetext.js`
3. Refactor `whoami/_lib/whoami.js` to use container libs
4. Create `spl/container/_lib/selfeval.js`
5. Refactor `selfeval/_lib/selfeval.js` to use container lib
6. Update reqs in `spl/container/_reqs/`

## Design Decisions

- **One function per facet type** - facets are different enough to warrant specific builders
- **Enriched level** - deferred, implement topline/summary/detail first
- **No error handling** - what isn't there isn't shown (sparse, no self-evaluation)
