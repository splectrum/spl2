# Dev Environment API

**Priority:** High (top priority)
**Type:** Explorative Project
**Dependencies:** Console API Exploration (patterns), AVRO Schema and RPC (partial)
**Source:** Project 07 exploration

---

## Overview

Turn the dev environment patterns from Project 07 into a full infrastructure asset. The Dev Environment API enables autonomous development through self-contained, requirement-driven workflows.

---

## Scope

### Core Components

| Component | Description |
|-----------|-------------|
| **Self-eval requirements** | Formal requirements for self-eval types, harness, method specs |
| **Dev Environment API** | create, submit, cycle, status, teardown methods |
| **Defined purpose environments** | Environment types (API development, bug fix, integration test) |
| **Publishing to spot** | How completed work graduates from dev env to repo spot |
| **Deployment script generation** | Automated creation of resurrection scripts |

### Extended Components

| Component | Description |
|-----------|-------------|
| **Bug report integration** | Bug reports as requirements, routing to dev cycles |
| **Failure preprocessing** | Advisory system for AI context reduction |
| **Template system** | Pre-configured environments for common work types |
| **Parallel coordination** | Multiple dev envs for complex requirements |
| **Artifact management** | Versioning, archiving completed environments |

### Infrastructure Questions

- **Spot structure:** Where does published API code live? (modules/ spot?)
- **Version management:** How do dev env versions relate to published versions?
- **Integration testing:** How do multiple dev envs integrate their outputs?

---

## Why High Priority

1. **Foundation for autonomous development** - enables AI to work independently on well-specified tasks
2. **Quality through discipline** - self-eval provides automated verification
3. **Scales development** - multiple dev envs can work in parallel
4. **Convergent development** - bug fix loop feeds back into same machinery
5. **Clean API pattern** - every API is delegation target for autonomous agents

---

## Dependencies

| Dependency | Why Needed | Can Start Without? |
|------------|------------|-------------------|
| Console API Exploration | Patterns for self-eval, boundary validation, schema-driven merge | No - provides foundation patterns |
| AVRO Schema and RPC | Schema validation infrastructure | Partial - can start with basic validation |

---

## Design References

- **DEV_ENVIRONMENT_DESIGN.md** - Core architecture
- **SELF_EVAL_DESIGN.md** - Self-evaluation system
- **API_DESIGN.md** - Boundary validation model, schema-driven property selection

---

## Expected Products

1. Self-eval requirements document
2. Console API formal requirements (first real API with method-level reqs + self-eval specs)
3. Dev Environment API implementation (5 methods)
4. Environment type definitions
5. Publishing workflow to spot
6. Deployment script generator
7. Bug report integration (if scope allows)

### Console API Requirements

The Console API from Project 07 needs formal requirements with self-eval specs:
- 5 wrapper methods: log, error, warn, info, debug
- Method-level requirements with self-eval types
- API-level invocation requirements (state shaping, defaults)
- Serves as template for future API requirements

---

## Success Criteria

1. Can create dev environment from specification
2. Can submit requirements with self-eval spec
3. Dev cycle runs autonomously until self-eval passes
4. Completed work publishes to appropriate spot
5. Environment can be resurrected from deployment script
6. Bug reports route through same workflow as new features

---

## Notes

- Emerged from Project 07 Console API exploration
- "Autonomy enables delegation" - this is the infrastructure that makes it work
- Pattern: "Dumb execution, smart definition"
- Consider: How does this interact with mycelium/data layer?

### Related Work

**AVRO Wrapper API:** Separate backlog item - SPL2 wrapper for avsc library. Could be done before or in parallel with this project. See backlog/avro-wrapper-api.md

---

**Created:** 2025-11-19
**Source:** Project 07 closure
