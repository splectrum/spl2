**Type:** plain req

# create

## Spec

**Method name** for creation operations. Establishes new entities with initial state.

**Semantic meaning:** Bring something into existence that did not exist before.

**Common patterns:**
- Returns identifier and metadata for created entity
- Idempotency varies by context (may fail if exists, or return existing)
- Creates minimal viable state (further setup via other methods)

**Examples:**
- `spl/dev/create` - Create dev environment shell
- `spl/data/create` - Create new record/entity
- `spl/session/create` - Create new session

**Naming convention:** Use `create` when the operation's primary purpose is establishing a new entity.

**Not to be confused with:**
- `install` - Add components to existing structure
- `init` - Initialize existing entity
- `setup` - Configure existing entity

Scope: Method naming convention.

Purpose: Define consistent meaning of "create" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (bring into existence)
- [ ] Distinguished from related operations (install, init, setup)
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Method names are vocabulary - they mean the same thing everywhere in SPL2.
