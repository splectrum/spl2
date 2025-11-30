# Project Risks

## Active Risks

### R01: Migration Breaks Working System
**Likelihood:** Medium
**Impact:** High
**Mitigation:** Incremental migration, keep old paths working until new ones proven. Don't remove old infrastructure until replacement validated.

### R02: Complexity Creep in App Pattern
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:** Start simple. Underscore convention for system apps. Flat structure. Evolve only when needed.

### R03: Routing Ambiguity
**Likelihood:** Low
**Impact:** Medium
**Mitigation:** Clear conventions - spot name = app name. Underscore = system. Walk up to find spot root.

### R04: Scope Expansion
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:** Focus on core apps (_cli, _dev, _ops) and one spot app (projects). _boot and other spots are future work.

### R05: Performance Impact
**Likelihood:** Low
**Impact:** Low
**Mitigation:** Routing is simple path detection. No complex registry lookups.

## Risk Log

| Risk | Status | Notes |
|------|--------|-------|
| R01 | Active | - |
| R02 | Active | - |
| R03 | Active | - |
| R04 | Active | - |
| R05 | Active | - |
