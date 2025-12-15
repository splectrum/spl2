**Type:** plain req
**Version:** 1.0.0

# lib_type

## Spec

The lib facet holds shared code for a container. Location: `_lib/` folder with `index.json` manifest.

**Structure:**
```
_lib/
  ├── index.json      ← manifest (flat facts)
  ├── container.js    ← main lib (named after container)
  └── helpers.js      ← auxiliary libs
```

**index.json structure:**
```json
{
  "name": "lib",
  "purpose": "Shared implementation code",
  "files": ["container.js", "helpers.js"]
}
```

**Fields:**
- `name` - always "lib"
- `purpose` - brief description
- `files` - list of lib files present

**Main vs auxiliary libs:**

| Require path | Resolves to | Type |
|--------------|-------------|------|
| `lib/spl/container/selfeval` | `selfeval/_lib/selfeval.js` | Main lib |
| `lib/spl/container/selfeval/runners.js` | `selfeval/_lib/runners.js` | Auxiliary |

**Lib file pattern (create wrapper):**
```js
export function create(module) {
  const input = module.input()

  return {
    methodA() { /* uses module */ },
    methodB(data) { /* uses module */ }
  }
}
```

**Why wrapper for libs:**
- Returns utility object with multiple methods
- Captures module context once
- Caller uses `lib.methodA()` not `lib.methodA(module)`

**Flat facts pattern:**
- `index.json` holds raw facts (file list, purpose)
- whoami builds four-level structure
- freetext renderer produces natural language

## Self-eval

- [ ] Folder named `_lib` with underscore prefix
- [ ] Contains `index.json` manifest
- [ ] index.json has `name`, `purpose`, `files` fields
- [ ] Main lib file named after container
- [ ] Lib files export `create(module)`

## Comments

Internal folders use underscore prefix. The `index.json` manifest enables whoami to discover and report on lib contents.
