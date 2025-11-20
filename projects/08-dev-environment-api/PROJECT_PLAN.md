# Project Plan - Project 08: Dev Environment API

## Approach

**Iteration-based exploration** (like Project 07) with single twin pair focus.

## Twin Pair

| Implementation | Template |
|----------------|----------|
| Dev Environment with test harness + Dev Env API methods | Dev environment structure/pattern for future APIs |

## Final Deliverables

1. **Method req format** - spec + self-eval + ref to test code
2. **Dev environment** - fresh, self-contained workspace
3. **Test harness** - runs tests, exits on failure with guidance
4. **Iteration loop** - fix → rerun → repeat until 100% pass = done

## MVP Harness

- Runs test scripts in sequence
- Captures output (pass/guidance)
- Stops on first failure with advice
- Restarts from beginning after fix
- Reports 100% when all pass

## Test Structure

Each test is a script that:
- Sets up its own state
- Invokes code under test
- Succeeds (exits clean) or returns guidance

**Standard output:**
```javascript
{
  status: 'pass' | 'fail',
  category: 'impl' | 'qc' | ...,
  message: string,
  guidance: string | null
}
```

## Environment Structure (Initial)

```
dev-env/
├── package.json
├── run-tests.js          # Harness
├── src/                   # Code under test
├── tests/                 # Test scripts
│   ├── 01-create.js
│   ├── 02-submit.js
│   └── ...
└── schemas/               # AVRO schemas
```

## Guinea Pig

Dev Env API methods (create, submit, cycle, status, teardown) - built using the harness we're creating.

## Iterations

Iterate (v1, v2, v3...) to discover:
- What test output structure works
- How AVRO fits in
- What guidance format is useful
- Environment structure that makes sense

## Success Criteria

- Method req with self-eval can be defined
- Dev env can be created from scratch
- Test harness runs tests and reports failures
- Can iterate (fix → rerun) until 100% pass = implementation done

---

**Created:** 2025-11-19
