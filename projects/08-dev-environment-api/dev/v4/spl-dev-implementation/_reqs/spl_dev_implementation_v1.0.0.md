**Type:** plain req
**Instance of:** work_module_v1.0.0.md

# spl-dev-implementation

## Spec

Work module for implementing the spl/dev API - Dev Environment API for autonomous development with test-driven implementation.

**Purpose:** Implement Dev Environment API methods that enable AI to work autonomously on well-specified tasks with self-evaluation quality control.

**Scope:** Complete spl/dev API implementation
- Package: spl/
- API: spl/dev/
- Methods: create, install, submit, cycle, status, extract, destroy

**Structure:**
```
spl-dev-implementation/
├── README.md
├── _reqs/
│   ├── work_module_v1.0.0.md
│   ├── spl_dev_implementation_v1.0.0.md
│   └── _selfeval.json
└── spl/                   # Package
    ├── README.md
    └── dev/               # API
        ├── README.md
        └── [methods]/     # create, install, submit, etc.
```

**Entry points:**
- Each level (module, package, api, method) has README.md
- README.md points to _reqs/ for specifications

**Implementation approach:**
- Test-driven: Each method has _selfeval.json with test manifest
- Iterative: Implement methods one at a time
- Portable: Relative refs, can move/deploy anywhere

**Dependencies:**
- Base module (when available) for runtime support
- AVRO for schema validation

**State tracking:**
- _meta/ folder created during cycle execution
- Contains: status.json, cycle-log.json, fluency.json
- Enables resume and handoff

Scope: Work module instance.

Purpose: Define what this specific work module implements and its structure.

## Self-eval

### Structure verification
- [ ] README.md exists at module root
- [ ] _reqs/ folder exists
- [ ] _reqs/work_module_v1.0.0.md exists (type spec)
- [ ] _reqs/spl_dev_implementation_v1.0.0.md exists (this spec)
- [ ] _reqs/_selfeval.json exists (this self-eval)

### Entry points exist
- [ ] spl/README.md exists
- [ ] spl/dev/README.md exists

### Package structure
- [ ] spl/ folder exists (package)
- [ ] spl/dev/ folder exists (api)
- [ ] At least one method folder exists under spl/dev/

### Requirements chain
- [ ] Instance of work_module_v1.0.0.md
- [ ] References valid type spec

## Comments

This is the **instance specification** - what THIS specific work module is about.

The **type specification** (work_module_v1.0.0.md) defines what ANY work module must have.

Self-eval can use generic scripts with configuration:
- check-entry-points.js with paths config
- check-structure.js with expected folders
- Prerequisites can follow same pattern
