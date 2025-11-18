**Type:** plain req

# api_node

## Spec

General term for folder in SPL2 API hierarchy. Can be a package (top-level), api (within package), or method (invokable leaf).

Structure: Contains `index.js` for invokable nodes, may contain child api_nodes, internal folders, and auxiliary files.

Underscore prefix pattern: Folders and files prefixed with `_` are excluded from URI namespace - not invokable, not part of API surface.
- Internal folders: `_schemas/`, `_tests/`, `_docs/`
- Auxiliary files: `_helpers.js`, `_utils.js`

Purpose: Consistent structural unit across all levels of API hierarchy with clear namespace rules.

## Self-eval

- [ ] Folder structure follows api_node pattern (index.js for invokable)
- [ ] Underscore-prefixed items excluded from URI namespace
- [ ] Clear distinction: invokable (no prefix) vs internal/auxiliary (underscore prefix)
- [ ] Hierarchy level is clear (package/api/method)

## Comments

Examples:
- `spl/` - package api_node
- `spl/runtime/` - api_node within spl
- `spl/runtime/run/` - method api_node (leaf, invokable)
- `spl/runtime/_docs/` - internal folder (not invokable)
- `spl/runtime/_utils.js` - auxiliary file (not in namespace)
