**Type:** plain req
**Version:** 1.0.0

# handler_type

## Spec

The handler facet is the functional implementation of a container. Source file: `index.js` at container root.

**Structure:**
```js
// container/path - brief description
// Instantiates: spl/method (or other type)
//
// Extended description of what this handler does.
// Flags: --flag1, --flag2

export default async function(module) {
  // implementation
}
```

**Pattern:**
- File: `index.js`
- Exports default async function
- Signature: `async function(module)`
- Header comment: container path, description, instantiates, flags

**Header comment structure:**
- Line 1: `// container/path - brief description`
- Line 2: `// Instantiates: type` (optional)
- Lines 3+: extended description, flags

**Constraints:**
- Only spl lib imports: `module.require('lib/...')` for libs
- No direct platform imports in handlers
- Comments explain flow: each major step has a brief comment

**Resolver responsibility:**
- Loads function from index.js
- Wraps module interface bound to record
- Calls function with `(module)`

## Self-eval

- [ ] File named `index.js`
- [ ] Exports default async function
- [ ] Function signature is `(module)`
- [ ] Header comment with container path and description
- [ ] Only spl lib imports (no direct platform requires)
- [ ] Major steps have brief comments

## Comments

**Contrast with identity:**
- `index.json` (identity) = declarative, what the container IS
- `index.js` (handler) = functional, what the container DOES

**Contrast with libs:**
Libs use `create(module)` wrapper because they return utility objects. Handlers are single functions called once per invocation.
