**Type:** plain req

# plain req

## Spec

Plain req is a req type using natural language for both spec and self-eval. Simplest format for defining what something needs to achieve and how to verify it.

Structure:
- Type reference (first line) - points to req type being used
- Extends (optional) - list of terms this req inherits from; all extended reqs apply; use term names (glossary resolves to current req version)
- Spec - what needs to be achieved, in everyday language
- Self-eval - how to verify correct understanding/usage
- Comments (optional) - examples, additional detail, related information that would bloat the spec

Versioning: Versions evolve within backward compatibility. Breaking changes require new type/term rather than new version.

Purpose: Base req type - all other req types extend from this. Enable reqs for conceptual terms, methodology patterns, and glossary entries where formal specification language is unnecessary overhead.

## Self-eval

- [ ] Uses natural language (no formal notation required)
- [ ] Has clear spec section stating what needs to be achieved
- [ ] Has clear self-eval section with verifiable criteria
- [ ] Type reference points to itself (self-referential bootstrap)
- [ ] Can be understood without specialized knowledge
- [ ] Comments section (if present) adds value without bloating spec
