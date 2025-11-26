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
- Stepping stones: "What is X?" (understanding)
- Howto: "How do I do X?" (action with goal)
- DSL: "What does this term mean in SPL2 language?"
- Spots: "Where does this activity happen?"

Same term can exist in multiple glossaries with context-specific meaning.

### Reference Rules (CRITICAL)

**Mutable-to-mutable references: Use term names, never paths.**

When a mutable artifact (glossary entry, howto, foundation doc) references another concept in the mutable web, it MUST use the glossary term name, not a file path.

| Reference Type | Use | Example |
|----------------|-----|---------|
| Mutable → Mutable | Term name | "see `blank project`" |
| Mutable → Immutable | Allowed but rarely needed | Direct path okay |
| Immutable → Immutable | Versioned path | "extends blank_project_v1.1.0.md" |

**Why this matters:**
- Glossary entries point to current req versions (updated as reqs evolve)
- Term references automatically resolve to current version via glossary lookup
- Path references freeze to specific version, become stale
- Spidering through terms keeps the mutable web consistent

**Example - correct:**
```
# close project howto
1. Look up project type in `stepping stones glossary`
2. Find e.g. `exploration project`
3. Follow req, including extends to `blank project`
```

**Example - incorrect:**
```
# close project howto
1. Read projects/08-.../exploration_project_v1.1.0.md  ← WRONG: frozen path
2. Read projects/08-.../blank_project_v1.1.0.md       ← WRONG: frozen path
```

**No duplication rule:**

Howtos are minimal routers. They spider to concepts (stepping stones) which own the detail. Never duplicate information across the mutable web - it becomes contradictory as reqs evolve.

- Howto says "what to do" (minimal)
- Stepping stone req says "how it works" (detail)
- Single source of truth per concept

Mutable artifact - updated as terms are added or refined. Terms reference versioned immutable reqs.

Scope: Global.

Purpose: One term, one meaning within context. Consistent vocabulary enabling clear communication. Mutable indirection layer keeping the web consistent.

## Self-eval

- [ ] Context is clear
- [ ] Entry structure defined
- [ ] Terms have associated reqs (or path to reqs)
- [ ] One meaning per term within context
- [ ] Glossary territory/land is identified
- [ ] Mutable references use term names, not paths
- [ ] No duplication of detail across entries

## Comments

Evolved from v1.1.0 to add critical reference rules: mutable-to-mutable references must use term names (not paths) to ensure ongoing consistency as reqs evolve. Added no-duplication rule.
