**Type:** plain req
**Version:** 1.0.0

# freetext_lib

## Spec

Generic freetext renderer for four-level structured JSON.

**File:** `_lib/freetext.js`

**Purpose:** Render structured JSON with topline/summary/detail/enriched levels to human-readable text. Domain-agnostic - walks any JSON structure.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `render` | `(json, level?)` | Render JSON to freetext at specified level |
| `renderWithLevels` | `(report, level?)` | Render selfeval results with levels structure |

**Levels:** `topline`, `summary`, `detail`, `enriched`

**Behavior:**
- Walks JSON structure recursively
- Renders level keys present in node AND in inclusion list
- Recurses into non-level keys (arrays and objects)
- Multi-line values are properly indented

## Self-eval

- [ ] File exists at `_lib/freetext.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `render`, `renderWithLevels` functions

## Comments

Used by whoami and selfeval to convert structured output to human-readable format.
