**Type:** plain req

# stepping stones glossary

## Spec

Registry of navigational concepts for understanding SPL2 methodology.

**Entry point question:** "What is X?" / "What does X mean?"

When seeking to understand a concept, pattern, or design decision - start here. Stepping stones are about comprehension, not action.

**Entry structure:**
- **Term** - lowercase (abbreviations encouraged, with redirects)
- **Description** - what the term means; type/extends in bold where applicable
- **Req** - pointer to versioned req file

**Spider pattern:**
- Term leads to req file with full specification
- Extends relationships lead to parent concepts
- Related terms lead to connected concepts

**Contrast with howto:**
- Stepping stones: "What is a project?" (understanding)
- Howto: "How do I close a project?" (action with goal)

Howtos spider INTO stepping stones when they need concepts to execute procedures. Stepping stones provide the understanding; howtos provide the action path.

Glossary is mutable (terms added/updated), entries reference versioned immutable reqs.

Scope: Global.

Purpose: Define navigational vocabulary for SPL2 methodology. Entry point for understanding concepts.

## Self-eval

- [ ] Entry has three columns (Term, Description, Req)
- [ ] Term is lowercase
- [ ] Description is concise
- [ ] Req points to versioned req file (or empty for redirects)
- [ ] Redirect entries exist for full forms of abbreviations
- [ ] Serves understanding/comprehension questions

## Comments

Evolved from v1.0.0 to clarify entry point distinction (understanding vs action) and spider relationship with howto glossary.
