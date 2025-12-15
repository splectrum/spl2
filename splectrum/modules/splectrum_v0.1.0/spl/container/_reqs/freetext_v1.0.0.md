# freetext.js Library Requirement

**Version:** 1.0.0
**Location:** spl/container/_lib/freetext.js

## Purpose

Render four-level structure to natural language text. Each function renders ONE level of ONE component. No composition - caller decides how to combine.

## Pattern

Factory function `create(module)` returns object with renderer methods.

## Required Exports

| Function | Input | Output | Description |
|----------|-------|--------|-------------|
| renderContainerTopline | container report | string | Container headline (name - type \| lineage) |
| renderContainerSummary | container report | string | Container purpose |
| renderContainerDetail | container report | string | (empty for now) |
| renderApiTopline | facet report | string | Api facet (N facets, M methods) |
| renderApiSummary | facet report | string | (empty for now) |
| renderApiDetail | facet report | string | Facet breakdown (facetName: method1, method2) |
| renderHandlerTopline | facet report | string | Handler title or status |
| renderHandlerSummary | facet report | string | (empty for now) |
| renderHandlerDetail | facet report | string | (empty for now) |
| renderSchemasTopline | facet report | string | File list |
| renderSchemasSummary | facet report | string | Purpose |
| renderSchemasDetail | facet report | string | (empty for now) |
| renderLibTopline | facet report | string | File list |
| renderLibSummary | facet report | string | Purpose |
| renderLibDetail | facet report | string | Expected vs actual exports |
| renderReqsTopline | facet report | string | File list |
| renderReqsSummary | facet report | string | Purpose |
| renderReqsDetail | facet report | string | (empty for now) |

## Naming Convention

`render{Component}{Level}(report)` where:
- Component: Container, Api, Handler, Schemas, Lib, Reqs
- Level: Topline, Summary, Detail, Enriched

## Invariants

- All renderers return strings (or empty string)
- No composition - single component, single level
- Sparse output - missing data returns empty string
