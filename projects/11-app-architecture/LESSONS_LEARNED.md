# Lessons Learned - Project 11: App Architecture

## Project Evolution

**Original scope:** App architecture (system apps, spot apps, location-aware routing)

**Actual deliverables:** Container architecture (type system, lifecycle methods, introspection)

The project pivoted from app-level to container-level architecture. This is foundational work that enables the app-level architecture to come later. Classic exploration project pattern - you discover what you need to build.

## Key Deliverables

### Type System
- 7 container types: container, api, method, package, module, modules, spl
- Type stack algorithm (extends chain first, then instantiates chain)
- Dual runner categories (runners + instanceRunners)
- All types pass selfeval validation

### Container Lifecycle
- `create` - establish identity in work_module
- `lift` - materialize resources from overlay for editing
- `delete` - remove from work_module (preserves _reqs)
- Overlay-based resource resolution through type chain

### Introspection
- `whoami` with levels support
- `selfeval` with type stack traversal
- Detail levels: topline/summary/detail/enriched
- Requirements displayed at enriched level

## Methodology Insights

### What Worked

**Type stack algorithm:** Extends chain first (type layer), then instantiates chain (instance layer). Clean separation between type validation and instance validation. The `instanceLevel` marker elegantly handles the bootstrap case.

**Overlay pattern:** Resources inherit through type chain until locally overridden. Lift encapsulates the complexity of finding the right resource. Simple mental model: create identity, lift to edit.

**Selfeval framework:** Runners as libs with `run(containerFsPath)` export. Type runners validate all levels, instance runners validate only at instance level. Composable and extensible.

**Requirements structure:** Objects with name/description/file in manifest, actual content in markdown files. Whoami can display at appropriate detail level.

### What Was Learned

**Virtual containers:** Can call methods on paths that don't exist yet - overlay resolves to parent's type. Enables create to work before container exists.

**Final vs non-final resources:** Final resources (_reqs, _lib, _tests) don't overlap - each container owns its own. Non-final resources (index.js, _schemas) inherit via overlay.

**Bootstrap case:** When a type instantiates itself or an ancestor, instanceLevel points to existing stack position rather than adding new entry. Handles spl/api self-instantiation cleanly.

### What Could Be Improved

**Documentation lag:** Design decisions captured in notes/ but not always propagated to _reqs. Need discipline to update _reqs as implementation evolves.

**Index.json format:** The _reqs/index.json format (objects with name/description/file) wasn't obvious. Could benefit from schema validation.

## Technical Decisions

### Type Stack Structure
```
Type layer:    container → extends chain (deduped)
Instance layer: instantiates → extends chain (deduped, merged)
instanceLevel:  marks where instance validation applies
```

### Resource Categories
- **Final:** _reqs/*.md, _lib/*.js, _tests/*.js - no overlap allowed
- **Non-final:** index.js, _schemas/*.avsc - inherit via overlay

### Method Invocation
- Virtual container support via overlay
- Method path parsed: container/method → resolve method via type stack
- Handler receives module object (unified interface)

## Deferred Work

Carried forward to future projects:
- System apps (_cli, _dev, _ops)
- Spot apps (projects)
- Location-aware routing
- Splectrum node install

These build on the container foundation established in this project.

## Risk Review

**From RISKS.md:**
- Complexity risk materialized but was managed through incremental development
- Bootstrap chicken-egg resolved via virtual container pattern
- Type system design took longer than expected but result is solid

## Summary

The project successfully established the container-level architecture needed for app-level work. The type system, lifecycle methods, and introspection tools provide a solid foundation. The pivot from app architecture to container architecture was the right call - you need containers working before you can build apps from them.
