# pr09/console/hello v1.0.0

Simple greeting method that outputs a message to console.

## Purpose

Tests the complete pattern for stream-native execution. Demonstrates:
- Reading input from correct namespace
- Console output
- Completion signaling via spl.complete()

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | Message to output to console |

**Location:** `record.headers.pr09.console.hello.message`

### Input Constraints

- message: Must be a string. Empty string is valid.

## Outputs

None. This method produces console output only.

## Behavior

1. Read message from `headers.pr09.console.hello.message`
2. Output message to console via `console.log(message)`
3. Call `spl.complete()` to signal completion

## Error Conditions

None defined. Method always completes successfully.

## Implementation Requirements

- Must export `handle(record)` function
- Must access input from correct namespace only
- Must not access other API namespaces
- Must call `spl.complete()` on success

## Selfevals

### SE-1: index.js exists
Verify that index.js file exists in method folder.

### SE-2: exports handle function
Verify that index.js exports a function named `handle`.

### SE-3: reads from correct namespace
Verify that implementation accesses `pr09.console.hello` for input.

### SE-4: calls complete()
Verify that implementation calls `spl.complete()` or equivalent.

### SE-5: no cross-API access
Verify that implementation does not access other API namespaces.

## Notes

- This is a test/example method from Project 09
- Used to validate the method pattern and selfeval inheritance
- v1.0.0: Initial implementation
