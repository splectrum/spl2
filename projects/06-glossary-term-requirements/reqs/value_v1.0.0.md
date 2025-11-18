**Type:** plain req

# value

## Spec

Contents component of a key-value pair. Used in conjunction with a designated key property.

Type: Object (structure varies by context).

In Kafka records: the data payload, distinct from headers (metadata).

Purpose: Standard name for the data component in key-value structures.

## Self-eval

- [ ] Contains data (not metadata)
- [ ] Used with designated key property
- [ ] Object type
- [ ] Property name is "value"

## Comments

Structure varies by record type:
- Runtime context value: contains execution context records (numbered "1", "2", etc.)
- Execution context value: contains API state records (namespaced)
- API state value: contains application data
