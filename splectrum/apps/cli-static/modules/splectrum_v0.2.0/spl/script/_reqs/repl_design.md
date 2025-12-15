# REPL Design

**Status:** Planned

## Purpose

Interactive scripting session that maintains state between commands. Enables exploratory debugging without `/* comment */` prefix each time.

## Architecture

Use file-based message passing (fits splectrum async patterns):

```
runtime/script/
  input/          # Commands written here
    001.js
    002.js
  output/         # Results written here
    001.json
    002.json
  session.json    # Session state
```

## Flow

1. **Start session:** `spl spl/script/repl` (runs in background)
2. **Send command:** Write script to `runtime/script/input/NNN.js`
3. **Execute:** REPL watches input, executes, writes to output
4. **Read result:** Read from `runtime/script/output/NNN.json`
5. **End session:** Send `exit` command or kill process

## Session State

Session can maintain:
- Variables defined across commands
- Loaded libs (cached)
- History
- Working container context

## Implementation Options

### Option A: File Watcher
- REPL process watches input folder
- New file triggers execution
- Simple, no special IPC needed

### Option B: Named Pipe
- Create named pipe for input
- More interactive feel
- Platform considerations (Node vs Bare)

### Option C: Stateful App
- Hook up as spl/script app
- Full app lifecycle
- Most powerful but more complex

## External Tool Support

This design also enables external tools to script splectrum:
- CI/CD pipelines
- IDE integrations
- Test harnesses
- Other AI agents

## Future: spl/script App

When hooked up as an app:
- Persistent session across CLI invocations
- Shared state
- Background workers
- WebSocket interface for real-time
