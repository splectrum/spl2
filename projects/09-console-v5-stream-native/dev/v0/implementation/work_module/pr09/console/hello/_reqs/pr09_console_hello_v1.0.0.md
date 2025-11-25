# pr09/console/hello Method Requirements

**Instance of:** method
**Version:** 1.0.0

---

## Purpose

Simple greeting method that outputs a message to console. Tests the complete pattern for stream-native execution.

## Input

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| message | string | yes | Message to output |

**Location:** `record.headers.pr09.console.hello.message`

## Behavior

1. Read message from input
2. Output message to console (`console.log`)
3. Mark request as complete (`spl.complete()`)

## Output

None (console output only).

## Completion

Method must call `spl.complete()` to signal normal completion.

## Self-Eval Criteria

1. **Structure:** index.js exists and exports `handle` function
2. **Input access:** Reads from correct namespace (`headers.pr09.console.hello`)
3. **Completion:** Calls `spl.complete()` on success
4. **No cross-API access:** Does not read from other API namespaces

---

**Version:** 1.0.0
