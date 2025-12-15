**Type:** plain req
**Version:** 1.0.0

# selfeval_container_runner

## Spec

Selfeval runner that validates container facet (index.json).

**Checks:**

1. **Required fields present:** name, instantiates, extends
2. **No extra fields:** any field not in required list is a failure
3. **Valid instantiates:** must match parent's instanceChildren

**Required fields:** name, instantiates, extends
**Optional fields:** api

**Parent resolution:**

- Container path segments: `spl/container/whoami` → parent is `spl/container`
- Read parent's index.json to get `instantiates`
- Read parent's instance type to get `instanceChildren`
- Compare child's `instantiates` against `instanceChildren`

**Root containers:** Containers with no parent (e.g., `spl`) skip the instantiates validation.

**Output:**

```json
{
  "pass": true,
  "topline": "container | PASS",
  "summary": "3 fields, valid instantiates",
  "checks": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_container.js`
- [ ] Exports `create(module)` returning object with `run(containerFsPath)`
- [ ] Checks for required fields: name, instantiates, extends
- [ ] Allows optional field: api
- [ ] Fails on any other extra fields
- [ ] Validates instantiates matches parent's instanceChildren
- [ ] Handles root containers gracefully

## Comments

Replaces selfeval_children runner. Each container validates its own container facet rather than parent validating children.
