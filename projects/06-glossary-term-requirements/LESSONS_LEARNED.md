# Lessons Learned - Project 06: Glossary Term Requirements

## What Went Well

**Unified structure emerged naturally:**
- Started with DSL's 5-column approach, evolved to lean 3-column (Term | Description | Req)
- Same structure worked across all three glossaries despite different contexts
- Type/extends information fits naturally in bold within description

**Term-by-term discussion (Product 3) produced higher quality:**
- User's correction to slow down prevented batch errors
- Each term got proper consideration
- Discovered terms to remove (duality pattern, headline/detail separation)
- Discovered terms to add (activity, preamble, ref)
- Refined definitions through dialogue (friction, maturity, autonomy)

**Base concepts crystallized:**
- api_node as DSL foundation (all hierarchy terms extend it)
- activity as Stepping Stones foundation (microservice ownership pattern)
- spot as Spots foundation (activity-based locations)

**Extends pattern with term names (not versions):**
- Avoids coupling to specific versions
- Glossary resolves term to current req version
- Enables evolution without mass reference updates

## What Could Be Improved

**Should update glossary as we go:**
- User caught oversight after Product 2
- Pattern established: create req, immediately update glossary
- Prevents disconnect between artifacts and their index

**Calibration on autonomy levels:**
- Product 2: batch processed without updating glossary (oversight)
- Product 3: started batch, user corrected to term-by-term
- Product 4: user granted full autonomy
- Learning: ask or propose autonomy level per product, not per project

**Deferred scope items accumulated:**
- Product 5, housekeeping concept, backlog restructuring, spots requirements
- All related to repository structure/tooling
- Better to bundle related deferrals for future pickup

## Technical Discoveries

**Naming conventions by context:**
- DSL: single underscore for word boundary (`api_node`), double for hierarchy (`spl__runtime__run`)
- Stepping stones: lowercase with spaces (natural language)
- Spots: keep trailing slash to match directories (archive/, chats/)

**Three completeness patterns identified:**
- Minimal and complete: don't know what complete looks like
- More than complete: complete exists but hard to extract
- Third pattern (unnamed): preservation needs vs space constraints

**Activity ownership pattern:**
- Activity registers change with spot
- Spot executes
- Microservice-style division of labor

## Process Observations

**Project scale:**
- 67+ term reqs created (24 DSL + 35+ Stepping Stones + 8 Spots)
- Significant meta-work establishing patterns for all future terms
- Pattern validated at scale

**Chicken and egg navigation:**
- plain_req defined using plain_req format (bootstrap)
- Stepping stones glossary entry uses stepping stones glossary req
- Self-referential but coherent

**Context continuation worked well:**
- Multiple sessions with summary handoffs
- Maintained coherence across long project
- Daily log essential for tracking decisions

## Recommendations for Future Projects

1. **Establish autonomy level per product** - explicit agreement prevents friction
2. **Update indexes immediately** - don't batch glossary updates
3. **Bundle related deferrals** - easier to pick up coherent chunks later
4. **Term-by-term for conceptual work** - batch only for mechanical tasks
5. **Base concepts first** - establish foundations before extensions

## Deferred Items

The following scope items were deferred for future work (likely combined with tooling):
- Product 5: Spots Structure Twin Pair
- Housekeeping concept definition
- Backlog restructuring (backlog/ as independent spot)
- Spots requirements document
- Integration with Project requirements

These are related and would benefit from being tackled together when tooling work begins.
