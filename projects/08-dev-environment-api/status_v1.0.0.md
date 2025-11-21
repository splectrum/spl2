**Type:** plain req

# status

## Spec

**Method name** for status query operations. Report current state without modification.

**Semantic meaning:** Retrieve current state information about an entity or process.

**Common patterns:**
- Read-only operation (no side effects)
- Returns comprehensive state snapshot
- May support output options (silent, save, format)
- Idempotent (calling multiple times gives same state)

**Examples:**
- `spl/dev/status` - Report dev environment state (cycles, results, fluency)
- `spl/process/status` - Report process state
- `spl/session/status` - Report session state

**Naming convention:** Use `status` for read-only state queries.

**Not to be confused with:**
- `check` - Verify condition (boolean result)
- `info` - General information
- `inspect` - Deep examination

Scope: Method naming convention.

Purpose: Define consistent meaning of "status" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (read current state)
- [ ] Distinguished from related operations
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Status is always read-only. If the operation modifies state, it's not a status query.
