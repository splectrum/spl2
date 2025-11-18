# Iteration v3: Composition Pattern

**Date:** 2025-11-18

## Achievements

1. **Composition model working**
   - Previous output merges with explicit args
   - Args override (precedence)
   - No runtime compatibility check needed

2. **Squash pattern in action**
   - `configure` outputs `{ level: 'warn', ... }`
   - `log` called with just `{ message: '...' }`
   - Merged input: `{ level: 'warn', message: '...' }`
   - log uses level from previous output

3. **Two methods composing**
   - configure → log pipeline working
   - Level flows through
   - Override works (args win)

4. **Log method added**
   - Clean business logic
   - Uses config from API state
   - Level filtering works
   - Tracks bytesOutput

## Composition Pattern

```javascript
// Execution does the merge
const mergedInput = { ...previousOutput, ...args };

// First call: args only
configure({ level: 'warn' })
// Output: { configured, level: 'warn', format, destination }

// Second call: message only, level from previous
log({ message: 'Hello' })
// Merged: { level: 'warn', message: 'Hello', ... }
// Uses warn level from configure output
```

## Key Insight

No compile-time compatibility checking yet, but the pattern is:
- **Runtime**: just merge and validate
- **Compile-time** (future): check output schema → input schema compatibility

## Run

```bash
cd dev
npm install
npm start
```
