# Iteration v4: Three-Layer Merge

**Date:** 2025-11-18

## Achievements

1. **Three-layer precedence model**
   - API defaults (lowest) < Output flow (middle) < Method overrides (highest)
   - Clean, minimal, easy to understand

2. **API-level default arguments**
   - Set via `exec.setApiArgs('spl/console', { level: 'info' })`
   - Persists across all method calls
   - Acts as baseline configuration

3. **Output flow**
   - Previous method's output flows to next method's input
   - Carries data through pipeline
   - Can be overridden by explicit method args

4. **Method overrides**
   - Explicit args always win
   - Pipeline shapers vs user intent distinction

## Three-Layer Merge Pattern

```javascript
const mergedInput = {
  ...apiState.args,        // 1. API defaults (lowest)
  ...previousOutput,       // 2. Output flow (middle)
  ...args                  // 3. Method overrides (highest)
};
```

## Example Flow

```
setApiArgs({ level: 'info', format: 'text' })

configure({ level: 'warn' })
// Merged: { level: 'warn', format: 'text' }
// Output: { level: 'warn', format: 'text', ... }

log({ message: 'Hello' })
// Merged: { level: 'info', format: 'text', level: 'warn', message: 'Hello' }
// Result: level='warn' (from flow), format='text' (from API), message='Hello'

log({ message: 'Error', level: 'error' })
// Result: level='error' (method override wins)
```

## Key Insight

**API arguments** = pipeline execution shapers (defaults)
**Method arguments** = overrides (explicit intent)

This separation provides clean control without complex configuration.

## Run

```bash
cd dev
npm install
npm start
```
