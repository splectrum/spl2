# Development - Iteration 1: Fire-and-Forget + Handler Daemon

## Quick Start

**1. Start the handler daemon (in one terminal):**
```bash
cd dev/src
node handler-daemon.js
```

**2. Submit test requests (in another terminal):**
```bash
cd dev/src
node iteration-1-async-test.js
```

**3. Check results:**
```bash
cd dev/src
node iteration-1-check-results.js
```

## Architecture

**Fire-and-forget pattern:**
- Free script creates step 0 request event
- Exits immediately (doesn't wait)
- Handler daemon picks up requests asynchronously

**Event streams:**
- `events/request/{requestId}/` - Request events only
- No handler state events (handler is stateless for iteration 1)

**Data layer (dev/src/data.js):**
- `publish(topic, event)` - Create new event (atomic: temp+rename)
- `consume(topic, options)` - Read events in order
- `seek(topic, position)` - Jump to position ('latest', 'first', index)
- `read(topic)` - Get latest (convenience)
- `write(topic, data)` - Create new version (convenience)

## Files

**Core:**
- `data.js` - Data operations (filesystem implementation)
- `invoke.js` - Fire-and-forget request creation
- `handler-daemon.js` - Queue processor with file watcher

**Tests:**
- `iteration-1-async-test.js` - Submit test cases
- `iteration-1-check-results.js` - Verify results

**Old (can be removed):**
- `arithmetic-handler.js` - Old synchronous version
- `iteration-1-test.js` - Old synchronous test
- `data-test.js` - Basic data layer test

## Event Structure

**Step 0 (pending):**
```json
{
  "requestId": "req-1732387200000-abc123",
  "step": 0,
  "input": "3 + 5 - 2",
  "status": "pending",
  "metadata": {
    "timestamp": "2025-11-23T14:30:00.000Z",
    "topic": "request/req-1732387200000-abc123"
  }
}
```

**Step 1 (completed):**
```json
{
  "requestId": "req-1732387200000-abc123",
  "step": 1,
  "input": "3 + 5 - 2",
  "output": 6,
  "status": "completed",
  "metadata": {
    "timestamp": "2025-11-23T14:30:00.123Z",
    "topic": "request/req-1732387200000-abc123"
  }
}
```

## Test Cases

From ITERATION_PLAN.md:
- `3 + 5 - 2` = 6
- `10 + 20 + 30` = 60
- `100 - 50 - 25` = 25
- `7 + 3 + 1 + 9` = 20

## CLI Usage

**Single request:**
```bash
node invoke.js "3 + 5 - 2"
```

**Check specific request:**
```bash
# Get request ID from invoke.js output
node -e "const data = require('./data.js'); console.log(JSON.stringify(data.consume('request/req-123'), null, 2))"
```

## Next Steps

1. **Test iteration 1** - Verify fire-and-forget + handler daemon works
2. **Iteration 2** - Operator precedence (handler intelligence)
3. **Iteration 3** - Nested expressions (pipeline pattern)
4. **Iteration 4** - Multi-nested expressions (complex coordination)

## Notes

- Handler is stateless for iteration 1 (no handler state events)
- Atomic writes via temp+rename ensure listener only sees complete files
- File watcher uses fs.watch() with recursive option
- Request processing completes when output is single number (step 1)
- Later: This becomes proper spl/data API with Project 08 module structure
