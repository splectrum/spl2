# Splectrum Node

**Type:** JS Package
**Platform:** Bare, Node.js

## Definition

Self-contained DSL engine entrypoint. Serves a repository through apps, modules, and scripts.

## Structure

| Folder | Type | Purpose |
|--------|------|---------|
| apps/ | visible | Application containers for client interaction |
| lib/ | visible | Exposed internal API libraries |
| modules/ | visible | Formal module bundles |
| runtime/ | visible | Session state for app execution |
| scripts/ | visible | Free scripts for exploration |
| docs/ | visible | Documentation |
| _reqs/ | auxiliary | Requirement specifications |
| node_modules/ | auxiliary | npm dependencies |

## Entry Point

`spl.mjs` - Routes requests to apps, scripts, or modules based on invocation mode.

## Characteristics

- Self-contained (has own docs, modules, dependencies)
- Location-aware (invokedFrom determines context)
- Dual-platform (Bare and Node.js compatible)
