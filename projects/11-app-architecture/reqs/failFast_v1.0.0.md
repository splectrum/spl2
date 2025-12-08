# failFast

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Abort a process at earliest error occurrence.

Stop immediately when something goes wrong rather than continuing and accumulating errors.

### Character

- Immediate: no delay on error
- Clean: stops before cascading failures
- Diagnostic: error is clear, not buried

### Opposite

Continue on error, collect all errors, report at end.

## Self-eval

- [ ] Stops at first error
- [ ] Error is clearly reported
- [ ] No partial/corrupted state from continuing

## Comments

Useful for CI/CD, scripting where early failure saves time.
