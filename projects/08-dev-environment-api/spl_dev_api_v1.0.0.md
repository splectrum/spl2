**Type:** plain req

# spl/dev API

## Spec

API for autonomous development with test-driven implementation. Manages ephemeral dev environments and work package execution.

**Purpose:** Enable AI to implement well-specified work packages with self-evaluation quality control.

**Methods:**

1. **`create({ name })`** → `{ envId, path, status }`
   - Create dev environment shell

2. **`install({ packages?, reset? })`** → `{ installed, base, status }`
   - Install base packages into environment

3. **`submit({ workPackage, reset? })`** → `{ overlay, dependencies, status }`
   - Submit work package to overlay

4. **`cycle({ single? })`** → `{ cycle, results, fluency, status }`
   - Run test cycle (return-and-resume)

5. **`status({ silent?, save? })`** → `{ env, cycles, results, fluency, status }`
   - Report current state

6. **`extract({ destination? })`** → `{ package, meta, status }`
   - Extract completed module

7. **`destroy({ mode })`** → `{ archived?, published?, status }`
   - Clean up environment (mode: clean | preserve | publish)

**API-level invocation:**
```javascript
// Full cycle (recommended for AI delegation)
invoke('spl/dev', {
  setup: './setup',
  workPackage: 'spl-dev-install'
});
// Handles: create → install → submit → cycle → extract → destroy

// Set defaults
invoke('spl/dev', { verbosity: 'debug' });

// Batch operations
invoke('spl/dev', {
  batch: [
    ['create', { name: 'my-env' }],
    ['install', { packages: 'standard' }],
    ['submit', { workPackage: './work/pkg' }]
  ]
});
```

**Setup folder pattern:**
```
setup/
├── base-modules/          # Packages for installation
├── work-packages/         # Input queue (pristine specs)
└── completed-modules/     # Output (evolved with impl + meta)
```

**State management:**
- State lives in memory during API execution
- Syncs to work package _meta/ at prompt points and completion
- Enables resume after session break
- Enables handoff between agents

**Dev environment structure:**
```
/tmp/dev-env/{name}/
└── modules/
    ├── base/              # Layer 0 (install)
    ├── {work-name}/       # Layer 1+ (submit)
    │   ├── _meta/         # State tracking
    │   └── [work package] # Implementation
    └── _index.json        # Layer order
```

**Characteristics:**
- Ephemeral dev environments (created, used, destroyed)
- Setup folder accumulates completed work
- Work packages are portable (relative refs)
- Self-contained execution (no external dependencies)
- Test-driven (cycle until 100% pass)
- Evidence captured (fluency, cycle log, dependencies)

**Help system:**
```javascript
invoke('spl/dev/help')                       // Method list (public)
invoke('spl/dev/help', { method: 'cycle' })  // Method detail
invoke('spl/dev/help', { all: true })        // Include internal
```

Scope: API.

Purpose: Infrastructure for autonomous development with quality control.

## Self-eval

- [ ] All methods listed with signatures (input → output)
- [ ] Method purposes are clear (one-liner)
- [ ] Input signatures match method implementations
- [ ] Output signatures match method implementations
- [ ] Optional parameters marked with ?
- [ ] API-level invocation patterns defined
- [ ] Setup folder pattern documented
- [ ] State management specified
- [ ] Dev environment structure defined
- [ ] Help system integrated
- [ ] Overview is immediately usable (can call methods from this doc)

## Comments

"Dumb execution, smart definition" - work packages define everything, API executes autonomously.

Perfect for AI delegation: hand agent setup folder + work package name, get back completed module with evidence.

Publish (moving completed modules to real codebase) is separate concern, not part of dev cycle.
