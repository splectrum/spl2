# module.js Refactor: Use `this` Instead of Forward Reference

**Status:** Scheduled
**Created:** 2025-12-11

## Current State

`module.js` uses a forward reference pattern to handle self-reference in closures:

```javascript
let moduleRef = null
const getModuleRef = () => moduleRef

const internalRequire = async (uri) => {
  // ...
  return lib.create(getModuleRef())  // needs module before it's created
}

moduleRef = { ... }
return moduleRef
```

This works but is inconsistent with other libs that use `return { }` directly.

## Proposed Refactor

Use `this` in method shorthand - it binds to the containing object:

```javascript
export function create(record) {
  // helpers that don't need self-reference...

  return {
    async require(uri) {
      // ...
      return lib.create(this)  // 'this' is the returned object
    },
    // other methods...
  }
}
```

## Why This Works

In method shorthand syntax, `this` refers to the object the method is called on:

```javascript
const obj = {
  foo() {
    return this  // returns obj
  }
}
obj.foo() === obj  // true
```

Since `module.require()` is always called as a method on the module object, `this` will be the full module.

## Considerations

1. **Arrow functions don't bind `this`** - must use method shorthand throughout (already the case)
2. **Callbacks need care** - if passing a method as callback, may need `.bind(this)` or wrap in arrow
3. **Consistency** - all libs would use same `return { }` pattern

## Files Affected

- `splectrum/apps/cli-static/modules/work_module/spl/module/_lib/module.js`

## Testing

After refactor:
- `./spl spl/module/selfeval --levels=all` should pass
- `./spl spl/container/selfeval` should pass
- `./spl spl/container/whoami` should work
