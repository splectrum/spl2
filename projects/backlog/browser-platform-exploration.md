**Requirements:** See `projects/project-types/Exploration_project_requirements_v1.0.0.md`
**Requirements:** See `projects/04-bare-runtime-hello-world/Project_requirements_v1.3.0.md`

# Browser Platform Exploration

**Project Type:** Exploration Project
**Priority:** High
**Status:** Backlog

---

## Background

Project 04 (Bare Runtime Hello World) validated dual-platform capability (Node.js + Bare) for SPL2 runtime. Strategic insight emerged: **Browser is the third pillar**.

**Three-pillar platform strategy:**
1. **Node.js** - Development velocity, full ecosystem, server-side
2. **Bare** - P2P capabilities, efficient native, mobile/desktop
3. **Browser** - Universal reach, no installation, web apps/PWAs

**If achieved:** "We're really cooking on gas!" - smooth portability across all three platforms positions SPL2 uniquely in ecosystem.

**Hypothesis:** Bare → Browser may be easier than Node → Browser because Bare's minimal dependencies align better with browser constraints.

---

## Objective

Validate browser as viable third pillar platform for SPL2 runtime:
- Prove SPL2 runtime pattern works in browser
- Identify browser-specific abstraction needs
- Validate platform abstraction extends to browser
- Complete three-pillar portability triangle

---

## Business Justification

**Strategic capability:**
- Write once, run anywhere (Node/Bare/Browser)
- Each pillar serves distinct purpose:
  - Node: Development, testing, full tooling
  - Bare: P2P networking, native efficiency
  - Browser: Universal reach, zero installation

**Market positioning:**
- True cross-platform capability rare
- AI-first platform that runs everywhere
- P2P + Browser = powerful combination

**Validation needed:**
- Browser constraints may block patterns
- File system abstraction non-trivial (IndexedDB/OPFS)
- Better to discover blockers early

---

## Scope

**In scope:**
- Browser runtime validation (SPL2 pattern in browser)
- Platform abstraction extension (add browser detection/APIs)
- File system abstraction exploration (IndexedDB, OPFS, or alternatives)
- Browser lifecycle handling (no process.exit equivalent)
- Basic P2P in browser validation (WebRTC/WebTransport)
- Migration guide for browser platform

**Out of scope:**
- Full UI framework (focus on runtime only)
- Production browser deployment
- Comprehensive P2P implementation (basic validation only)

---

## Dependencies

**Prerequisite:**
- Bare Runtime Compatibility project complete
- Platform abstraction implemented in production runtime

**Blocks:**
- Full three-pillar platform claim
- Browser-based P2P applications

---

## Success Criteria

- SPL2 runtime pattern works in browser
- Platform abstraction extended to include browser
- File system abstraction validated (IndexedDB/OPFS or alternative)
- Basic P2P capability proven in browser
- Migration guide documents browser platform patterns
- Requirements extracted for browser platform support

---

## Exploration Questions

1. Does SPL2 runtime pattern work in browser without major changes?
2. How to abstract file system? (IndexedDB, OPFS, virtual FS, or skip?)
3. Browser lifecycle vs Node/Bare lifecycle differences?
4. P2P in browser: WebRTC, WebTransport, or Pear patterns?
5. Module loading in browser (dynamic import, bundling)?
6. Performance characteristics vs Node/Bare?
7. Is Bare → Browser easier than Node → Browser?

---

## Initial Risks

- **R01: File system impedance** - Browser file system fundamentally different, may not map to abstraction
  - Mitigation: Explore alternatives (IndexedDB, OPFS, memory-only, skip FS)

- **R02: P2P complexity** - Browser P2P may require significant additional work
  - Mitigation: Basic validation only, defer full implementation

- **R03: Runtime pattern mismatch** - Browser constraints may break SPL2 pattern
  - Mitigation: Exploration discovers blockers early, may adjust pattern

- **R04: Bundling complexity** - Browser may require bundling that complicates dual-platform
  - Mitigation: Explore unbundled approaches (ES modules, import maps)

---

## Notes

**Origin:** Discovered during Project 04 strategic discussion

**User insight:** "Browser as a platform is the third pillar - very important. If we can achieve smooth portability across all three then 'we're really cooking on gas'!"

**Timing:** Should happen AFTER Bare/Node implementation complete (validate two platforms before adding third)

**Related work:**
- Platform abstraction architecture (Project 04 Twin Pair 4)
- Dual-platform patterns validated (Project 04)
- Pear P2P Platform project (browser P2P may inform)

**Strategic value:** Completing three-pillar portability is significant differentiator

---

**Status:** Ready for initiation after Bare Runtime Compatibility complete
