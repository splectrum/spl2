**Type:** plain req
**Extends:** api

# execution

## Spec

Request execution management API. Handles pipeline execution within a runtime context.

Core `spl/execution` provides base execution capabilities. Other packages may define execution APIs that extend core or implement different execution environments.

Distinction from runtime: runtime manages session-level properties and configuration; execution manages request-level pipeline invocation.

Purpose: Orchestrate method invocation sequences (pipelines) for a single request.

## Self-eval

- [ ] Manages request-level execution (not session-level)
- [ ] Supports pipeline execution
- [ ] Clear relationship to runtime context
- [ ] API structure follows api node pattern

## Comments

Implementation details TBD. This is a skeleton - will be refined when spl/execution is implemented.
