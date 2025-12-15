**Type:** plain req
**Version:** 1.1.0
**Supersedes:** container_type_v1.0.0

# identity_type

## Spec

The identity facet describes what a container IS. Source file: `index.json` at container root.

**Structure:**
```json
{
  "name": "spl/container/whoami",
  "instantiates": "spl/method",
  "extends": null
}
```

With optional api field (for API containers):
```json
{
  "name": "spl/container",
  "instantiates": "spl/api",
  "extends": null,
  "api": {
    "introspection": ["whoami", "selfeval"],
    "lifecycle": ["create", "lift", "update", "delete"]
  }
}
```

**Required fields:**
- `name` - container path (e.g., "spl/container", "spl/container/whoami")
- `instantiates` - type this container is an instance of
- `extends` - parent type path for inheritance chain, or null

**Optional fields:**
- `api` - apiFacets with method names (for API containers only)

**No other fields allowed.** The `type` field is redundant (derivable from instantiates). The `purpose` field is removed (not useful).

**Validation:**
- `instantiates` must match parent's `instanceChildren` setting

### Type Stack

The type stack determines inheritance for overlay resolution and selfeval. It has two layers built from `extends` and `instantiates`:

1. **Type layer** (first): container → its `extends` chain
2. **Instance layer** (second): its `instantiates` → that type's `extends` chain (deduped)

```
buildTypeStack returns { stack: [...], instanceLevel: N }
```

Where `instanceLevel` is the 1-based index where the instance layer begins.

**Example - spl/container/whoami (a method instance):**
```
stack: [spl/container/whoami, spl/method, spl/container]
instanceLevel: 2

- Level 1: spl/container/whoami (the container itself)
- Level 2: spl/method (instanceLevel - direct type via instantiates)
- Level 3: spl/container (spl/method extends spl/container)
```

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
- [ ] Has `instantiates` field (path)
- [ ] Has `extends` field (path or null)
- [ ] No extra fields (only name, instantiates, extends, api allowed)
- [ ] `instantiates` matches parent's `instanceChildren`

## Comments

The identity facet is the declarative "who am I" - what the container is, not what it does. The handler facet (`index.js`) is the functional "what I do".

Together: `index.json` (identity) + `index.js` (handler) = complete container definition.
