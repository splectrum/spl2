# Method Resolution and API Association

**Created:** 2025-12-14
**Status:** Design insight - implementation needed

## Discovery

During investigation of `spl spl/container/whoami --help` returning "No input schema found", we discovered a fundamental aspect of method resolution that wasn't properly implemented.

## The Problem

`module.resolve('spl/container/whoami', '_schemas/input.avsc')` returns `null`, even though the file exists at `spl/introspection/whoami/_schemas/input.avsc`.

The current `resolveOverlay` function only handles method resolution for `index.js`, not for other files like schemas.

## Two Resolution Modes

There are two distinct resolution strategies needed:

### 1. Regular Containers (types, packages, APIs)

Resolve files through their OWN instantiates/extends stack.

Example: `spl/container` resolving `_schemas/container.avsc`
- Walk spl/container's type chain: spl/container → spl/crud → spl/introspection → spl/api
- Check each level for the file
- Return first found

### 2. Method Instances (instantiate spl/method)

Methods occupy a special place - they need **API association** first.

Example: `spl/container/whoami` resolving `_schemas/input.avsc`

**Step 1: Find original method definition**
- `spl/container/whoami` is a method instance
- Walk parent API's (`spl/container`) type chain
- Find first type that defines `whoami` → `spl/introspection/whoami`

**Step 2: Use original method's stack**
- Now resolve from `spl/introspection/whoami`'s instantiates chain
- Find `_schemas/input.avsc` at `spl/introspection/whoami`

## Why Methods Are Special

Methods are not standalone containers. They are extensions of their API definition:

- `spl/introspection` defines `whoami` method with its input.avsc
- `spl/container/whoami`, `spl/crud/whoami` are the same `whoami` method "applied" to different APIs
- They all share the schema from the original definition at `spl/introspection/whoami`

The method is "attached" to its original API first, then its own inheritance kicks in.

## Architectural Significance

This is a characteristic of the special place the splectrum API occupies:
- APIs define methods with contracts (schemas, handlers)
- Method instances inherit from their original API definition
- This creates a two-phase resolution: API association → then normal type chain

## Affected Areas

To investigate:
- [ ] `--help` / `--usage` on inherited methods
- [ ] Method handler resolution (index.js) - currently works, but logic is fragmented
- [ ] Method schema resolution (input.avsc, output.avsc)
- [ ] Method lib resolution (_lib files)
- [ ] Selfeval on methods
- [ ] Any other file resolution on method paths

## Current State

- `resolveOverlay` in `_lib/module.js` has method resolution for `index.js` only (line 198)
- The index.json existence check is being used as a heuristic to detect method vs container
- This conflates concerns - resolve should just traverse layers, not determine container type

## Proposed Fix

Modify `resolveOverlay` to:
1. Detect if path is a method instance (container doesn't exist, parent exists)
2. If method: find original definition through parent's type chain, then resolve from there
3. If regular container: resolve through own type chain
4. No index.json branching - just proper traversal
