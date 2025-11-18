**Type:** plain req

# node_version

## Spec

Node.js version of execution environment. Runtime property captured for reproducibility and environment validation.

Type: String (version format, e.g., "v20.10.0").

Location: Runtime context headers as `spl.runtime.node_version`.

Purpose: Bug reproduction, compatibility checking, environment identification.

## Self-eval

- [ ] Captures actual Node.js version
- [ ] String type with version format
- [ ] Stored in runtime context headers
- [ ] Property name is "node_version"

## Comments

Used for debugging and ensuring consistent execution environment.
