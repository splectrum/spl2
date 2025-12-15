# spl/script Type

**Status:** Active

## Purpose

Script API for executing JavaScript in splectrum context. Provides:
- Inline script execution
- Interactive REPL sessions
- Helper libraries for exploration/debugging
- Test script execution

## Type Definition

- **instantiates:** spl/api
- **children:** spl/method

## Planned Methods

| Method | Purpose | Status |
|--------|---------|--------|
| run | Execute a script file | Planned |
| repl | Start interactive session | Planned |
| test | Run test scripts with assertions | Planned |

## Libs

| Lib | Purpose | Status |
|-----|---------|--------|
| ai.js | Helper functions for AI exploration | Active |
| assert.js | Test assertions | Planned |

## Usage

```bash
# Inline script (current, works via cli detection of /* comment */)
spl '/* test */ module.output("hello")'

# With helper lib
spl '/* explore */
const ai = await module.require("lib/spl/script/ai.js")
module.output(ai.json(ai.stack("spl/container")))
'
```
