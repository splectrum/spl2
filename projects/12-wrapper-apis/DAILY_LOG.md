# Project 12: Daily Log

---

## 2025-12-12

### Session Start

Project created from backlog item. Exploration project type selected based on:
- No existing reqs for wrapper API pattern
- Requires discovering patterns through collaboration
- Open questions around storage, retention, output capture

### Project Creation (Autonomous)

- Created project folder structure (12-wrapper-apis/reqs/)
- Created PROJECT_BRIEF.md from backlog item
- Created RISKS.md with initial risk assessment
- Created this DAILY_LOG.md

### Initiation Phase (Collaborative)

Created PROJECT_PLAN.md with 4 products:
1. spl/avro - enabling infrastructure (4 stages)
2. spl/git - git wrapper (2 stages)
3. spl/container/select - xpath-style queries (4 stages)
4. Additional Wrapper APIs - research/planning/potential implementation (3 stages)

Key decisions:
- AVRO included (was separate backlog item) - needed for schema work
- Platform-agnostic approach - Bare compatibility validated early
- spl/container/select instead of spl/search - semantic queries over hive
- spl/file dropped - audit trails are separate app concern

Updated reqs:
- create_project_v1.3.0.md - removed dev bundle, work module approach

### Moving to Execution

Starting Product 1: spl/avro, Stage 1: Bare test

### Bare Test Progress

**Entry point consolidation:**
- Moved `spl` shell script from repo root into `splectrum/spl`
- Created `splectrum/splb` for Bare runtime (same spl.mjs, different runtime)
- Both entry points now inside the splectrum node (self-contained)

**Key insight from discussion:**
- No need for separate .cjs file for Bare
- Project 04 validated: Bare runs .mjs files directly
- Same code, different runtime: `node spl.mjs` vs `bare spl.mjs`

**Manual steps needed (shell broke during session):**
```bash
chmod +x /home/herma/splectrum/spl2/splectrum/spl /home/herma/splectrum/spl2/splectrum/splb
rm /home/herma/splectrum/spl2/spl
```

**Next:** Test both entry points, then continue avsc analysis

---

## 2025-12-14

### Type Hierarchy Refactor

**spl/introspection created:**
- New base API type for introspection methods
- spl/container now extends spl/introspection
- Moved whoami, selfeval, framework libs, base schemas
- Created type and instance reqs
- Added select method to roadmap (xpath-style queries)

**stackType parameter for buildTypeStack:**
- 'full' (default), 'extends', 'instantiates'
- Schema inheritance now correctly uses 'instantiates' chain
- Key fix: instantiates chain is for functional contract (schemas), extends chain is for structural inheritance

**Flat api format support:**
- `["method1", "method2"]` in addition to nested facets `{ facet: [methods] }`

### Design Insight: Data/Functional Duality

**spl/container** - Type cornerstone (data)
- What a container IS structurally
- Validation, constraints, structural rules

**spl/api** - Functional cornerstone (behavior)
- How you interact with containers
- Methods, execution, I/O

The dual inheritance model:
- `extends`: data/structural inheritance (what I am)
- `instantiates`: functional inheritance (how I behave)

spl/api is where data meets behavior - it instantiates itself but extends spl/container. Everything functional flows through spl/api. Schema inheritance follows `instantiates` because it's about functional contract, not structural definition.

**→ Add to DESIGN_REGISTER.md at project closure**

---

## For Project Closure

- create_project howto updated to v1.3.0 (removed dev bundle, work module approach)
- Entry points moved into splectrum node (self-contained)
- **Design element:** Data/Functional Duality (spl/container vs spl/api) → DESIGN_REGISTER.md
- select method moves to spl/introspection (from original spl/container/select plan)
