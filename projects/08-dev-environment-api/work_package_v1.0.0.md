**Type:** plain req

# work package

## Spec

Self-contained, portable module with everything needed for implementation.

Characteristics:
- Contains spec (what to build)
- Contains self-eval manifest (what to pass)
- Contains test scripts (how to verify)
- Contains schemas (input/output contracts)
- Contains stub implementation
- All refs relative to package root
- Can be dropped into dev env and implemented

Structure:
```
spl/dev/create/              # work package root
├── _req.md                  # Spec - natural language
├── _selfeval.json           # Test manifest - machine readable
├── _schemas/
│   ├── input.avsc
│   └── output.avsc
├── tests/
│   ├── create-status.js
│   ├── create-uuid.js
│   └── create-path.js
├── testdata/                # (optional)
│   └── ...
└── index.js                 # Implementation (stub to start)
```

**Entry point:** `_req.md` references `_selfeval.json`

**AI workflow:**
1. Read `_req.md` for spec
2. Extract `_selfeval.json` path
3. Run tests via harness
4. Implement until 100% pass

**Portability:**
- Package can be moved/deployed anywhere
- All internal refs stay valid (relative)
- Same structure for all method implementations

Scope: Module pattern.

Purpose: Enable handoff of well-specified work with quality control.

## Self-eval

- [ ] Contains `_req.md` with spec
- [ ] Contains `_selfeval.json` with test manifest
- [ ] Contains schemas (if applicable)
- [ ] Contains test scripts
- [ ] Contains stub implementation
- [ ] All refs relative to package root
- [ ] Can be dropped into dev env
- [ ] Self-contained (no external dependencies on structure)

## Comments

"Dumb execution, smart definition" - definition is complete, execution follows tests.

Work package is the unit of handoff for autonomous execution.
