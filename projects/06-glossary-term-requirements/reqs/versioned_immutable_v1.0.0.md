**Type:** plain req

# versioned immutable

## Spec

Artifact that doesn't change once created but can have new versions. Evolution creates new version file rather than modifying existing.

Filename pattern: `name_vX.Y.Z.md` where:
- X = major (breaking changes)
- Y = minor (additions, enhancements)
- Z = patch (fixes, clarifications)

Examples: requirements documents, detail files referenced by mutable headlines, term reqs.

Purpose: Enable evolution with full traceability. Each version remains valid and referenceable. Artifacts can pin to specific versions (local rules apply).

## Self-eval

- [ ] Filename follows `name_vX.Y.Z.md` pattern
- [ ] Content doesn't change after creation (new version for changes)
- [ ] Version number reflects change significance (major/minor/patch)
- [ ] Can be referenced by other artifacts with specific version
- [ ] Previous versions remain valid (local rules apply)
