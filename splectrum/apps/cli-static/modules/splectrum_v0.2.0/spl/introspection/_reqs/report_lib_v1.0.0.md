**Type:** plain req
**Version:** 1.0.0

# report_lib

## Spec

Report building lib for constructing four-level structures from flat facts.

**File:** `_lib/report.js`

**Purpose:** Build whoami report structures with incremental detail levels (topline, summary, detail, enriched).

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `buildContainer` | `(identity, detailLevel?)` | Container envelope with name, purpose, lineage |
| `buildApi` | `(identity)` | API facet with facet count and methods |
| `buildHandler` | `(content)` | Handler facet with title from source |
| `buildSchemas` | `(manifest)` | Schemas facet with file list |
| `buildLib` | `(manifest, fileContents?)` | Lib facet with exports per file |
| `buildReqs` | `(manifest)` | Reqs facet with file list |

## Self-eval

- [ ] File exists at `_lib/report.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports all 6 functions listed above

## Comments

Each build function returns a structure with incremental levels. Callers assemble the full report by combining facet outputs.
