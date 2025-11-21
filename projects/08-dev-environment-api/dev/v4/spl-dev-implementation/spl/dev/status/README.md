# spl/dev/status

**Type:** Method (api_node)
**Specification:** `_reqs/METHOD.md` (not yet created)

## Overview

Report current dev environment state.

**Input:** `{ silent?, save? }`
- silent: boolean (optional) - Suppress screen output
- save: boolean (optional) - Write to work package _meta/

**Output:** `{ env, cycles, results, fluency, status }`
- env: object - Environment metadata
- cycles: number - Total cycles run
- results: object - Latest test results
- fluency: object - Fluency metrics
- status: string - "active" | "idle"

## Status

Planned - not yet implemented.
