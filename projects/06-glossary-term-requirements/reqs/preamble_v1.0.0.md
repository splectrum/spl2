**Type:** plain req

# preamble

## Spec

Reference block at the start of an artifact. Contains one or more preamble refs.

Structure: Key-value pairs before the main content (Type, Extends, Requirements, etc.).

Purpose: Establish context, traceability, and relationships before content begins.

## Self-eval

- [ ] At start of artifact
- [ ] Contains reference information
- [ ] Before main content
- [ ] Key-value format

## Comments

Example:
```
**Type:** plain req
**Extends:** activity
**Requirements:** some_req_v1.0.0.md
```
