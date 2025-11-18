**Type:** plain req

# headers

## Spec

Metadata component of Kafka-compatible record structure. Hierarchical nested object storing operational metadata, configuration, and context properties.

Structure: Nested namespacing (e.g., `{spl: {runtime: {version: "0.1.0"}}}`). Accessed via dot notation or optional chaining.

Distinction from value: headers = metadata about the data; value = the data itself.

Purpose: Separate metadata from payload while maintaining Kafka compatibility.

## Self-eval

- [ ] Hierarchical object structure
- [ ] Contains metadata, not payload data
- [ ] Namespace separation via nesting
- [ ] Part of Kafka record (alongside key, value)

## Comments

AVRO schema details TBD during implementation. Will likely use nested record types or map structures.
