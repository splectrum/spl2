# Risks - Project 08: Dev Environment API

## Active Risks

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|----|------|------------|--------|------------|--------|
| R1 | Scope too large for single project | High | Medium | Defer bug report integration and parallel coordination if needed | Monitoring |
| R2 | AVRO dependency blocks progress | Medium | Medium | Use basic validation, note gaps for AVRO Wrapper API project | Monitoring |
| R3 | Self-eval complexity grows unbounded | Medium | High | Start with MVP types (logic, safety, qc), add others only when needed | Monitoring |
| R4 | Requirements format evolves mid-project | Medium | Low | Use local rules principle - new artifacts use new format | Monitoring |
| R5 | Glossary refs become inaccurate/incomplete | High | High | All refs must be relative to repo root; glossaries are the index - broken refs break navigation | Materialized - fixed at closure |

## Notes

- This is an exploration project - expect some risks to materialize and drive learning
- Key insight from Project 07: "Fail forward without fear" - failures are information
