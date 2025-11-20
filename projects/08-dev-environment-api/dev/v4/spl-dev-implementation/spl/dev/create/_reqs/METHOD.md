**Type:** plain req
**Extends:** api_method
**Self-eval:** _selfeval.json

# spl/dev/create

## Spec

Create fresh dev environment shell.

**Input:** `{ name }`
- name: string - Environment name

**Output:** `{ envId, path, status }`
- envId: string - UUID for environment
- path: string - Filesystem path to environment
- status: string - "created"

**Behavior:**
- Generate unique environment ID (UUID v4)
- Create directory structure at `/tmp/dev-env/{name}`
- Return environment metadata
- Do not install packages (see spl/dev/install)
- Do not create modules/ folder (see spl/dev/install)

**Schemas:**
- Input: `_schemas/input.avsc`
- Output: `_schemas/output.avsc`

**Implementation:**
- Sync method (not async)
- Returns plain object
- Uses Node.js crypto.randomUUID()
- Uses Node.js fs.mkdirSync() (recursive)

## Self-eval

See `_selfeval.json` for test manifest.

Expected categories:
- logic: Creates environment with correct structure
- logic: Returns valid UUID
- logic: Returns correct path
- safety: Handles existing directory
- qc: Output matches schema
- qc: Input validates against schema

## Comments

First method in Dev Env API. Shell creation only - a focused, simple operation.
