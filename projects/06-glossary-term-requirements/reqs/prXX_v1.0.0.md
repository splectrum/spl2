**Type:** plain req
**Extends:** package

# prXX

## Spec

Reserved naming pattern for internal test packages. Format: `pr` followed by project number (e.g., pr03, pr05).

Purpose: Project evaluation and concept validation. Not for external deployment.

When encountered: Package is internal use only - contains test/evaluation artifacts for the associated project.

## Self-eval

- [ ] Name matches pattern `prXX` (pr + number)
- [ ] Contains evaluation/test artifacts
- [ ] Not deployed externally
- [ ] Traceable to originating project

## Comments

Examples:
- `pr03/` - Project 03 evaluation package
- `pr05/` - Project 05 evaluation package
