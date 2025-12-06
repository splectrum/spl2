**Type:** plain req
**Version:** 1.0.0

# index_type

## Spec

The `index.js` file is the implementation entry point for a container.

**Structure:**
- File: `index.js`
- Exports default async function
- Signature: `async function(record, requireSpl)`

**Arguments:**
- `record` - the execution context (Kafka record structure)
- `requireSpl` - function to load libs and other methods

**Pattern:**
```js
export default async function(record, requireSpl) {
  const spl = await requireSpl('lib/spl')
  // implementation
}
```

**Characteristics:**
- Self-contained: all dependencies in arguments
- Testable: can be called directly with mocks
- No boilerplate: no `create()` wrapper, no `{ invoke() }` return
- Plain function that does the work

**Resolver responsibility:**
- Loads the function from index.js
- Calls it with `(record, requireSpl)`
- Generic `execute` handles all methods uniformly

**Content constraints:** None.

## Self-eval

- [ ] File named `index.js`
- [ ] Exports default async function
- [ ] Function signature is `(record, requireSpl)`
- [ ] Uses `requireSpl` for lib/method access (no direct platform imports)

## Comments

**Contrast with libs:**

Libs use `create()` wrapper because they return utility objects with multiple methods. The wrapper captures dependencies once, avoiding repetition in each utility method.

```js
// Lib pattern (_lib/spl.js)
export function create(record, { requireNonSpl }) {
  const fs = requireNonSpl('fs')
  return {
    input() { /* uses record, fs */ },
    output(data) { /* uses record, fs */ }
  }
}
```

Methods don't need this - they're single functions called once per invocation.

**DSL glossary candidates:**
- `record` - execution context (Kafka record structure)
- `requireSpl` - splectrum-specific require for libs and methods

**Evolution:**

This simplifies the previous pattern which had `create()` returning `{ invoke() }`. The ceremony added no value - the resolver can call the function directly.
