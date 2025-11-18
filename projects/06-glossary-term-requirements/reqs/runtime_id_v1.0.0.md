**Type:** plain req

# runtime_id

## Spec

Unique identifier for runtime execution instance. Used for request tracking, debugging, and log correlation.

Type: String (UUID format).

Location: Runtime context headers as `spl.runtime.runtime_id`.

Purpose: Correlate logs, errors, and state across execution lifecycle.

## Self-eval

- [ ] Globally unique (UUID format)
- [ ] String type
- [ ] Stored in runtime context headers
- [ ] Property name is "runtime_id"

## Comments

Enables tracing a single runtime session through all its execution contexts.
