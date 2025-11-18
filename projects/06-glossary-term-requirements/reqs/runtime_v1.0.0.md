**Type:** plain req
**Extends:** api

# runtime

## Spec

API for runtime context management. The context within which execution contexts run.

Manages session-level state: environment properties, configuration, runtime identification.

Distinction from execution: runtime is the container/environment; execution is the request-level work within.

Purpose: Establish and manage the environment for execution.

## Self-eval

- [ ] Manages session-level context
- [ ] Contains execution contexts
- [ ] Provides runtime properties (version, node_version, runtime_id, start_time)
- [ ] API structure follows api_node pattern

## Comments

Example: `spl/runtime` - core runtime context API with entry point `run`.
