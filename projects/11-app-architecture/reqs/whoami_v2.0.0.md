# whoami_v2.0.0

**Type:** plain req
**Version:** 2.0.0
**Project:** 11-app-architecture
**Supersedes:** whoami_v1.0.0

---

## Spec

Universal introspection method for containers. Reports actual state (descriptive). Available on all containers via type chain.

### Architecture

**Accumulation model:** Each whoami call adds to existing report (additive).

```
input.report (existing or {})
  → whoami adds component data
  → output.report (accumulated)
```

**Report structure:**
```json
{
  "wrapper": { ... },     // report meta (TOC, structural summary)
  "container": { ... },   // container identity
  "facets": { ... }       // internal folders (schemas, lib, reqs, etc.)
}
```

**Open composition:** Report can accumulate from multiple containers for rollup reports.

**Twin relationship:** whoami (descriptive) feeds selfeval (prescriptive) for validation.

### Input/Output Contract

**Input:**
```
{
  "report": [],               // existing report array to accumulate into (default: [])
  "component": string,        // which component to add
  "level": string             // output level (topline|summary|detail|enriched)
}
```

**Output:**
```
{
  "report": []                // accumulated report with component added
}
```

**Metaoutput:**
```
{
  "freetext": string          // rendered from current report state at requested level
}
```

### Report Dynamics

**Pass-through:** `input.report` passes through to `output.report` with new component added.

**Report structure:** Flat array of hierarchical components.
```
[
  { type: "schemas", container: "spl/container", items: [...] },
  { type: "container", container: "spl/container", items: [...] }
]
```

**Hierarchical components:** Each component starts at top (container level), drills down via nested `items[]` arrays.
```
{
  "type": "schemas",
  "container": "spl/container",
  "topline": "schemas",
  "items": [
    {
      "topline": "input.avsc",
      "summary": "Universal handler flags",
      "items": [
        { "topline": "dryRun", "summary": "boolean - Preview only" }
      ]
    }
  ]
}
```

**Freetext generation:** Always rendered from current report state. Not passed through - regenerated each call.

**Mode interplay:**

| Mode | Report | Freetext |
|------|--------|----------|
| normal | accumulate | render from current state |
| silent | accumulate | suppress |
| dryRun | unchanged | render from hypothetical state |

**Example - gradual accumulation:**
```
report = []
report = whoami({ report, component: 'schemas' })
// freetext: "schemas - input.avsc, metaoutput.avsc"
// report: [{ type: "schemas", ... }]

report = whoami({ report, component: 'container' })
// freetext: "spl/container\nschemas - input.avsc, metaoutput.avsc"
// report: [{ type: "schemas", ... }, { type: "container", ... }]
```

**Example - silent accumulation, final render:**
```
report = []
report = whoami({ report, component: 'schemas', silent: true })
report = whoami({ report, component: 'container', silent: true })
report = whoami({ report, component: 'wrapper' })  // final step renders full freetext
```

### Adhoc Report Sharing

For twin relationship (whoami → selfeval), report is passed directly between calls:
```
report = whoami({ component: 'schemas' }).report
result = selfeval({ report, req: '...' })
```

Future: accumulated report can live in API state for method sharing.

### Components

| Component | Adds to | Description |
|-----------|---------|-------------|
| schemas | facets.schemas | Schema files from _schemas/ |
| lib | facets.lib | Library files from _lib/ |
| reqs | facets.reqs | Requirements from _reqs/ |
| methods | facets.methods | Child method containers |
| container | container | Identity (extends, instantiates, purpose) |
| wrapper | wrapper | TOC + structural summary (must be last) |

### Design Principles

**Spider principle:** Each component reports its own domain. Wrapper doesn't duplicate container/facet details - it's the table of contents, not the chapters.

**Sparse handling:** Reports presence, not absence. No "missing" indicators. selfeval determines what's missing.

**Report-as-container:** The report itself is a general data container. Wrapper applies the same introspection to accumulated data.

---

## Roadmap

### Phase 1: schemas facet (mac)

Implement schemas component with report-first architecture:
- Build structured report from _schemas/
- Render freetext from report at requested level
- Support accumulation (add to existing report)

### Phase 2: container component

Implement container identity:
- Read README.json for extends, instantiates, purpose
- Add to report.container
- Render at levels

### Phase 3: wrapper component

Implement wrapper/narrator:
- Introspect accumulated report
- Generate TOC (facets present, children)
- Add report meta (level, sources)
- Must be called last

### Phase 4: additional facets

- lib facet (_lib/ contents)
- reqs facet (_reqs/ contents)
- methods facet (child containers)

### Phase 5: open composition

- Multi-container accumulation
- Rollup reports at package level
- Hierarchical binding

---

## Self-eval

Phase 1 (schemas):
- [ ] Builds structured report from _schemas/
- [ ] Renders freetext from report (not separate logic)
- [ ] Accumulates into existing report
- [ ] All four levels work (topline/summary/detail/enriched)

Full implementation:
- [ ] All components add correctly
- [ ] Wrapper introspects accumulated content
- [ ] Spider principle maintained
- [ ] Open composition works
- [ ] Output feeds selfeval correctly

## Comments

whoami is descriptive - it reports what IS. selfeval is prescriptive - it validates against expectations. The whoami report feeds into selfeval for validation.
