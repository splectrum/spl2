# dryRun

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Show execution plan without applying state changes.

A preview mode - see what would happen before committing. Safe exploration of consequences.

### Character

- Preview: shows intent without action
- Safe: no state changes occur
- Informative: reveals execution plan

### Relationship

- Used with pac (prompt and confirm) workflow
- Opposite of direct execution

## Self-eval

- [ ] Shows what would happen
- [ ] Does not apply changes
- [ ] Plan is understandable

## Comments

Common pattern across CLI tools. Splectrum integrates with pac/nopac workflow.
