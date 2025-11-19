# Dev Environment Design

**Location:** design/ spot - mutable design documentation
**Source:** Project 07 - Console API Exploration
**Current Version:** v0.1.0
**Last Updated:** 2025-11-19
**Status:** Active - capturing patterns from Project 07 exploration
**Changelog:** See DEV_ENVIRONMENT_DESIGN_CHANGELOG.md

---

## Purpose

This document defines the architecture and design for SPL2 development environments - self-contained units for autonomous code development with requirement-driven workflows.

---

## Core Concept

### Dev Environment as API

**The dev environment is itself an API** with management methods for autonomous development.

**Proposed structure:**
```
spl/dev/
  create/      # Create new dev environment from spec
  submit/      # Submit a requirement to work on
  cycle/       # Run a dev cycle (code until self-eval passes)
  status/      # Check current state
  teardown/    # Clean up environment
```

### Key Properties

1. **Self-contained unit** - everything needed in one place
2. **Requirement-driven development** - work starts with requirements
3. **Autonomous execution** - code until self-eval passes
4. **Immutable artifacts** - when done, environment becomes immutable
5. **AI-primary invocation** - designed for AI orchestration
6. **Deployment scripts enable resurrection** - can recreate environment anywhere

---

## Workflow

### Basic Development Cycle

```javascript
// Create environment
await invoke('spl/dev/create', {
  name: 'console-v8',
  dependencies: ['avsc']
});

// Submit requirement
await invoke('spl/dev/submit', {
  method: 'spl/console/clear',
  schema: { /* input schema */ },
  selfEval: ['logic', 'safety', 'qc']
});

// Run dev cycle - autonomous until green
await invoke('spl/dev/cycle');

// Teardown or keep as immutable artifact
await invoke('spl/dev/teardown', { preserve: true });
```

### Development Loop

1. Prime harness with requirement's self-eval content
2. Code
3. Trigger self-eval
4. Digest report
5. Fix issues
6. Repeat until all clear
7. Done

**"Dumb execution, smart definition"** - define the requirement well, let the dev cycle run autonomously.

---

## Teardown Approach

### Fresh Environment Each Cycle

**Pattern:** Each dev cycle creates a fresh environment from scratch.

**Rationale:**
- Changing shared code breaks previous iterations
- Self-contained environments are immutable artifacts
- Deployment scripts enable resurrection anywhere
- No accumulated state or cruft

### Deployment Scripts

**A deployment script creates the entire environment:**

```bash
#!/bin/bash
# v7-deploy.sh - Deploy Console API v7 dev environment

# Create directory structure
mkdir -p "$V7_DIR/modules/spl/console"/{log,error,warn,info,debug,_schemas}

# Write package.json
cat > "$V7_DIR/package.json" << 'EOF'
{
  "name": "console-api-v7",
  "version": "7.0.0",
  "type": "module",
  "dependencies": { "avsc": "^5.7.7" }
}
EOF

# Write all source files...
# Write all schemas...

# Install dependencies
npm install
```

**Benefits:**
- Truly standalone - single script creates everything
- Reproducible - run anywhere, get same result
- Version controlled - script IS the artifact
- Self-documenting - script shows exactly what's in environment

### Immutable Artifacts

**When dev cycle completes:**
- Environment becomes immutable
- Can be archived, referenced, or resurrected
- New work = new environment (not modify existing)
- Each version is a distinct artifact

---

## Environment Structure

### Self-Contained Layout

```
v7/
├── package.json           # Dependencies
├── run.js                 # Execution harness
└── modules/
    └── spl/
        └── console/
            ├── log/
            │   └── index.js
            ├── error/
            │   └── index.js
            └── _schemas/
                ├── log-input.avsc
                └── console-state.avsc
```

**Everything inside the environment:**
- Source code
- Schemas
- Execution harness
- Dependencies
- No external references

### Execution Harness

**The harness provides:**
- Runtime creation
- Execution context management
- Method invocation
- Self-eval coordination
- Report generation

---

## API Method Specifications

### create

**Purpose:** Create new dev environment from specification

**Input:**
```javascript
{
  name: 'console-v8',           // Environment name
  dependencies: ['avsc'],        // npm dependencies
  template: 'api-wrapper',       // Optional template
  baseEnv: 'console-v7'          // Optional: extend from existing
}
```

**Output:**
```javascript
{
  envId: 'uuid',
  path: '/path/to/env',
  status: 'created'
}
```

### submit

**Purpose:** Submit a requirement to work on

**Input:**
```javascript
{
  method: 'spl/console/clear',
  inputSchema: { /* AVRO schema */ },
  outputSchema: { /* AVRO schema */ },
  selfEval: ['logic', 'safety', 'qc'],
  description: 'Clear console output'
}
```

**Output:**
```javascript
{
  reqId: 'uuid',
  status: 'submitted',
  selfEvalSpec: { /* expanded spec */ }
}
```

### cycle

