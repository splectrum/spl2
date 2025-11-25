# Session Restart Guide - Project 09

**Last Updated:** 2025-11-25 (Session 6)

---

## Current Status

**Project:** Console v5 Stream Native (Exploration)

**Phase:** Product Twin 1 - Building Blocks Exploration
**Stage:** Hello method complete with full dev env flow

---

## What's Working

**V0 Dev Environment:**
- `modules/` → `implementation/` → `environments/env-*` flow
- Lib resolution (symlinks + node_modules re-exports)
- Fire-and-forget event pattern (timestamped files)
- Hello method with self-eval

**Event Record Structure:**
```json
{
  "headers": {
    "spl": {
      "runtime": { "error": null, "timestamp": "..." },
      "request": { "guid": "...", "completed": false, "ttl": 5, "uri": "pr09/console/hello" }
    },
    "pr09": {
      "console": {
        "hello": { "message": "hello friend" }
      }
    }
  }
}
```

**Method Pattern:**
```javascript
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)
  console.log(spl.headers.pr09.console.hello.message)
  spl.complete()
}
```

---

## Quick Start

```bash
cd dev/v0
node deploy.js                    # Creates env instance
cd environments/env-{timestamp}
node submit.js                    # Submit request
node handler.js                   # Process request
```

---

## Key Files

**Dev env:**
- `dev/v0/deploy.js` - Creates environment instance
- `dev/v0/install/install.js` - Prepares implementation/
- `dev/v0/handler.js` - Dumb request handler
- `dev/v0/submit.js` - Test request submitter

**Source:**
- `dev/v0/modules/work_module/_lib/core.js` - Core lib (createSpl)
- `dev/v0/modules/work_module/pr09/console/hello/index.js` - Hello method
- `dev/v0/modules/work_module/pr09/console/hello/_reqs/` - Requirements + self-eval

**Design docs:**
- `LIB_RESOLUTION_PATTERN.md` - Lib resolution (3 layers)
- `TYPE_HIERARCHY_OVERLAY_DESIGN.md` - Type system architecture

---

## Session 6 Accomplishments

1. **Event record structure** - Kafka-compatible with spl.runtime/request namespaces
2. **Lib resolution pattern** - node_modules/lib → lib/ symlinks → _lib/ source
3. **Wrapper pattern** - createSpl(record) binds methods to record
4. **Dev env flow** - modules → install → implementation → deploy → environments
5. **Fire-and-forget** - Timestamped events with collision handling
6. **Hello method** - Complete with requirements and self-eval

---

## Next Steps

1. **Value/API state** - Implement batch processing with value payload
2. **Arithmetic method** - Multi-step method to test iteration loop
3. **Sandwich merge** - _return → value merge pattern
4. **More self-evals** - Cross-API access prevention

---

**Ready for handover:** Full hello method cycle working in deployed environment.
