**Type:** plain req

# dsl glossary

## Spec

Glossary type for SPL2 Domain-Specific Language vocabulary - runtime, APIs, methods, properties.

Entry structure:
- **Term** - lowercase with underscores for word boundaries
- **Description** - type/schema in bold, then description
- **Req** - pointer to versioned req file

Purpose: Define consistent vocabulary for SPL2 development. One term, one meaning.

Glossary is mutable (terms added/updated), entries reference versioned immutable reqs.

## Self-eval

- [ ] Entry has three columns (Term, Description, Req)
- [ ] Term uses underscores for word boundaries
- [ ] Description has type/schema in bold
- [ ] Req points to versioned req file

## Comments

Naming convention: single underscore for word boundary (`api_node`), double underscore for hierarchy (`spl__runtime__run`).