**Purpose:** Run a dev cycle until self-eval passes

**Input:**
```javascript
{
  maxIterations: 10,            // Limit retries
  autoFix: true,                // Attempt auto-fixes
  verbose: true                 // Detailed output
}
```

**Output:**
```javascript
{
  status: 'passed' | 'failed',
  iterations: 3,
  report: { /* self-eval results */ },
  artifacts: ['log/index.js']
}
```

### status

**Purpose:** Check current environment state

**Output:**
```javascript
{
  envId: 'uuid',
  name: 'console-v8',
  status: 'in_progress' | 'complete' | 'failed',
  requirements: [{ /* submitted reqs */ }],
  lastCycle: { /* cycle results */ }
}
```

### teardown

**Purpose:** Clean up or preserve environment

**Input:**
```javascript
{
  preserve: true,               // Keep as immutable artifact
  generateScript: true          // Create deployment script
}
```

**Output:**
```javascript
{
  status: 'preserved' | 'destroyed',
  artifactPath: '/path/to/v7',
  deployScript: '/path/to/v7-deploy.sh'
}
```

---

## Autonomy and Delegation

### Autonomy Enables Delegation

**Key insight:** Autonomy isn't just about working independently - it's the authority to spawn sub-work.

**What autonomy grants:**
- Freedom to execute without approval
- Authority to delegate/spawn sub-work
- Responsibility for coordination
- Accountability for outcome

**Without autonomy:** Must ask permission for each sub-task
**With autonomy:** Can orchestrate a swarm of work

### Delegation Pattern

```
AI receives requirement with autonomy grant
    ↓
Breaks down into sub-requirements
    ↓
Delegates to other agents/dev environments
    ↓
Coordinates results
    ↓
Delivers composite outcome
```

### Parallel Development

```javascript
// AI with autonomy receives complex requirement
// Autonomously decides to parallelize:

await Promise.all([
  invoke('spl/dev/create', { name: 'feature-a' }),
  invoke('spl/dev/create', { name: 'feature-b' }),
  invoke('spl/dev/create', { name: 'integration-tests' })
]);

// Submits sub-requirements to each
// Runs dev cycles in parallel
// Merges results
// Delivers composite outcome
```

### Why Clean APIs Matter

**The OCD about API design pays off:**
- APIs become the interface for AI orchestration
- Clean method signatures enable composition
- State management enables coordination
- Self-eval enables autonomous quality control
- The dev environment itself is an API that can invoke other APIs

**Every API is a potential delegation target for autonomous agents.**

---

## Integration with Self-Eval

### Requirement Structure

**Requirements include self-eval specification:**
```javascript
{
  name: 'log',
  input: 'log-input.avsc',
  output: 'log-output.avsc',
  selfEval: ['logic', 'safety', 'qc']
}
```

### Self-Eval as Gate

**Dev cycle continues until self-eval passes:**
- Self-eval defines "done"
- No manual verification needed
- Autonomous completion
- Quality assured by specification

See SELF_EVAL_DESIGN.md for complete self-eval architecture.

---

## Future: Bug Fix Integration

### Bug Reports as Requirements

**A bug report IS a requirement:**
- What's broken (spec violation)
- Self-eval to verify fix
- Context (code location, expected behavior)
- Preprocessed advice (instructions)

**Same workflow:**
```javascript
await invoke('spl/dev/submit', {
  type: 'bugfix',
  bugReport: { /* bug report structure */ },
  selfEval: ['bugs', 'logic', 'qc']
});

await invoke('spl/dev/cycle');
```

### Convergent Development

**Errors feed back into the same machinery:**
```
Dev cycle fails
    ↓
Bug report generated
    ↓
Route to new dev environment
    ↓
AI agent codes fix
    ↓
Self-eval runs
    ↓
Pass → merge / Fail → escalate
```

See future EXECUTION_DESIGN.md for complete bug fix loop architecture.

---

## Implementation Notes

### MVP Scope

**For initial implementation:**
- create, submit, cycle methods
- Basic deployment script generation
- Self-eval integration
- Single requirement per cycle

**Defer:**
- Parallel development coordination
- Bug report routing
- Auto-fix capabilities
- Template system

### Dependencies

- Self-eval harness (SELF_EVAL_DESIGN.md)
- Schema validation (AVRO)
- Execution context (runtime management)

---

## Related Documents

- **SELF_EVAL_DESIGN.md** - Self-evaluation architecture
- **API_DESIGN.md** - General API architecture
- **EXECUTION_DESIGN.md** (future) - Bug fix loop, error handling

---

## Version History

- **v0.1.0** (2025-11-19): Initial design document capturing dev environment as API concept from Project 07 exploration. Teardown approach, deployment scripts, autonomy/delegation patterns.

---

## Notes

This is a **living document** - it evolves as we implement and learn.

**Current status:** Design capture from Project 07 exploration.

**Next steps:** Create backlog item for Dev Environment API implementation.
