**Type:** plain req
**Version:** 1.0.0

# identity_type

## Spec

The identity facet describes what a container IS. Source file: `index.json` at container root.

**Structure:**
```json
{
  "name": "spl/container",
  "type": "Type",
  "purpose": "Brief description of what this container is",
  "extends": null,
  "instantiates": "spl/api",
  "api": {
    "facetName": ["method1", "method2"]
  }
}
```

**Fields:**
- `name` - container path (e.g., "spl/container", "spl/api/myapi")
- `type` - what this container defines: "Type", "Package", "Module", "Method"
- `purpose` - one-line description
- `extends` - parent type path for inheritance chain, or null
- `instantiates` - type this container is an instance of, or null
- `api` - apiFacets with method names (for API containers only)

**Flat facts pattern:**
- `index.json` holds raw facts, easy to edit
- whoami builds four-level structure (topline/summary/detail/enriched)
- freetext renderer produces natural language from index.json

### Type Stack

The type stack determines inheritance for overlay resolution and selfeval. It has two layers built from `extends` and `instantiates`:

1. **Type layer** (first): container → its `extends` chain
2. **Instance layer** (second): its `instantiates` → that type's `extends` chain (deduped)

```
buildTypeStack returns { stack: [...], instanceLevel: N }
```

Where `instanceLevel` is the 1-based index where the instance layer begins.

**Example - spl (a package instance):**
```
stack: [spl, spl/package, spl/container]
instanceLevel: 2

- Level 1: spl (the container itself)
- Level 2: spl/package (instanceLevel - direct type via instantiates)
- Level 3: spl/container (spl/package extends spl/container)
```

**Example - spl/package (a type definition):**
```
stack: [spl/package, spl/container, spl/api]
instanceLevel: 3

- Level 1: spl/package (the container itself)
- Level 2: spl/container (extends chain - type layer)
- Level 3: spl/api (instanceLevel - spl/package instantiates spl/api)
```

### Instance vs Type (orthogonal concepts)

- **instantiates** (structural): What container shape this is. Determines inheritance for overlay resolution.
- **type field** (content): What this container defines. E.g., `type: "Type"` means it defines a type.

Example: `spl/api` has `type: "Type"` (it defines a type) and `instantiates: "spl/api"` (it is structurally an API container).

### Final vs Non-Final Resources

**Final resources** - cannot overlap across type chain:
- `_reqs/*.md` - requirements documents
- `_lib/*.js` - library code
- `_tests/*.js` - test files

Each level has its own manifest. Files are unique per level.

**Non-final resources** - inherit via overlay:
- `index.js` - handler (inherited if not overridden)
- `index.json` - identity (each level has its own)
- `_schemas/*.avsc` - schema files (inherited)
- `_selfevals/index.json` - selfeval registry (each level has its own)

## Self-eval

- [ ] File named `index.json` at container root
- [ ] Has `name` field matching container path
- [ ] Has `type` field (Type, Package, Module, Method)
- [ ] Has `purpose` field (one-line description)
- [ ] Has `extends` field (path or null)
- [ ] Has `instantiates` field (path or null)
- [ ] API containers have `api` object with apiFacets

## Comments

The identity facet is the declarative "who am I" - what the container is, not what it does. The handler facet (`index.js`) is the functional "what I do".

Together: `index.json` (identity) + `index.js` (handler) = complete container definition.
