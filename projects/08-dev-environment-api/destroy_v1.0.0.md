**Type:** plain req

# destroy

## Spec

**Method name** for destruction operations. Remove entity and clean up resources.

**Semantic meaning:** Tear down and remove, freeing resources.

**Common patterns:**
- Opposite of `create`
- May support modes (clean, preserve, archive)
- Returns confirmation and cleanup summary
- May preserve artifacts before destruction
- Usually irreversible (within reason)

**Examples:**
- `spl/dev/destroy` - Clean up dev environment (modes: clean | preserve | publish)
- `spl/session/destroy` - Tear down session
- `spl/resource/destroy` - Release and remove resource

**Naming convention:** Use `destroy` for teardown operations that free resources.

**Not to be confused with:**
- `delete` - Remove record/reference (may be reversible)
- `remove` - Take out of collection (item still exists)
- `clean` - Tidy up without destroying

Scope: Method naming convention.

Purpose: Define consistent meaning of "destroy" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (tear down and free resources)
- [ ] Distinguished from related operations
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Destroy is stronger than delete - it implies resource cleanup and finality.
