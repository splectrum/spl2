# DSL Engine

## The Dualism

Seamless flow between two modes in the same environment:

- **Free scripting:** Exploration, prototyping, trying things - low friction
- **API formalism:** Structure, contracts, reliable usage - clear interfaces

Not separate tools - same environment, different modes.

## The Triangle

```
        Free Scripting
       (exploration, ad-hoc)
              ▲
             / \
            /   \
           /     \
          ▼       ▼
Stateless API ◄──► Stateful Apps
 (processing)      (persistence)
```

Three modes, seamless transitions:
- **Free scripting** - Quick, exploratory, functional
- **Stateless API** - Request/response, no persistence, pure processing
- **Stateful Apps** - Persistent state, lifecycle, managed context

Movement between modes as work matures.

## Vertical Structure

```
┌─────────────────────────────────────────┐
│        Logical Data Structures          │
│             (1:1 with API)              │
├─────────────────────────────────────────┤
│       Physical Data Structures          │
│         (1:many from logical)           │
├─────────────────────────────────────────┤
│             Inheritance                 │
│         (full lifecycle API)            │
├─────────────────────────────────────────┤
│          Dev Integration                │
│       (seamless - not bolted on)        │
├─────────────────────────────────────────┤
│          Migration Root                 │
│        (evolution path built in)        │
└─────────────────────────────────────────┘
```

- Logical structures map 1:1 to APIs
- Physical structures map 1:many from logical
- Inheritance with full lifecycle
- Dev seamlessly integrated
- Migration built in from the start

## Horizontal Coherence

DSL glossary/vocabulary ties it all together:
- Same terms, same meanings across domains
- Shared vocabulary enables AI understanding
- Horizontal coherence across vertical layers

## AI-First Design

Both modes serve AI:
- **Free scripting:** How AI naturally works - exploratory, functional, stateless
- **API formalism:** How AI reliably consumes - clear contracts, complete specs

AI is primary user. Platform shaped for AI consumption and implementation.
