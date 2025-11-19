**Type:** plain req

# glossary

## Spec

Registry of terms with associated reqs. Can be created for different contexts.

Terms can represent various things:
- Words of a vocabulary
- Functional units
- Patterns
- Concepts
- Procedures

Each glossary type defines its entry structure based on context needs.

**Glossary conceptual territories:**

| Glossary | Land | Focus |
|----------|------|-------|
| Stepping stones | Creator's land | Patterns, concepts, design decisions |
| Howto | User's land | Procedures, actions, execution |
| DSL | Language land | Vocabulary, API terms, runtime objects |
| Spots | Functional land | Repository structure, activity locations |

**Different questions served:**
- Stepping stones: "What pattern/concept is this?"
- Howto: "How do I do this?"
- DSL: "What does this term mean in SPL2 language?"
- Spots: "Where does this activity happen?"

Same term can exist in multiple glossaries with context-specific meaning (e.g., efficient_search as concept vs procedure).

Mutable artifact - updated as terms are added or refined. Terms reference versioned immutable reqs.

Scope: Global.

Purpose: One term, one meaning within context. Consistent vocabulary enabling clear communication.

## Self-eval

- [ ] Context is clear
- [ ] Entry structure defined
- [ ] Terms have associated reqs (or path to reqs)
- [ ] One meaning per term within context
- [ ] Glossary territory/land is identified

## Comments

Four glossary territories identified from Project 07 exploration: creator's land (stepping stones), user's land (howto), language land (DSL), functional land (spots).
