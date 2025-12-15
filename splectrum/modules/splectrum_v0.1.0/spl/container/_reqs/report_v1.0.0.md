# report.js Library Requirement

**Version:** 1.0.0
**Location:** spl/container/_lib/report.js

## Purpose

Build four-level structure (topline/summary/detail/enriched) from flat facts (index.json files). Hierarchical: container wraps facets as children.

## Pattern

Factory function `create(module)` returns object with builder methods.

## Required Exports

| Function | Input | Output | Description |
|----------|-------|--------|-------------|
| buildContainer | index.json | container report | Container with name, type, extends, instantiates, purpose. Facets array populated by orchestrator. |
| buildApi | index.json | facet report | Api facet with apiFacets, methodCount, api detail. |
| buildHandler | index.js content | facet report | Handler facet with exists, title, content. |
| buildSchemas | _schemas/index.json | facet report | Schemas facet with files, purpose. |
| buildLib | _lib/index.json | facet report | Lib facet with files, purpose, expected/actual exports. |
| buildReqs | _reqs/index.json | facet report | Reqs facet with files, purpose. |

## Report Structure

Each builder returns a four-level structure:

```js
{
  name: 'facetName',
  topline: { ... },   // minimal rollup
  summary: { ... },   // + purpose/description
  detail: { ... },    // + full breakdown
  enriched: { ... }   // + child container reports (future)
}
```

Container report has additional `facets: []` array for children.

## Invariants

- All builders return consistent four-level structure
- No composition - caller decides how to combine
- Sparse output - missing data not shown, not errored
