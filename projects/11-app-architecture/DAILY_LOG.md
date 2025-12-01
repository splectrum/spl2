# Daily Log

## 2025-11-30

### Project Created

Project 11 initiated from backlog item "Dev Env Pipeline Completion", incorporating the repo/node/app architecture design from post-Project 10 discussions.

**Design references:**
- Repo/Node/App Design (chats/immutables/)
- App Unification Discussion (chats/immutables/)

**Key vision:**
- Node as seat serving repo
- Spot apps (name = spot folder)
- System apps (underscore prefix)
- Location-aware routing
- Freestyle + formal in same app

**Products defined:**
1. App Architecture Core
2. _cli (evolved from cli-static)
3. _dev (dev bundle as app)
4. _ops (ops sidecar as app)
5. projects spot app
6. Single node consolidation

### Project Plan Discussion

**Backlog and CIP consolidation first:**
- App architecture vision changes things significantly
- Some backlog items may be redundant, need updating, or misaligned
- CIP register also needs review - recent work may have addressed items
- Combined cleanup gives complete picture of outstanding work
- Clean slate before diving into implementation

**_boot deferred:**
- Node install from scratch is not a priority
- Working node exists - copy and amend is sufficient
- May carry over to future project

**Dropped _cli, _dev, _ops:**
- App thinking hasn't crystallized into practical node-wide plan
- Need to solve app lifecycle first (install, start, manage)
- These migrations come later once lifecycle is understood

**Splectrum node cleanup added at #2:**
- We're already working in one node de facto
- Ops sidecar folder still exists - needs cleanup
- Mothball functionality from ops/dev bundle not yet in splectrum node
- Clean foundation before building app architecture

**Final work item order:**
1. Backlog and CIP Consolidation
2. Splectrum node cleanup
3. App-based design and implementation experience (core product)
4. Elevator pitch for Pear/Bare
5. Splectrum node install (may emerge from item 3)

Dropped: _cli, _dev, _ops, projects spot app - will emerge from experience work.

**Elevator pitch added (item 4):**
- Audience: Pear/Bare builders looking to support ecosystem projects
- Angle: Researcher, not businessman
- Focus: AI collaboration and autonomy in decentralized setting
- Open source (MIT), happy to be "researcher" in any initiative
- Fellow builder contribution, not business pitch

### Experience Product Discussion

**Main product clarified:** App-based streamlined design and implementation experience

**The fixtures we have:**
- Req design with selfevals (specification and validation)
- Work module (packaging work)
- Formal implementation (module structure, hierarchy)
- Free scripting (fast iteration, exploration)
- Unified execution pathways (same interface for command/library/inline)
- Self-contained app (boundary and structure)
- Mycelium web pattern (self-similar at every level)

**Not orchestration - pattern driven:**
- No central conductor coordinating pieces
- Things happen as consequence of data patterns
- A data change creates a key that unlocks a door
- Local rules apply in layered contexts

**Mycelium web flow:**
- Links entrypoints, never directly to internals
- Flow: entrypoint → context internal → other context entrypoint
- Each context is self-contained domain with own local rules
- Always through doors, never through walls

**The full architecture:**
```
Explore in scripts (the sea)
        ↓
Functional patterns emerge
        ↓
Crystallize into APIs (islands)
        ↓
As consequence → data structures crystallize
(where 'local rules apply' can be expressed)
        ↓
DSL vocabulary connects islands into continent
(common understanding, not separate islands)
```

**Key relationships:**
- Data patterns are keys that unlock doors
- APIs are functional constructs that sit on patterns
- Free scripting is the flux zone between formal constructs
- DSL glossary is common language binding it all
- Data structures emerge FROM APIs crystallizing (not separate)

**The experience:**
- Explore in scripts (flux)
- Functional patterns emerge
- Crystallize into APIs
- Data structures follow as consequence
- DSL vocabulary connects into coherent whole

---

*Log entries added as work progresses.*
