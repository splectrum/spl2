# spl/dev/install

**Type:** Method (api_node)
**Specification:** `_reqs/METHOD.md` (not yet created)

## Overview

Install base packages into dev environment.

**Input:** `{ packages?, reset? }`
- packages: string (optional) - Specific packages to install
- reset: boolean (optional) - Clear base first (partial teardown)

**Output:** `{ installed, base, status }`
- installed: array - List of installed packages
- base: string - Path to base folder
- status: string - "installed"

## Status

Planned - not yet implemented.
