**Type:** plain req

# key

## Spec

Primary key component of Kafka-compatible record structure. Uniquely identifies the record within its scope.

Type: String.

Purpose: Record identification for lookup, correlation, and Kafka partitioning. Implements primary key concept.

## Self-eval

- [ ] Uniquely identifies record within scope
- [ ] String type
- [ ] Part of Kafka record (alongside headers, value)

## Comments

Examples:
- Runtime context: session/context instance identifier
- API state: specific API invocation or data entity identifier
