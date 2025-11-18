**Type:** plain req

# primary_key

## Spec

Concept defining record identity in Kafka and streaming contexts. The key property implements primary_key.

Determines:
- Topic partitioning (records with same key go to same partition)
- Consumer group behavior (partition assignment)
- Record set shaping in streaming (natural ordering, record distinction, updates)

In streaming: primary_key defines the natural order - records with same key are updates to the same entity.

Purpose: Fundamental concept for understanding Kafka behavior and streaming data patterns.

## Self-eval

- [ ] Explains partitioning behavior
- [ ] Explains consumer group implications
- [ ] Explains streaming record set shaping
- [ ] Clear relationship to key property

## Comments

See: key (the property that implements primary_key)
