**Type:** plain req

# delegation

## Spec

Handing work to another agent for execution. Mindset shift from sole executor to orchestrator who chooses when to do vs delegate.

Scope: Work organization, AI operational mode.

### Prerequisites

Delegation requires:
- **Self-contained work module** - everything needed travels with the work
- **Local rules apply** - module is self-sufficient, no external dependencies for validation
- **Complete selfevals** - clear success criteria the executing agent can verify against

### The Unit of Delegation

Work module is the unit of handoff:
- Spec defines what to build
- Selfevals define done
- Schemas define contracts
- Any capable agent can execute

Trust through artifacts, not through knowing the agent.

### Operational Modes

AI operates in two complementary modes:

**Planning mode:** Organize, decompose, decide what to delegate vs do directly, coordinate parallel work

**Implementation mode:** Execute work directly within the fence (reqs + selfevals)

Orchestrating AI moves fluidly between these modes.

### Partnership Evolution

Delegation enables partnership scaling:

| Role | Focus |
|------|-------|
| Human + AI Partner | Architecture, pattern discovery, requirements, orchestration strategy, quality judgment |
| Delegated AI Agents | Implementation within complete work modules, execute to spec + selfevals |

Partner AI becomes technical lead: understands vision (collaboration), designs work packages (autonomy), delegates implementation (orchestration), reviews returned work, integrates and moves forward.

### Progression Path

1. **Collaboration** - Human + AI create work modules together
2. **Autonomy** - AI creates work modules independently (patterns established)
3. **Delegation** - AI hands implementation to other agents

The partner AI focuses on high-value collaborative work; routine implementation fans out to agents.

## Self-eval

- [ ] Work module is self-contained (spec, selfevals, schemas)
- [ ] Local rules apply (no external dependencies for validation)
- [ ] Handoff is complete (receiving agent has everything needed)
- [ ] Planning mode exercised (decomposition, delegation decisions)
- [ ] Evidence returned with completed work (_meta/)

## Comments

Emerged from Project 08 dev environment work. Infrastructure (work modules, executable selfevals, standalone packages) enables delegation. This stepping stone captures the mindset and organizational pattern.

Related: autonomy (individual execution within fence), collaboration (joint work), work module (unit of delegation), local rules apply (self-sufficiency principle).
