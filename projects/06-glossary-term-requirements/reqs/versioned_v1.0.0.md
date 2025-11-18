**Type:** plain req

# versioned

## Spec

Artifact that uses the global versioning scheme for evolution tracking.

Scheme: Semantic versioning (major.minor.patch)
- **major** - breaking changes
- **minor** - new backward-compatible features
- **patch** - backward-compatible bug fixes

Filename pattern: `name_vX.Y.Z.md`

Applies to: all versioned artifacts platform-wide (reqs, APIs, runtime, immutables).

Scope: Global.

Purpose: Consistent versioning across Splectrum. Track evolution, enable compatibility checking.

## Self-eval

- [ ] Uses semver format (x.y.z)
- [ ] Version in filename
- [ ] Appropriate version component incremented
- [ ] Backward compatibility rules followed

## Comments

See: versioned immutable (specific artifact pattern), version (property), major, minor, patch (components)
