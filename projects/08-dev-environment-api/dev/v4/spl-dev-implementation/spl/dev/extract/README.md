# spl/dev/extract

**Type:** Method (api_node)
**Specification:** `_reqs/METHOD.md` (not yet created)

## Overview

Extract completed module from overlay with metadata.

**Input:** `{ destination? }`
- destination: string (optional) - Where to extract to

**Output:** `{ package, meta, status }`
- package: string - Path to extracted package
- meta: object - Metadata (status, cycle-log, fluency, dependencies, test-results)
- status: string - "extracted"

## Status

Planned - not yet implemented.
