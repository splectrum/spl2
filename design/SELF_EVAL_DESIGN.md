# Self-Evaluation Design

**Location:** design/ spot - mutable design documentation
**Source:** Project 07 - Console API Exploration
**Current Version:** v0.1.0
**Last Updated:** 2025-11-19
**Status:** Active - capturing patterns from Project 07 exploration
**Changelog:** See SELF_EVAL_DESIGN_CHANGELOG.md

---

## Purpose

This document defines the architecture and design for SPL2's self-evaluation system - the quality control mechanism that enables autonomous development through disciplined verification.

---

## Core Concept

### Self-Eval as Autonomy Enabler

**Autonomy requires before availing:**
1. Requirements stated (what am I trying to achieve?)
2. Self-evaluation tools defined (how will I verify?)

**Then freedom is granted** - full internal access, no artificial constraints.

### "Dumb Execution, Smart Definition"

**Pattern:** Define the requirement well, let execution run autonomously.

- The self-eval specification IS the work definition
- Code until self-eval passes
- No manual verification needed
- Quality assured by specification

---

## Self-Eval Types

### Standard Categories

| Type | Purpose | When to Use |
|------|---------|-------------|
| **logic** | Business logic correctness | Always - core functionality |
| **safety** | Compliance (didn't modify runtime/execution) | Always - protect invariants |
| **qc** | Schema validation | Always - boundary compliance |
| **codingStandards** | Structure, naming, patterns | API development |
| **performance** | Timing, resource usage | Performance-critical code |
| **bugs** | Specific bug fix verification | Bug fix development |

### Type Specifications

#### logic

**Purpose:** Verify business logic produces correct results

**Checks:**
- Input → output transformations
- Edge cases handled
- Expected behavior matches requirements
- Data integrity maintained

**Example tests:**
```javascript
// Log method should output correct format
assert(output.includes('[LOG]'), 'Should have LOG prefix');
assert(result.logged === true, 'Should report logged');
assert(result.bytesOutput > 0, 'Should count bytes');
```

#### safety

**Purpose:** Verify method didn't modify protected state

**Checks:**
- Runtime not modified
- Execution context not modified
- Only allowed state sections updated

**Implementation:**
```javascript
// Snapshot before
const runtimeSnapshot = JSON.stringify(runtime);

// Execute method
const result = await method(ctx, input);

// Verify after
if (JSON.stringify(runtime) !== runtimeSnapshot) {
  report.fail('safety', 'runtime modified');
}
```

#### qc (Quality Control)

**Purpose:** Verify schema compliance at boundaries

**Checks:**
- Input validates against input schema
- Output validates against output schema
- State validates against state schema

**Implementation:**
```javascript
// Validate state against schema
const StateType = loadSchema('console-state.avsc');
StateType.clone(state, { wrapUnions: true });
report.pass('qc', 'state schema valid');
```

#### codingStandards

**Purpose:** Verify code follows established patterns

**Checks:**
- Naming conventions (method folders, underscore prefixes)
- File structure (index.js pattern)
- Comment format
- Export patterns

#### performance

**Purpose:** Verify timing and resource usage

**Checks:**
- Execution time within bounds
- Memory usage acceptable
- No resource leaks

#### bugs

**Purpose:** Verify specific bug fixes

**Checks:**
- Bug reproduction test
- Fix verification test
- Regression tests

---

## Self-Eval Harness

### Development Environment Integration

**Self-eval is not a separate test suite:**
- Development environment IS self-eval
- Triggered with specific checks
- Progressive: start with logic, add more as code matures

### Harness Structure

```javascript
function createExecution(runtime, options = {}) {
  const selfEval = options.selfEval ?? {};
  const report = createSelfEvalReport();

  // ... execution logic ...

  // Safety checks during invocation
  if (selfEval.safety) {
    // Snapshot, execute, compare
  }

  // QC at pipeline end
  function qualityControl() {
    if (selfEval.qc) {
      // Validate all state schemas
    }
  }

  return { invoke, qualityControl, printReport };
}
```

### Report Structure

```javascript
function createSelfEvalReport() {
  const results = [];

  function pass(category, message) {
    results.push({ status: 'pass', category, message });
  }

  function fail(category, message) {
    results.push({ status: 'fail', category, message });
  }

  function print() {
    // Output formatted report
    // Return true if all passed
  }

  return { pass, fail, print, results };
}
```

### Report Output

```
Self-Eval Report
================
✓ [safety] spl/console/log: runtime not modified
✓ [safety] spl/console/log: execution not modified
✓ [qc] spl/console state schema valid
✗ [logic] spl/console/log: expected JSON format

1 failure, 3 passed
```

---

## Method Requirements with Self-Eval

### Requirement Structure

**Every method requirement includes self-eval specification:**

```javascript
{
  name: 'log',
  description: 'Log a message to console output',
  input: 'log-input.avsc',
  output: 'log-output.avsc',
  selfEval: ['logic', 'safety', 'qc'],

  // Detailed self-eval specification
  selfEvalSpec: {
    logic: [
      { test: 'formats text output', expected: '[LOG] message' },
      { test: 'formats json output', expected: '{"level":"log",...}' },
      { test: 'counts bytes', expected: 'bytesOutput > 0' }
    ],
    safety: ['runtime', 'execution'],
    qc: ['input', 'output', 'state']
  }
}
```

### Self-Eval as Complete Work Specification

**The self-eval spec defines "done":**
- No ambiguity about requirements
- Executable verification
- Autonomous completion possible
- Quality assured by specification

---

## Development Workflow

### Single Development Routine

**Same workflow for all work types:**

| Work Type | Workflow |
|-----------|----------|
| New feature | Req defines self-eval → code until pass |
| Bug fix | Bug report → test added to self-eval → code until pass |
| Enhancement | Additional tests added → code until pass |

### Development Loop

```
1. Prime harness with req's self-eval content
2. Code
3. Trigger self-eval
4. Digest report
5. Fix issues
6. Repeat until all clear
7. Done
```

### Progressive Self-Eval

**Start simple, add complexity:**

1. **Initial:** `['logic']` - basic functionality
2. **Stable:** `['logic', 'safety']` - add compliance
3. **Complete:** `['logic', 'safety', 'qc']` - full validation
4. **Production:** Add `performance`, `codingStandards`

---

## Fail Forward Without Fear

### Best Effort Specification

**Req spec to self-eval is best effort:**
- Not expected to be perfect upfront
- Failures are information, not recrimination
- Each cycle improves understanding

### Convergent Development

```
Req spec → Self-eval → Dev → Integration testing → ...
              ↑                    |
              |____ bug reports ___↓
```

- Each cycle improves self-eval
- Each cycle fixes implementation
- Minimal but complete - stop when it works

---

## Autonomy Through Discipline

### Trust Through Verification

**Self-eval creates trust:**
- Requirements stated explicitly
- Verification automated
- Quality measurable
- Autonomy earned through discipline

### Expanding Autonomy

**Accurate self-evaluation expands autonomy over time:**
- Consistent pass rate → more autonomy granted
- Quality track record → trust established
- Discipline demonstrated → freedom increased

### Prerequisites for Autonomy

**Before granting autonomy:**
1. ✅ Requirements stated
2. ✅ Self-eval defined
3. ✅ Verification automated

**Then:** Full freedom to execute

---

## Boundary Validation Model

### Code Dangerously with External Safeguards

**Self-eval enables the "code dangerously" pattern:**

1. **Boundary IN:** Validate input at entry
2. **Internal:** No validation - pure business logic
3. **Boundary OUT:** Validate output at exit
4. **QC:** Full state validation at pipeline end

**Why this works:**
- Self-eval catches any violations
- Methods stay simple (no defensive code)
- Trust the writer, verify the output

---

## Integration Points

### Dev Environment

**Self-eval drives dev environment cycles:**
```javascript
await invoke('spl/dev/cycle');  // Runs until self-eval passes
```

See DEV_ENVIRONMENT_DESIGN.md for complete dev environment architecture.

### Bug Reports

**Failed self-eval generates bug reports:**
- Failure details captured
- Context preserved
- Advisory generated
- Routes to bug fix cycle

See future EXECUTION_DESIGN.md for bug fix loop architecture.

### Requirements Documents

**Requirements include self-eval specs:**
- Executable requirements
- No separate test artifacts needed
- Single source of truth

---

## Implementation Notes

### MVP Scope

**For initial implementation:**
- logic, safety, qc types
- Basic harness integration
- Report generation
- Schema validation

**Defer:**
- codingStandards automation
- performance benchmarking
- Bug report generation
- Advisory system

### Dependencies

- AVRO schema validation
- Execution context (for safety checks)
- Report formatting

---

## Related Documents

- **DEV_ENVIRONMENT_DESIGN.md** - Dev environment integration
- **API_DESIGN.md** - Boundary validation model
- **EXECUTION_DESIGN.md** (future) - Bug reports, failure preprocessing

---

## Version History

- **v0.1.0** (2025-11-19): Initial design document capturing self-eval architecture from Project 07 exploration. Self-eval types, harness structure, method requirements, autonomy pattern.

---

## Notes

This is a **living document** - it evolves as we implement and learn.

**Current status:** Design capture from Project 07 exploration.

**Next steps:** Implement self-eval harness in dev environment API.
