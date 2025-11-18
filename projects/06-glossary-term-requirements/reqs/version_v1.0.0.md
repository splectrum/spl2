**Type:** plain req

# version

## Spec

Version identifier using semantic versioning. Platform-wide versioning scheme.

Type: String (semver format: x.y.z).

Applies to: APIs, runtime, artifacts, immutables - consistent across Splectrum.

Purpose: Code footprint identification, compatibility checking, reproducibility.

## Self-eval

- [ ] Follows semver format (x.y.z)
- [ ] String type
- [ ] Consistent with platform versioning scheme
- [ ] Property name is "version"

## Comments

Same versioning scheme used for versioned immutables applies to runtime, APIs, and all versioned components.
