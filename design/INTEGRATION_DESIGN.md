# Integration Architecture Design

**Purpose:** Design for splectrum node integration layers - external services, P2P network, inter-node communication
**Status:** Draft (exploratory)
**Created:** 2025-12-16

---

## Architecture Layers

Splectrum operates across three integration layers:

```
┌─────────────────────────────────────┐
│           EXTERNAL                  │  ← MCP (non-P2P services, tools)
├─────────────────────────────────────┤
│         NETWORK / P2P               │  ← Holepunch / Pear
├─────────────────────────────────────┤
│          NODE CORE                  │  ← Native SPL (containers, types, work modules)
└─────────────────────────────────────┘
```

| Layer | Technology | Integration Approach |
|-------|-----------|---------------------|
| External | MCP | AI agent management (config/permissions) |
| P2P transport | Pear/Hyperswarm | Wrapper → native over time |
| Inter-node RPC | AVRO | Schema-aligned with SPL types |

---

## Layer 1: Node Core (Native SPL)

The foundation layer - splectrum containers, types, work modules, solutions.

- Full SPL semantics
- Type chains and inheritance
- Introspection (whoami, selfeval)
- Schema-driven operations

This layer is splectrum-native and requires no external integration.

---

## Layer 2: P2P Network (Holepunch/Pear)

**Technology:** Holepunch stack (Hyperswarm, Hypercore, Hyperdrive) via Pear runtime

**Integration approach:** Start with wrapper, evolve to native as patterns emerge.

### Why Pear
- Purpose-built for P2P applications
- Handles NAT traversal, DHT, peer discovery
- Hypercore for append-only data structures
- Battle-tested distributed systems primitives

### Wrapper-First Strategy
- Learn Pear's API through usage
- Discover what patterns solutions actually need
- Identify friction points and natural abstractions
- Inform decisions about native integration later

### Inter-Node Communication: AVRO RPC

Stack for node-to-node communication:

```
┌─────────────────────────────────────┐
│         SPL operations              │  ← Container ops, work modules
├─────────────────────────────────────┤
│           AVRO RPC                  │  ← Serialization, method calls
├─────────────────────────────────────┤
│         Hyperswarm                  │  ← P2P transport (Pear)
└─────────────────────────────────────┘
```

**Why AVRO:**
- Schema-defined - aligns with SPL's type system
- Binary format - efficient over P2P
- Schema evolution - handles version drift between nodes
- SPL types can map to AVRO schemas - type definitions become the contract

---

## Layer 3: External (MCP)

**Technology:** Model Context Protocol (MCP)

**Role:** Integration with non-P2P external services - APIs, databases, filesystems, third-party tools.

### MCP as AI Agent Management

Key insight: MCP is for AI invocation, not programmatic code invocation. The AI decides what to call, when, with what arguments.

```
┌──────────────┐     MCP calls      ┌─────────────────┐
│     AI       │ ──────────────────→│   MCP Servers   │
│   (Claude)   │                    │   (external)    │
└──────────────┘                    └─────────────────┘
       │
       │ spl commands
       ▼
┌──────────────┐
│  SPL / Node  │
└──────────────┘
```

### SPL's Role with MCP

SPL doesn't integrate MCP as a coding API - it manages MCP as part of governing what AI agents can do:

- **Configuration:** What MCP servers exist, how to connect
- **Permissions:** What's allowed in this context (solution-scoped, container-level grants)
- **Lifecycle:** Start/stop servers if needed
- **Registry:** Discovery of available capabilities
- **Audit:** What accessed what, when

**Philosophy:** MCP handles "how to talk to things", SPL handles "who's allowed to talk to what".

### Integration Approach: Thin First

Start thin, add abstraction only as patterns emerge:
- SPL manages config/permissions (governance layer)
- MCP protocol remains the contract
- If patterns emerge (every solution needs X the same way), abstraction can grow organically

---

## Dev/Ops Pattern: Repo Node as Control Plane

A key workflow pattern: local "repo" splectrum node manages P2P nodes on Pear.

```
┌─────────────────────────────────────────────────────────┐
│                 Local repo node                         │
│              (dev / management)                         │
│                                                         │
│   • Author containers/solutions                         │
│   • Build for Pear                                      │
│   • Deploy to Pear network                              │
│   • Manage running nodes                                │
│   • Monitor, debug                                      │
└───────────────────────┬─────────────────────────────────┘
                        │ AVRO RPC / Hyperswarm
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Pear node(s)                           │
│                (P2P runtime)                            │
│                                                         │
│   • Running solutions                                   │
│   • Peer communication                                  │
│   • Distributed state                                   │
└─────────────────────────────────────────────────────────┘
```

### Lifecycle Commands (via Pear wrapper)

- `spl pear/build` - Package solution for Pear
- `spl pear/deploy` - Push to Pear network
- `spl pear/run` - Start a node
- `spl pear/status` - Check running nodes
- `spl pear/connect` - REPL/management session

The wrapper grows into a full lifecycle tool: build, ship, run, manage - all from the repo node.

---

## Design Principles

### Separation of Concerns

- **Core:** Splectrum-native, full semantics
- **P2P:** Splectrum-to-splectrum, optimized for distributed containers
- **External:** Escape hatch to non-P2P world, governed access

### Start Thin, Grow Organically

Both Pear and MCP integrations start as thin wrappers:
- Learn through usage
- Let patterns emerge from real needs
- Add abstraction only when proven valuable
- Avoid premature framework building

### Schema Alignment

SPL's type system flows through all layers:
- Container types define structure
- AVRO schemas encode types for P2P
- MCP tools operate within type boundaries

---

## Related

- **TOOLS_PRODUCT_SET.md** - Pear wrapper in tools wishlist
- **API_DESIGN.md** - SPL type system, method signatures
- **Holepunch:** https://holepunch.to/
- **Pear:** https://pears.com/
- **MCP:** https://modelcontextprotocol.io/
