**Type:** plain req
**Version:** 1.0.0

# index_type

## Spec

The `index.js` file is the implementation entry point for a container.

**Structure:**
- File: `index.js`
- Exports default async function
- Signature: `async function(module)`

**Arguments:**
- `module` - the module interface (provides input, output, require, resolve, etc.)

**Pattern:**
```js
// Method description
// Instantiates: <type>
//
// Brief explanation of what this method does.
// Flags: list of supported flags

export default async function(module) {
  const mylib = await module.require('lib/spl/path/to/lib')
  const containerPath = module.getMethod().split('/').slice(0, -1).join('/')

  // Step 1: description
  const result1 = await mylib.step1(...)
  if (result1.error) return mylib.output(...)

  // Step 2: description
  const result2 = await mylib.step2(...)

  // Step 3: output
  mylib.output(...)
}
```

**Constraints:**
- Only spl lib imports: use `module.require('lib/...')` for libs, no direct platform imports
- Flow reflects spec: implementation steps should mirror the req spec's described flow
- Comments explain flow: each major step has a brief comment

**Characteristics:**
- Self-contained: all dependencies via module interface
- Readable: shows top-level algorithm, lib handles details
- Testable: can be called directly with mocks
- No boilerplate: no `create()` wrapper, no `{ invoke() }` return

**Resolver responsibility:**
- Loads the function from index.js
- Wraps module interface bound to record
- Calls function with `(module)`
- Generic `execute` handles all methods uniformly

**Content constraints:** None.

## Self-eval

- [ ] File named `index.js`
- [ ] Exports default async function
- [ ] Function signature is `(module)`
- [ ] Only spl lib imports (no direct platform requires)
- [ ] Header comment explains purpose and flags
- [ ] Implementation steps reflect spec flow
- [ ] Major steps have brief comments

## Comments

**Contrast with libs:**

Libs use `create(module)` wrapper because they return utility objects with multiple methods. The wrapper captures module context once, avoiding repetition in each utility method.

```js
// Lib pattern (_lib/mylib.js)
export function create(module) {
  const input = module.input()
  return {
    step1() { /* uses module */ },
    step2(data) { /* uses module */ }
  }
}
```

Methods don't need this - they're single functions called once per invocation.

**DSL glossary candidates:**
- `module` - module interface (input, output, require, resolve, etc.)

**Evolution:**

Simplified from `(record, requireSpl)` to `(module)`. The module interface encapsulates all execution context and utilities in one object.
