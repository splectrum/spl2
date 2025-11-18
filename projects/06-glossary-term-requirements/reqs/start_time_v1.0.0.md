**Type:** plain req

# start_time

## Spec

Timestamp when something began. General property for marking initiation time.

Type: String (ISO 8601 format, e.g., "2025-11-11T10:30:00.000Z").

Purpose: Timeline analysis, debugging, performance measurement.

## Self-eval

- [ ] ISO 8601 format timestamp
- [ ] String type
- [ ] Marks initiation time
- [ ] Property name is "start_time"

## Comments

Examples:
- Runtime context: `spl.runtime.start_time` - when runtime began
- Execution context: when request started
- Method invocation: when method was called
