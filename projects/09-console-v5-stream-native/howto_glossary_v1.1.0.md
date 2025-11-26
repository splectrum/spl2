**Type:** plain req

# howto glossary

## Spec

Registry of procedures for executing work - goal-oriented action guidance.

**Entry point question:** "How do I do X?"

When you have a goal to accomplish (close a project, create a dev bundle, deploy an environment) - start here. Howtos are about action with intent, not understanding.

**Entry structure:** Term | Description | Req

**Spider pattern:**
1. Howto provides procedure outline
2. Procedure references stepping stones for concepts needed
3. Stepping stone leads to concept req (e.g., project type)
4. Concept req contains detailed steps and extends relationships
5. Follow extends chain to gather full procedure

**Example - "close project":**
1. Howto says: look up project type in stepping stones
2. Find `exploration project` in stepping stones glossary
3. Read exploration_project req → has closure steps + extends blank_project
4. Read blank_project req → has base closure steps
5. Merge: base steps + project type specifics (autonomous vs collaborative)
6. Execute with full context

**Contrast with stepping stones:**
- Howto: "How do I close a project?" (goal-oriented action)
- Stepping stones: "What is a project?" (understanding)

Howtos are minimal routers - they point to the right concepts, not duplicate them. The intelligence lives in the stepping stone reqs.

Scope: Global.

Purpose: Procedural entry point for common tasks. Action-oriented complement to stepping stones (concepts).

## Self-eval

- [ ] Three-column structure (Term, Description, Req)
- [ ] Procedures are goal-oriented (starts with intent)
- [ ] Spider pattern to stepping stones for concepts
- [ ] Minimal routing, not duplication
- [ ] References spot-local details where applicable (CIP-015)

## Comments

Evolved from v1.0.0 to clarify:
- Goal-oriented entry point (vs understanding-oriented stepping stones)
- Spider pattern: howto → stepping stones → concept reqs → extends chain
- Howtos as routers, not duplicators
