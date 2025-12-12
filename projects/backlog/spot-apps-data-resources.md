# Spot Apps / Data Resources

**Created:** 2025-12-12
**Source:** Project 11 closure discussion
**Priority:** High
**Dependencies:** Container infrastructure (Project 11)

---

## Problem

Current infrastructure handles functional resources (containers, methods, types) but not data resources (projects, glossary terms, backlog items). Operations on data within spots require manual file editing rather than typed operations.

## Vision

Spot apps that manage data areas, providing typed CRUD operations on data resources.

## Key Concepts

### Data Resources vs Functional Resources

Two kinds of resources in splectrum:

| | Data Resources | Functional Resources |
|---|----------------|---------------------|
| Nature | Things you operate ON | Things that DO operations |
| Examples | Projects, glossary terms, backlog items | Methods, containers, types |
| Namespace | `glossary/dsl`, `projects/11` | `spl/container`, `spl/method` |
| Operations | CRUD on typed items | Introspection, lifecycle |

### Spot Apps

Apps that own and manage a data area (spot):

- **spl/glossary** - manages glossary/, terms, lookups
- **spl/projects** - manages projects/, INDEX.md, workflows
- **spl/backlog** - manages backlog items, priorities
- **spl/status** - manages CURRENT.md, session state

Each spot app:
- Knows its data types (project, glossary_term, backlog_item)
- Provides typed operations (create, read, update, delete, list, query)
- Owns the schema and valid operations for its data area
- Inherits functional capabilities from container types

### Namespace Routing with `../` Prefix

Distinguish data resources from functional resources:

```bash
spl glossary/dsl/addItem          # data resource (routes to glossary app)
spl ../spl/container/whoami       # functional resource (../ prefix)
```

Routing logic:
- No prefix → data resource (spot app handles)
- `../` prefix → functional resource (direct to type system)

This makes data operations the natural default.

### Inheritance

Data resources inherit from functional resources:
- A glossary term still has `whoami`, `selfeval` via type inheritance
- Spot app methods are additional operations on the data type
- Same container infrastructure, different operation focus

## Examples

### spl/glossary app

```bash
spl glossary/dsl/list                    # list DSL terms
spl glossary/dsl/add --term="foo"        # add term
spl glossary/dsl/get --term="api_node"   # get term details
spl glossary/stepping-stones/search --pattern="friction"
```

### spl/projects app

```bash
spl projects/list                        # list all projects
spl projects/create --name="12-foo"      # create project (knows template)
spl projects/11/status                   # get project status
spl projects/11/close                    # close project (knows workflow)
```

### spl/backlog app

```bash
spl backlog/list                         # list backlog items
spl backlog/add --name="new-item"        # add item
spl backlog/prioritize --item="foo"      # update priority
```

## Implementation Approach

### Phase 1: Data Type Foundation

- Define data type concept (vs container type)
- Schema for data resources
- Inheritance from container types
- Routing logic for `../` prefix

### Phase 2: First Spot App (glossary)

- spl/glossary app managing glossary/
- glossary_term data type
- CRUD operations on terms
- Validate pattern

### Phase 3: Additional Spot Apps

- spl/projects
- spl/backlog
- spl/status

## Technical Notes

### Data Types

Data types define:
- Schema (what fields a project/term/item has)
- Valid operations (what you can do)
- Validation rules
- Relationships to other types

### Spot App Structure

```
spl/glossary/
  index.json          # spot app identity
  _lib/
    glossary.js       # data operations
  dsl/
    add/              # method: add term to DSL
    list/             # method: list DSL terms
  stepping-stones/
    add/
    list/
```

### Routing

Entry point recognizes spot namespaces:
- Known spots: glossary, projects, backlog, status, etc.
- Route to spot app
- App handles method resolution within its domain

## Success Criteria

1. Data resources have typed operations
2. Spot apps manage their data areas
3. `../` prefix cleanly distinguishes functional calls
4. Inheritance from container types works
5. Consistent patterns across spot apps

## Open Questions

- How to register known spots for routing?
- Data type schema format (AVRO? JSON Schema?)
- Relationship between data types and container types
- Migration path for existing spot data

## Related

- spots-housekeeping-requirements.md (requirements/process level)
- App Architecture backlog item (general app patterns)
- Container infrastructure (Project 11)
