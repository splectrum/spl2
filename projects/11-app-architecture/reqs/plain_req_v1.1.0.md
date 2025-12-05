**Type:** plain req
**Extends:** plain_req_v1.0.0
**Version:** 1.1.0

# plain req

## Spec

Plain req is a req type using natural language for both spec and self-eval. Simplest format for defining what something needs to achieve and how to verify it.

Structure:
- Type reference (first line) - points to req type being used
- Extends (optional) - req this version builds on
- Version - semver in preamble
- Spec - what needs to be achieved, in everyday language
- Self-eval - how to verify correct understanding/usage
- Comments (optional) - examples, additional detail, related information that would bloat the spec
- Models (optional) - references to well-written reqs as examples

Versioning: Versions evolve within backward compatibility. Breaking changes require new type/term rather than new version.

Purpose: Base req type - all other req types extend from this. Enable reqs for conceptual terms, methodology patterns, and glossary entries where formal specification language is unnecessary overhead.

## Self-eval

- [ ] Uses natural language (no formal notation required)
- [ ] Has clear spec section stating what needs to be achieved
- [ ] Has clear self-eval section with verifiable criteria
- [ ] Type reference on first line
- [ ] Version in preamble
- [ ] Can be understood without specialized knowledge
- [ ] Comments section (if present) adds value without bloating spec
- [ ] Models section (if present) references actual reqs, not hypotheticals

## Comments

Changes from v1.0.0:
- Added Version to preamble (was only in filename)
- Added Models section for referencing well-written reqs as examples

## Models

*To be populated at project closure with examples from Project 11.*
