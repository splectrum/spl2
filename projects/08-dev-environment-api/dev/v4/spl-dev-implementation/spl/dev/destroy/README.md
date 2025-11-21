# spl/dev/destroy

**Type:** Method (api_node)
**Specification:** `_reqs/METHOD.md` (not yet created)

## Overview

Clean up dev environment.

**Input:** `{ mode }`
- mode: string - "clean" | "preserve" | "publish"

**Output:** `{ archived?, published?, status }`
- archived: string (optional) - Archive path if mode=preserve
- published: string (optional) - Publish location if mode=publish
- status: string - "destroyed"

## Status

Planned - not yet implemented.
