# spl/dev/submit

**Type:** Method (api_node)
**Specification:** `_reqs/METHOD.md` (not yet created)

## Overview

Submit work package to overlay.

**Input:** `{ workPackage, reset? }`
- workPackage: string - Path to work package
- reset: boolean (optional) - Clear overlay first (partial teardown)

**Output:** `{ overlay, dependencies, status }`
- overlay: string - Path to overlay folder
- dependencies: object - Version dependency report
- status: string - "submitted"

## Status

Planned - not yet implemented.
