**Type:** plain req

# chicken and egg

## Spec

Circular dependency where evolution is mandatory. Without evolution, infinite loop.

Pattern: X and Y need each other, so they co-evolve. Building one while using the other.

Common in HAICC: requirements, documentation, and execution emerge together rather than sequentially.

Scope: Global.

Purpose: Recognize circular dependencies as natural when evolution breaks the loop. Methodology emerges through practice.

## Self-eval

- [ ] Circular dependency identified
- [ ] Evolution happening (not stuck in loop)
- [ ] Co-evolution of related elements
- [ ] Progress despite apparent chicken-and-egg

## Comments

Example: This project - creating reqs for reqs, defining the template while using it. Each iteration improves both.
