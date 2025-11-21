**Type:** plain req

# api method req

## Spec

Requirements document pattern for API method. Lives in work package as `_req.md`.

Structure:
```markdown
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
- path: string - Filesystem path
- status: string - "created"

**Behavior:**
- Generate unique environment ID
- Create directory structure
- Return environment metadata
- Do not install packages (see spl/dev/install)

**Schemas:**
- Input: `_schemas/input.avsc`
- Output: `_schemas/output.avsc`

## Self-eval

See `_selfeval.json` for test manifest.

## Comments

First method in Dev Env API. Shell creation only.
```

**Required sections:**
- Preamble (Type, Extends, Self-eval ref)
- Spec (input, output, behavior, schemas)
- Self-eval (points to manifest)
- Comments (optional)

**Input/Output format:**
- Clear parameter listing
- Type specifications
- Schema references

**Behavior:**
- Natural language description
- What it does
- What it doesn't do (boundaries)

**Self-eval reference:**
- Points to `_selfeval.json` file
- Relative path from package root

Scope: Work package.

Purpose: Human/AI readable specification for implementation.

## Self-eval

- [ ] Has preamble with Type, Extends
- [ ] References selfeval manifest
- [ ] Spec section describes input
- [ ] Spec section describes output
- [ ] Spec section describes behavior
- [ ] References schemas
- [ ] Self-eval section points to manifest
- [ ] Clear boundaries (what it doesn't do)

## Comments

Entry point for work package. AI reads this first, then follows selfeval ref to manifest.
