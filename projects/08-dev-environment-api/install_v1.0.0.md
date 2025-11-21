**Type:** plain req

# install

## Spec

**Method name** for installation operations. Add components to existing structure.

**Semantic meaning:** Place components into a target location or system, making them available for use.

**Common patterns:**
- Target must exist (installation destination)
- Returns list of installed components and location
- May support selective installation (which components)
- May support reset/reinstall

**Examples:**
- `spl/dev/install` - Install base packages into dev environment
- `spl/module/install` - Install module into runtime
- `spl/plugin/install` - Install plugin into system

**Naming convention:** Use `install` when adding components to an existing structure.

**Not to be confused with:**
- `create` - Establish new entity from nothing
- `submit` - Provide work/input for processing
- `deploy` - Make available for production use

Scope: Method naming convention.

Purpose: Define consistent meaning of "install" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (add components to existing)
- [ ] Distinguished from related operations
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Installation assumes a target exists. Create the target first, then install into it.
