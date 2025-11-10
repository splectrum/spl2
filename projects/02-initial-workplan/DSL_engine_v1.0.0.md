# DSL Engine v1.0.0

**Created:** Project 02 (initial-workplan)
**Version:** 1.0.0
**Status:** Preliminary - will evolve through hands-on coding exploration

Extracted from PRINCIPLES_DETAILED.md for better organization.

---

## DSL Engine Details

**SPL2 Core as DSL Engine:**
- Platform for creating task-optimized languages
- Not a fixed-purpose system, but environment for building domain-specific languages
- Each task/domain gets specialized language tailored to its needs
- Core provides runtime/engine for executing these DSLs
- Languages can be created as needed for specific problems
- Focus on simple, focused languages for specific jobs
- Create layers of APIs that compose into optimal DSLs for problems

---

## AI as Primary User

**Design optimized for AI:**
- SPL2 is optimized for AI discovery and use, not human use
- AI creates higher-level solutions by composing DSLs from APIs
- Human provides requirements, AI builds DSLs to solve them
- All APIs designed for AI autonomy and discoverability

**Every API must provide:**
1. **High-quality help** - AI-optimized documentation (structured, parseable, complete)
2. **AVRO schemas** - All exposed data structures fully described
3. **Requirement test suites** - Tests that define behavior and contracts
4. **Discoverability metadata** - What it does, when to use it, how it composes

---

## Growing Library Structure

**Concept:**
- SPL2 generates library of explorations and production implementations
- Structured for AI to easily consult, reuse components, build new ones
- Each solution adds to library, making future work easier
- Context efficiency: don't rediscover solved problems
- Incremental growth: library gets smarter with each solution
- Quality through reuse: compose from tested, proven implementations

**Virtuous cycle:**
```
Problem → Explore → Build solution → Add to library → Library grows
                ↑                                            ↓
                └────────── Reuse for next problem ─────────┘
```

---

## Abstract Integration Patterns

**Philosophy:**
- Don't build specific integrations (MCP, REST, CLI, gRPC, etc.)
- Build abstract integration framework with protocol adapters
- AI composes integrations from patterns, not one-off implementations
- Learn once, apply everywhere
- Makes SPL2 infinitely extensible to any tool or protocol
- Focus on what tools do, not how to talk to them

**Example:**
Instead of: mcp-integration.js, rest-api-integration.js, cli-tool-integration.js...
Build: Generic integration framework → Protocol adapters → Tool implementations
