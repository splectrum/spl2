# Risks Register - Project 09: Console v5 Stream Native

---

## Active Risks

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|----|------|------------|--------|------------|--------|
| R1 | Event metadata insufficient for reconstruction | Medium | High | Start with more metadata, discover minimum viable through use | Open |
| R2 | Self-evals too weak for "local rules apply" | Medium | Critical | Iterate until high confidence achieved, this is linchpin | Open |
| R3 | Free scripting feels constrained by events | Low | High | Keep "islands in sea" pattern, don't force structure | Open |
| R4 | Handler pattern more complex than expected | Low | Medium | Console is simple test case, complexity shows early | Open |
| R5 | Storage abstraction leaks (JSON files → Kafka gap) | Medium | Medium | Keep simple, note where Kafka would help | Open |
| R6 | Approach B doesn't deliver expected benefits | Low | High | Compare friction to Approach A experience, validate bet | Open |

---

## Risk Notes

**Critical bet:** Approach B (specialized handlers) will prove superior to Approach A (generic executor) experience. This project validates that bet.

**Linchpin:** High-confidence self-evals. If we can't achieve trustworthy local validation, Approach B falls back to Approach A friction.

---

## Closed Risks

None yet.
