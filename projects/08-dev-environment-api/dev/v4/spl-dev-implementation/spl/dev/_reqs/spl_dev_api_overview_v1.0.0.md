**Type:** plain req
**Instance of:** api_overview

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

4. **`cycle({ single?, exit? })`** → `{ cycle, results, fluency, status }`
   - Run test cycle (return-and-resume)
   - single: Run single test vs all tests (default: false)
   - exit: Exit after cycle vs loop until 100% (default: false)

5. **`status({ silent?, save? })`** → `{ env, cycles, results, fluency, status }`
   - Report current state

6. **`extract({ destination? })`** → `{ package, meta, status }`
   - Extract completed module

7. **`destroy({ mode })`** → `{ archived?, published?, status }`
   - Clean up environment (mode: clean | preserve | publish)

**Usage patterns:**

See `spl_dev_api_v1.0.0.md` for API-level invocation, setup folder pattern, and state management.

**Structure:**

Methods under `spl/dev/`:
- Each method has `_reqs/`, `_schemas/`, `_tests/`, and `index.js`
- Self-contained work packages
- Portable (relative refs)

Scope: API overview.

Purpose: Public documentation - what the API is, what methods it provides.

## Self-eval

### Methods exist
- [ ] create/ folder exists
- [ ] install/ folder exists
- [ ] submit/ folder exists
- [ ] cycle/ folder exists
- [ ] status/ folder exists
- [ ] extract/ folder exists
- [ ] destroy/ folder exists

### Method entry points exist
- [ ] All method folders have README.md

### Signatures documented
- [ ] All methods listed with input → output signatures
- [ ] Optional parameters marked with ?

## Comments

This is the **public face** of the API - what users see, what help shows by default.

For invocation details, state management, and internal behavior, see `spl_dev_api_v1.0.0.md`.
