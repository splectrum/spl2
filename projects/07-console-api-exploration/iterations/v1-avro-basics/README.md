# Iteration v1: AVRO Basics

**Date:** 2025-11-18

## Achievements

1. **Dev environment with free scripting approach**
   - `createRuntime()` - environment properties
   - `createExecution()` - method invocation wrapper with API state management
   - Not forced into API structure prematurely

2. **Three-layer structure established**
   - `modules/spl/console/configure/index.js`
   - `modules/spl/console/_schemas/` for AVRO schemas

3. **AVRO validation working**
   - Input schema with defaults (`configure-input.avsc`)
   - Output schema with union for result OR error (`configure-output.avsc`)
   - State schema (`console-state.avsc`)
   - Help info in schema `doc` fields

4. **State persistence across calls**
   - `invocationCount` increments on success
   - State unchanged on error
   - Config updates persist

5. **Error handling pattern**
   - Union type: ConfigureResult | Error
   - Method returns error structure, doesn't throw
   - "Errors as state transitions"

## Open Questions

- Output schema wraps union in `value` field - awkward? Could return result/error directly
- Input passed both in ctx.input and as parameter - redundant?
- API name extraction from path is brittle

## Run

```bash
cd dev
npm install
npm start
```
