**Requirements:** projects/08-dev-environment-api/exploration_project_v1.1.0.md
**Base Requirements:** projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md

# Project 08: Dev Environment API

## Project Type

**Exploration Project** - Architecture discovery for autonomous development infrastructure.

---

## Project Definition

### Purpose

Turn the dev environment patterns from Project 07 into a full infrastructure asset. Create the machinery that enables AI to work autonomously on well-specified tasks with self-evaluation quality control.

### Background

Project 07 (Console API Exploration) established:
- Self-eval types: logic, safety, qc
- Dev environment as API concept
- Deployment scripts for resurrection
- Autonomy through discipline pattern

This project formalizes those patterns into working infrastructure.

### Objectives

1. Define formal requirements for self-evaluation system
2. Create Console API formal requirements (first real API with self-eval specs)
3. Implement Dev Environment API (5 methods)
4. Define environment types for different work
5. Establish publishing workflow from dev env to spot
6. Generate deployment scripts for resurrection

### Scope

**In scope:**
- Self-eval requirements document
- Console API formal requirements (template for future APIs)
- Dev Environment API: create, submit, cycle, status, teardown
- Environment type definitions
- Publishing workflow to spot
- Deployment script generation

**Out of scope (may emerge as addons):**
- Bug report integration (may be too much for one project)
- Failure preprocessing
- Template system
- Parallel coordination

### Constraints and Assumptions

**Constraints:**
- AVRO schema validation not yet formalized (use basic validation initially)
- No runtime implementation yet - focus on API design and structure

**Assumptions:**
- Console API v7 from Project 07 is valid foundation
- Design docs from Project 07 are accurate starting point

---

## Products

### Twin Pair Structure

| Implementation | Pattern/Template |
|----------------|------------------|
| 1. Self-eval requirements doc | Self-eval spec template |
| 2. Console API formal requirements | API requirements template |
| 3. Dev Environment API implementation | Dev env structure template |
| 4. Environment type definitions | Environment type spec template |
| 5. Publishing workflow | Publishing workflow template |
| 6. Deployment script generator | Script generation template |

### Product Descriptions

#### Product 1: Self-eval Requirements Document

**Purpose:** Formal requirements for self-evaluation types, harness, method specifications

**Composition:**
- Self-eval type definitions (logic, safety, qc, etc.)
- Harness requirements
- Method self-eval specification format
- Report structure

**Quality criteria:**
- Can specify self-eval for any method
- Types are testable
- Harness requirements are implementable

#### Product 2: Console API Formal Requirements

**Purpose:** First real API with method-level requirements + self-eval specs

**Composition:**
- 5 wrapper methods: log, error, warn, info, debug
- Method-level requirements with self-eval types
- API-level invocation requirements
- Serves as template for future API requirements

**Quality criteria:**
- Each method has complete requirement spec
- Self-eval specs are executable
- Can assess method against requirements

#### Product 3: Dev Environment API Implementation

**Purpose:** Working implementation of dev environment management

**Composition:**
- create - Create new dev environment from spec
- submit - Submit a requirement to work on
- cycle - Run dev cycle until self-eval passes
- status - Check current state
- teardown - Clean up or preserve environment

**Quality criteria:**
- Methods follow API_DESIGN patterns
- Schema-driven inputs/outputs
- Self-eval integrated

#### Product 4: Environment Type Definitions

**Purpose:** Define purpose-specific environments

**Composition:**
- API development environment
- Bug fix environment
- Integration test environment
- Environment type spec format

**Quality criteria:**
- Types are distinct and useful
- Can match work type to environment type
- Environments are configurable

#### Product 5: Publishing Workflow

**Purpose:** How completed work graduates from dev env to spot

**Composition:**
- Spot determination rules
- Version management
- Integration validation
- Publishing process

**Quality criteria:**
- Clear path from dev env to spot
- Version relationships defined
- Integration points identified

#### Product 6: Deployment Script Generator

**Purpose:** Automated creation of resurrection scripts

**Composition:**
- Script generation logic
- Environment capture
- Dependency handling
- Validation on generation

**Quality criteria:**
- Scripts are standalone (single file creates everything)
- Scripts are reproducible
- Scripts capture complete environment

---

## Plan

### Stage 1: Foundation (Products 1-2)

**Focus:** Requirements foundation

1. Draft self-eval requirements document
2. Create Console API formal requirements
3. Validate format through self-assessment

### Stage 2: Implementation (Products 3-4)

**Focus:** Dev environment API

4. Implement create method
5. Implement submit method
6. Implement cycle method (with self-eval integration)
7. Implement status method
8. Implement teardown method
9. Define environment types

### Stage 3: Infrastructure (Products 5-6)

**Focus:** Publishing and resurrection

10. Design publishing workflow
11. Implement deployment script generator
12. End-to-end validation

---

## Success Criteria

1. Can create dev environment from specification
2. Can submit requirements with self-eval spec
3. Dev cycle runs autonomously until self-eval passes
4. Completed work publishes to appropriate spot
5. Environment can be resurrected from deployment script
6. Console API has formal requirements that serve as template

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope too large | High | Medium | Defer bug report integration if needed |
| AVRO dependency blocks | Medium | Medium | Use basic validation, note AVRO gaps |
| Self-eval complexity | Medium | High | Start with MVP types (logic, safety, qc) |

---

## Collaboration Mode

**COLLABORATIVE** per exploration project requirements.

- Planning decisions discussed together
- Architectural choices validated before committing
- Regular check-ins on direction
- Discovery documented in DAILY_LOG

---

## Notes

- "Autonomy enables delegation" - this is the foundation that makes it work
- "Dumb execution, smart definition" - the core pattern
- Every API is a potential delegation target for autonomous agents
