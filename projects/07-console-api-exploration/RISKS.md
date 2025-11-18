**Requirements:** ../05-foundation-update-documentation-templates/PRINCE2_operational_v1.2.0.md

# Project 07: Risk Register

---

## Active Risks

| ID | Risk | Impact | Likelihood | Mitigation | Status |
|----|------|--------|------------|------------|--------|
| R01 | AVRO integration complexity - validation might be too complex/heavyweight for bundle size | High | Low | Measure bundle size early, test in Bare, fall back to simpler validation if needed; AVRO already validated in product-poc | Open |
| R02 | Discovery API design unclear - not obvious how AI should query schemas | Medium | Medium | Try multiple approaches, measure friction, let evidence decide | Open |
| R03 | Pattern doesn't scale - works for console API but not for complex APIs | High | Low | Exploration project goal is to discover this; adjust pattern based on evidence | Open |
| R04 | CLI wrapper adds too much code - generic CLI parsing more complex than expected | Low | Low | Use minimist or similar (battle-tested, tiny), keep wrapper minimal | Open |

---

## Closed Risks

| ID | Risk | Resolution | Date |
|----|------|------------|------|

---

## Notes

- Risk register updated throughout project execution
- New risks added as discovered during exploration
- Likelihood/impact reassessed based on evidence

---

**Created:** 2025-11-18
**Last Updated:** 2025-11-18
