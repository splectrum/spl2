# headers

**Type:** plain req
**Extends:** projects/06-glossary-term-requirements/reqs/headers_v1.0.0.md
**Version:** 1.1.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Section of metadata (e.g. in Kafka record).

Accompanying information about the payload.

### Character

- Metadata: about the data, not the data itself
- Structured: key-value pairs typically
- Contextual: provides context for payload

## Self-eval

- [ ] Describes metadata section

## Comments

Common in messaging (Kafka, HTTP, etc.). Splectrum uses Kafka-compatible record structure.
