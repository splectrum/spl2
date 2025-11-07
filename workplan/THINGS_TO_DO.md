# Things To Do

**Status:** Brain dump - no prioritization or ordering yet

## Evaluation & Research

- Evaluate prototype repository (React + AVRO + tooling choices)
- Review spl1 archive for lessons learned
- Review spl1 pipelining implementation specifically
- Explore Pear platform capabilities and constraints
- Explore Bare runtime compatibility requirements

## TDC Workflow & Templates (Foundation)

- Define TDC work item structure/format
- Create template for defining validation criteria
- Create template for validation results
- Design TDC workflow (create → execute → validate → capture learnings)
- Design template evolution process (how templates improve through use)
- Create template library structure
- Design tooling for creating/managing work items
- Design tooling for running validations
- Create templates for different artifact types (code, docs, architecture, etc.)

## Architecture & Design

- Design pipelining mechanism for DSL engine
- Design API discovery mechanism
- Design type-safe composition (AVRO schema validation)
- Design state-backed API pattern
- Design process lifecycle implementation
- Define Kafka-compatible record structure in code
- Design library structure for growing components (AI-consultable)
- Design API documentation format (AI-optimized)
- Design debugging approach for pipelines

## Claude's WOW Tooling (AI Efficiency)

**Discovery & Context:**
- Build search through past work/explorations
- Create API catalog with searchable capabilities
- Build schema browser (explore types, compatibility)
- Create pattern library (reusable solutions)
- Implement "show me similar problems we solved"

**Composition & Building:**
- Build schema compatibility checker (can I pipe A → B?)
- Create pipeline builder/validator
- Build quick prototyping environment
- Create template/skeleton generators

**Validation & Debugging:**
- Create quick test runners
- Build pipeline debugger
- Create schema validators
- Build failure explainers ("why did this fail?")

**Context Preservation:**
- Capture learnings from explorations
- Document decision history ("why did we choose X?")
- Document failed approaches ("we tried Y, didn't work because...")
- Build knowledge base that grows with each exploration

## Tooling Decisions

- Choose JS/Node testing framework
- Choose React component testing approach
- Choose Browser/E2E testing tools
- Choose build/bundling tools (Bare compatible)
- Choose linting and formatting tools
- Choose AVRO schema tooling for JavaScript
- Choose development environment setup

## Core Implementation

- Set up development environment
- Create project structure
- Set up testing framework
- Implement Kafka-compatible record format
- Implement AVRO schema integration
- Implement state-backed API pattern
- Implement process as state transition pattern
- Implement pipelining mechanism
- Create API discovery/registry system
- Implement growing library infrastructure (storage, indexing, retrieval)
- Create complete API example (with help, schemas, tests, metadata)
- Implement TDC validation framework
- Create validation results template/format

## Validation & Examples

- Create code exploration: minimal and complete
- Create code exploration: state transitions
- Create code exploration: API pipelining
- Create code exploration: TDC in practice
- Build minimal state-backed API example
- Build minimal DSL example
- Test Bare runtime compatibility

## P2P & Pear

- Set up Pear development environment
- Create minimal P2P example
- Explore P2P state synchronization
- Test React app in Pear runtime

## Home Automation Use Case

- Explore Home Assistant integration possibilities
- Design home automation DSL concept
- Identify first automation scenario to implement
- Design device integration abstraction

## Infrastructure

- Set up repository structure
- Set up CI/CD (if appropriate)
- Create development documentation
- Set up code quality tools

## Documentation

- Create getting started guide
- Document development workflow
- Create API documentation examples
- Create code exploration documentation template

## Storage & Persistence

- Design/choose storage implementation (filesystem, database, indexing)
- Implement storage backend for Kafka-compatible records
- Design data retention/cleanup strategy
- Design query/retrieval mechanisms
- Handle concurrent access/locking

## Metadata Capture Implementation

- Design HOW to capture the 6 items (initial state, code, input, output, logging, external deps)
- Implement capture mechanism/instrumentation
- Design immutability enforcement
- Handle external dependency tracking (references vs data)
- Automate capture where possible

## Streaming Infrastructure

- Implement actual streaming capabilities ("streaming at heart")
- Design stream processing patterns
- Handle stream state management
- Design backpressure/flow control
- Handle stream composition

## Error Handling & Resilience

- Design error handling strategy across system
- Implement error propagation in pipelines
- Design retry/recovery mechanisms
- Handle partial failures in state transitions
- Design failure capture in metadata

## Security & Privacy

- Design security model (especially for P2P home automation)
- Authentication/authorization approach
- Data encryption (at rest, in transit)
- Access control for P2P network
- Privacy preservation in metadata

## Deployment & Distribution

- Design deployment to Pear/Bare
- Packaging strategy
- Distribution/updates mechanism
- Environment configuration management
- Deployment validation

## Versioning & Migration

- Design API versioning strategy
- Design schema evolution/migration (AVRO support)
- Handle backward compatibility
- Version pipeline definitions
- Manage breaking changes

## Network & P2P Infrastructure

- Design P2P discovery mechanism
- Connection management
- Offline operation handling
- Network partition handling
- State synchronization across peers
- Conflict resolution

## Monitoring & Observability

- Design logging infrastructure
- Monitoring/metrics system
- Audit trail visualization
- Performance monitoring
- Debug trace capabilities

## MVP & Prioritization

- Define first "real" tooling to build
- Define MVP that delivers value
- Prioritize work items
- Define success criteria for MVP
- Plan exploration sequence

## Questions to Answer

- How do state-backed APIs work in practice?
- What's the right abstraction level for pipelining?
- How do we handle errors in pipelines?
- How does debugging work for DSL execution?
- How do we test DSL compositions?
- What does "API discovery" actually look like?
- How do AVRO schemas integrate with JS runtime?
