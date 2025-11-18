**Type:** plain req

# artifact_to_requirements_pinning

## Spec

All artifacts reference their requirements version as mandatory first line. Enables quality assessment and versioned evolution without forced upgrades.

Pattern: First line of artifact states which requirements it satisfies.

Scope: Global.

Purpose: Traceability, quality assessment against specific version, local rules apply (no retroactive burden).

## Self-eval

- [ ] Artifact has requirements reference as first line
- [ ] Reference is to specific version
- [ ] Enables quality assessment
- [ ] No forced upgrade when requirements evolve

## Comments

Example: `**Requirements:** projects/04-bare-runtime-hello-world/Exploration_project_requirements_v1.0.0.md`
