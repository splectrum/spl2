**Type:** lib req
**Version:** 1.0.0

# whoami_lib

## Purpose

Business logic for whoami method. Provides container introspection with configurable depth, detail levels, and facet selection.

## Exports

| Function | Purpose |
|----------|---------|
| parseFacets | Parse --facet flag into facet list |
| buildContainer | Build container info with selected facets |
| buildChain | Traverse type chain with depth/detail levels |
| renderFreetext | Render container to natural language |

## Usage

```javascript
const whoami = await module.require('lib/spl/introspection/whoami')

const facets = whoami.parseFacets(input)
const container = await whoami.buildContainer(detailLevel, facets)
const chain = await whoami.buildChain(depthLevel, detailLevel, facets)
const text = await whoami.renderFreetext(container, level)
```

## Self-eval

- [ ] Uses factory pattern with create(module)
- [ ] Supports all facets: container, children, handler, schemas, lib, reqs
- [ ] Supports depth and detail levels
