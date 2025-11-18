**Type:** plain req

# spots glossary

## Spec

Glossary type for repository structure - the spots where different activities happen.

Entry structure:
- **Term** - spot name (folder path)
- **Description** - activity and contents
- **Req** - pointer to versioned req file

Purpose: Define repository structure using activity-based locations. "Know a leopard by its spots" - what we put in place defines the project.

Glossary is mutable (spots added/updated), entries reference versioned immutable reqs.

## Self-eval

- [ ] Entry has three columns (Term, Description, Req)
- [ ] Term is folder path
- [ ] Description defines activity (what you do there)
- [ ] Req points to versioned req file

## Comments

Rooms metaphor: spots are defined by what you do there, not just what they contain.
