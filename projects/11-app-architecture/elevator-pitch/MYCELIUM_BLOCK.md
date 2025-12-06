# Mycelium

## The Physical Layer

```
Immutable containers + Mutable indexes
              │
    Mycelium web spidering (linking)
              │
    Data APIs on top (stream, transactional, document, mycelium-native)
```

**Immutable containers:** Content-addressable, P2P native
**Mutable indexes:** Local authority, P2P native
**No central orchestrator:** P2P native

The structure IS inherently P2P-shaped.

## Why P2P Fits

Not forced alignment - structural match:

| Mycelium pattern | P2P pattern |
|------------------|-------------|
| Immutable containers | Content-addressable |
| Mutable indexes | Local authority |
| No orchestrator | No central control |
| Entrypoint linking | Distributed discovery |

## A Thick Layer

Mycelium is substantial, not a thin abstraction:

- **Multiple data APIs:** Stream, transactional, document, mycelium-native
- **Logical structure:** Built with containers
- **Linking:** Web spidering through entrypoints
- **Still evolving:** Lots of work to be done

## Design Principles

- **Entrypoint linking** - not direct internal access
- **Self-contained contexts** - each knows what it contains
- **Spider pattern** - follow links, don't grep blindly
- **Local rules apply** - no global assumptions

## The Web

```
     entrypoint
         │
         ▼
    ┌─────────┐
    │ context │──────► next entrypoint
    │ (self-  │              │
    │  desc.) │              ▼
    └─────────┘         ┌─────────┐
                        │ context │──► ...
                        └─────────┘
```

Information flows like nutrients through mycelium - finds its way.

No central directory. Each node describes itself and links outward.

## Dual Penetration with Splectrum

Mycelium and Splectrum interpenetrate:
- Mycelium patterns map into Splectrum through data API equivalence
- Apps/API model provides the linkage
- Not separate layers - interwoven

## Integration Fabric

Mycelium enables integration:
- Self-contained units that link together
- Data + functionality in same container
- Web of connections, not isolated pieces
- AI navigates naturally (pattern-based)

## AI Navigation

Mycelium is AI-friendly:
- Pattern-based navigation
- Self-describing structures
- No need for global knowledge
- Follow entrypoints, discover as you go
