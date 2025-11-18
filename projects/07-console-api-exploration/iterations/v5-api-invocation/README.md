# Iteration v5: API-Level Invocation

**Date:** 2025-11-18

## Achievements

1. **API-level vs method-level invocation**
   - Path depth determines type: `spl/console` (API) vs `spl/console/log` (method)
   - Same `invoke()` function handles both
   - Clean, consistent interface

2. **API-level invocation**
   - Sets API default arguments
   - `invoke('spl/console', { level: 'info', format: 'text' })`

3. **Batch execution**
   - Pass batch array with API invocation
   - Executes methods in sequence
   - Returns output from last method
   - Transient - not stored in state

4. **Batch is execution directive**
   - Extracted from args before storing defaults
   - Processed and gone after execution
   - State stays clean

## Invocation Patterns

```javascript
// API-level: set defaults
await exec.invoke('spl/console', { level: 'info' });

// Method-level: call method
await exec.invoke('spl/console/log', { message: 'Hello' });

// API-level with batch
await exec.invoke('spl/console', {
  level: 'debug',  // stored as default
  batch: [         // executed, not stored
    ['configure', { level: 'warn' }],
    ['log', { message: 'Hello' }]
  ]
});
```

## Key Insight

Batch is a transient execution instruction, not state. Like a "run these now" command that evaporates after execution. This keeps API state clean - only actual defaults persist.

## Run

```bash
cd dev
npm install
npm start
```
