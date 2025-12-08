# dsl glossary

**Type:** plain req
**Extends:** projects/06-glossary-term-requirements/reqs/dsl_glossary_v1.0.0.md
**Version:** 2.0.0
**Project:** 11-app-architecture

---

## Spec

Extends v1.0.0 with category system and horizontal meaning requirements.

The DSL glossary is the Splectrum vocabulary - horizontal meaning consistency across the platform.

### Category (Provenance)

Each term has a category indicating vocabulary provenance:

| Category | Meaning |
|----------|---------|
| native | Splectrum's own vocabulary; home terms |
| foreign | Borrowed from convention; maps to native terms |
| dialect | Local/context-specific variation |

Like a dictionary marking foreign origin.

### Entry Structure (evolved)

```json
"term": {
  "category": "native|foreign|dialect",
  "description": "horizontal meaning; type embedded in description",
  "req": "path/to/detailed/requirement.md or null"
}
```

- **category**: provenance (required)
- **description**: compact horizontal meaning (required)
- **req**: path to detailed specification (optional)

### Horizontal Meaning

Descriptions must provide general, context-independent meaning - not implementation-specific details.

**Wrong:** "Invocation flag for minimal output; topline level only" (implementation detail)
**Right:** "output level; minimal metadata, essential result only" (horizontal meaning)

### Description Pattern

`[type]; [horizontal meaning]`

Type is embedded in description. Category serves different purpose (provenance).

### Self-Referential Vocabulary

Definitions should use DSL terms where appropriate:

"flag directing handler to execute at topline output level" uses: flag, handler, topline (all DSL terms).

### Native vs Foreign

When SPL has own vocabulary differing from convention:
1. Native terms are canonical
2. Foreign terms document mapping: "maps to [native term]"

Example: verbose (foreign) maps to detail (native).

## Self-eval

- [ ] Entry has category field (native/foreign/dialect)
- [ ] Description provides horizontal meaning, not implementation detail
- [ ] Type embedded in description
- [ ] Foreign terms include "maps to [native]"
- [ ] Self-referential where appropriate

## Comments

Discovered through meandering (see stepping stone). Started with "how to use req in whoami", evolved to vocabulary provenance system.

Primary audience: AI agents working with Splectrum.
