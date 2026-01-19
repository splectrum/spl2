# Project 13: Project Plan

**Created:** 2025-12-15

---

## Target

**Release:** v0.2.0 (minor version - new features, backwards compatible)

---

## Twin Pairs

### Twin Pair 1: Tool Coverage

**Implementation:**
- Tier 1 (Core): docker, pear, ssh
- Tier 2 (Productivity): ffmpeg, gh, rsync
- Already done: git, 7zip

**Postponed to future project:**
- Tier 3 (Sysadmin): apt, systemctl, ps, kill, mount, iptables, useradd, cron, journalctl
- Tier 4 (Niche): npm, pandoc, imagemagick, make
- Scripting libraries (fs, http, data, etc.)

**Template:**
- Tool coverage requirements / patterns discovered

### Twin Pair 2: Request/Response Capture

**Implementation:**
- Formalize faf/event gathering (proper request/response records)
- Should not be a big effort - infrastructure partially exists

**Template:**
- Request/response capture pattern

### Twin Pair 3: Release Doc Generator

**Status: POSTPONED** - moved to next project

**Implementation:**
- Tool to generate documentation and analysis from releases
- Run against v0.1.0 to validate

**Template:**
- Release documentation requirements

---

## Approach

- Twin Pair 1 (tool coverage): Implement Tier 1 + Tier 2 wrappers
- Twin Pair 2 (request/response): Formalize faf history tracking
- Twin Pair 3: Postponed to next project

---

## Out of Scope

- Session integration / CLAUDE.md workflow updates (app territory - next project)
- Tier 3/4 tool wrappers (sysadmin, niche)
- Scripting libraries (future polish)
