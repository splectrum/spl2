# Lib

Bootstrapping and dual entrypoint management.

## Purpose

1. **Physical contents**: Bootstrap infrastructure and dual entrypoint (CLI + programmatic) management
2. **Resolution**: Require API libraries which resolve to module URLs

## Example

```javascript
// In code, require API library
const spl = await requireSpl('lib/spl', record)

// Resolves to: modules/bm_spl/spl/_lib/spl.js
```

## Contents

- entryPoint.js - Entry point handling
- moduleBootstrap.js - Module loading, overlay resolution, requireSpl()

## See Also

- README.json - Structured metadata
- ../_reqs/lib.md - Requirement spec
