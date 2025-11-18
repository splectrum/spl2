**Type:** plain req

# major

## Spec

First component of semver (x.y.z). Increment for breaking changes - changes that are not backward compatible.

When to increment: Existing consumers would break without modification.

In Splectrum: For reqs and artifacts, breaking changes should create new term/type rather than major bump (see plain_req versioning rule).

Purpose: Signal incompatibility requiring consumer changes.

## Self-eval

- [ ] Indicates breaking changes
- [ ] First component of version string
- [ ] Increment resets minor and patch to 0

## Comments

Example: 1.0.0 → 2.0.0 (breaking change)
