# spl/dev/cycle

**Type:** Method (api_node)
**Specification:** `_reqs/METHOD.md` (not yet created)

## Overview

Run test cycle (return-and-resume pattern).

**Input:** `{ single? }`
- single: boolean (optional) - Run one cycle only (vs loop until done)

**Output:** `{ cycle, results, fluency, status }`
- cycle: number - Cycle number
- results: object - Test results
- fluency: object - Fluency metrics
- status: string - "pass" | "fail" | "complete"

## Status

Planned - not yet implemented.
