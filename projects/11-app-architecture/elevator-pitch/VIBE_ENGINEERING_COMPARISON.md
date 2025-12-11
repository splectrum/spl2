# Beyond "Vibe Engineering"

**Created:** 2025-12-11

## Background

"Vibe coding" was coined by Andrej Karpathy in February 2025 - fast, loose, prompt-driven development with no attention to how code actually works. [Simon Willison](https://simonwillison.net/2025/Oct/7/vibe-engineering/) proposed "vibe engineering" for the disciplined alternative: seasoned professionals using LLMs while staying accountable.

The industry is now shifting from vibe coding to **context engineering** - systematic management of how AI systems process context ([MIT Technology Review](https://www.technologyreview.com/2025/11/05/1127477/from-vibe-coding-to-context-engineering-2025-in-software-development/)).

## Industry State (Late 2025)

**Adoption:**
- 25% of Y Combinator Winter 2025 startups use nearly all AI-generated codebases
- Developers with 10+ years experience are 2.5x more likely to rely on AI for >50% of code
- Veteran developers report shipping 2.5x faster

**Key Tools:** GitHub Copilot, Claude Code, Cursor, Devin (autonomous software engineer)

**The Consensus View:**
- Vibe coding: good for prototypes, proofs-of-concept
- Production: requires "rigorous, specification-driven development" (Microsoft)
- Hybrid approach: AI for prototypes/UI, humans for critical systems/security

## Context Engineering - The New Focus

[Gartner](https://www.gartner.com/en/articles/context-engineering) defines it as: "designing and structuring the relevant data, workflows and environment so AI systems can understand intent, make better decisions and deliver contextual, enterprise-aligned outcomes."

**Three facets** (LangChain):
1. Instructional context - prompts, system instructions, examples
2. Knowledge context - domain info from external sources (RAG)
3. Tools context - environment data via tools/APIs

[Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): "The secret to building truly effective AI agents has less to do with the complexity of the code you write, and everything to do with the quality of the context you provide."

**Current solutions:** AGENTS.md files, nested rule files, MCP (Model Context Protocol) for tool integration.

## The Autonomy Spectrum (Industry View)

Research shows a [10-level spectrum](https://www.researchgate.net/figure/The-Spectrum-of-Human-and-AI-Collaboration-Levels_fig1_350207956):
- Level 1: No AI, human decides alone
- Level 2-3: AI offers alternatives, human decides
- ...through to...
- Level 10: Full AI autonomy

[IEEE Spectrum](https://spectrum.ieee.org/ai-for-coding): "While AI may become a 'real coder' in the near future, it probably won't gain software developers' complete trust as a team member."

**Key finding:** "Team performance was best when humans collaborated with an agent adjusting its autonomy based on the situation" - situational autonomy beats fixed levels.

## Comparison

| Vibe Engineering (Mainstream) | HAICC (Our Approach) |
|-------------------------------|----------------------|
| AI as Collaborator, Not Autopilot | Partnership model with friction metric |
| Verification-Driven Development | Selfevals embedded in type system |
| Structured Workflows | Type-driven tooling (selfeval, whoami inherit) |
| Relentless Knowledge Capture | Reqs as versioned immutables, mycelium web |
| Context Engineering | Type inheritance, overlay resolution |

## What We Add

### 1. The Expanding Spectrum

Vibe engineering is static (human directs, AI implements). We have dynamic growth:

```
◄── Expanding Creativeness       Increased Formal Implementation ──►
         Human+AI ─────── AI ─────── Agents
```

Shift left tackles new ground. Shift right formalises and delegates. Both ends grow.

### 2. Autonomy as Goal, Not Threat

- **Complete requirements = AI Autonomy** (it can work alone)
- **Incomplete requirements = Partnership** (we work together)

The human paradox: Be more creative by making yourself redundant.

### 3. Freestyle ↔ Formal Dualism

They position "vibe coding" as bad, "vibe engineering" as good. We embrace both:

- Scripting sea for exploration (freestyle)
- Crystallising into formal APIs (structure)
- Seamless transitions between modes

### 4. Type-Embedded Tooling

Their "structured workflows" are process-level checklists. Ours are in the type system:

- Every container inherits `selfeval` (validation)
- Every container inherits `whoami` (introspection)
- Types carry their own tooling down the chain

### 5. Self-Contained = Autonomy

They talk about "context engineering" as prompt crafting. We connect it to autonomy:

- Self-contained reqs enable AI to work without orchestration
- No central conductor - local rules, pattern-driven flow
- Complete spec = delegatable to agents

## The Positioning

Vibe engineering is **catching up to 2024 thinking**.

HAICC is **2025+ thinking** - where AI autonomy grows organically from formalization, and the human role evolves from implementer to enabler.

---

## Our USP - What Sets HAICC Apart

### 1. Dynamic Autonomy vs Static Roles

**Industry:** Fixed spectrum (Level 1-10), humans must choose a level. Best results from "situational autonomy" but no systematic way to achieve it.

**HAICC:** Autonomy emerges from formalization. Complete spec = AI autonomy. Incomplete = partnership. The system self-determines the appropriate level based on requirement completeness.

### 2. Embedded Tooling vs External Checklists

**Industry:** AGENTS.md, rule files, MCP servers - external configuration layered on top. Context is curated manually.

**HAICC:** Types carry tooling. Every container inherits `selfeval` (validation) and `whoami` (introspection) from its type chain. Tooling is structural, not configured.

### 3. Mycelium Context vs RAG/Vector Search

**Industry:** Context engineering relies on RAG (Retrieval-Augmented Generation). Documents are chunked into fragments (by token count or paragraph), embedded as vectors, then retrieved via similarity search. Problem: chunks are arbitrary boundaries that lose surrounding context. AI sees disconnected pieces, not coherent structure.

**HAICC:** Containers ARE the chunks - natural semantic boundaries (a method, a type, a req). Each container is self-describing (index.json) and links to related containers (extends, instantiates, spiders). Search returns complete, navigable units, not fragments. AI follows links like hyperlinks - context through structure, not retrieval guesswork.

### 4. Bi-Directional Growth vs One-Way Delegation

**Industry:** Human directs → AI implements. Efficiency gain is one-dimensional (faster implementation).

**HAICC:** Both ends grow. Shift-right formalizes work for agents. Shift-left frees capacity for new creative ground. Two-dimensional growth.

### 5. Freestyle ↔ Formal as Feature, Not Bug

**Industry:** Vibe coding = bad (prototypes only), vibe engineering = good (production). Binary choice.

**HAICC:** Freestyle scripting is exploration sea, formal APIs are crystallized islands. Both are valid modes with seamless transitions. The dualism is a feature.

## Where We're Positioned

```
                    HAICC Position
                         ↓
Vibe Coding ──────── Vibe Engineering ──────── [Beyond]
(ad-hoc)             (disciplined)            (autonomy-native)
     │                    │                        │
     │                    │                        │
  Prototyping       Context Engineering      Type-Embedded Tooling
  Fast iteration    RAG + Rules              Self-Describing Structure
  No accountability Human oversight          Autonomy from Completeness
```

**Industry is at:** Context Engineering (late 2025)
**We're building:** Autonomy-native systems where AI capability grows from structure, not configuration

---

## Sources

**Vibe Coding/Engineering:**
- [Simon Willison: Vibe Engineering](https://simonwillison.net/2025/Oct/7/vibe-engineering/)
- [MIT Technology Review: From vibe coding to context engineering](https://www.technologyreview.com/2025/11/05/1127477/from-vibe-coding-to-context-engineering-2025-in-software-development/)
- [IBM: What is Vibe Coding?](https://www.ibm.com/think/topics/vibe-coding)
- [Microsoft: Vibe coding and AI changes](https://news.microsoft.com/source/features/ai/vibe-coding-and-other-ways-ai-is-changing-who-can-build-apps-and-how/)

**Context Engineering:**
- [Gartner: Context Engineering](https://www.gartner.com/en/articles/context-engineering)
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Phil Schmid: The New Skill in AI is Context Engineering](https://www.philschmid.de/context-engineering)
- [Prompting Guide: Context Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide)

**AI Agents & Autonomy:**
- [IEEE Spectrum: Will Coding AI Tools Ever Reach Full Autonomy?](https://spectrum.ieee.org/ai-for-coding)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [GoCodeo: AI-Driven Software Development with Autonomous Agents](https://www.gocodeo.com/post/the-ai-driven-software-development-process-from-requirements-to-deployment-with-autonomous-agents)
- [ResearchGate: Spectrum of Human-AI Collaboration Levels](https://www.researchgate.net/figure/The-Spectrum-of-Human-and-AI-Collaboration-Levels_fig1_350207956)

**Agent Tooling:**
- [AGENTS.md](https://agents.md/)
- [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Pragmatic Engineer: How AI Software Engineering Agents Work](https://newsletter.pragmaticengineer.com/p/ai-coding-agents)
