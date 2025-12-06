// spl.mjs - Splectrum CLI entry point
//
// Creates record first thing, uses requireSpl to bind libs to record.
//
// Invocation modes:
//   1. Command:  spl spl/dev/cycle --name=env-123
//   2. Inline:   spl "/* */ await spl.dev.cycle({ name: 'env-123' })"
//   3. File:     spl ./workflow.js --env=prod
//   4. Library:  spl status

import { requireSpl } from './lib/moduleBootstrap.js'

// ============================================================================
// Create record first thing - all input captured
// ============================================================================

const record = {
  headers: {
    spl: {
      request: {
        timeReceived: Date.now(),
        input: null  // populated by parseArgs()
      },
      runtime: {
        nodeRoot: null,
        invokedFrom: process.cwd(),
        platform: { type: 'node' }
      }
    }
  },
  value: {
    argv: process.argv.slice(2),
    mode: null,
    resolvedPath: null,
    method: null,
    script: null,
    error: null
  }
}

// ============================================================================
// Process CLI state
// ============================================================================

const cli = await requireSpl('lib/spl/cli', record)
const spl = await requireSpl('lib/spl', record)

cli.resolveNode()
cli.detectMode()
cli.parseArgs()
if (cli.isExternalScriptFile()) cli.loadExternalScriptFile()

if (!cli.validate()) {
  spl.faf(cli.resolveErrorTopic(), { sync: true })
  cli.handleError()
}

// ============================================================================
// Transform to unified request based on mode
// ============================================================================

const mode = record.value.mode

switch (mode) {
  case 'command':
    record.headers.spl.request.method = record.value.method
    break
  case 'library':
    record.headers.spl.request.method = record.value.resolvedPath
    break
  case 'script':
    record.headers.spl.request.method = 'spl/script/inline'
    record.headers.spl.request.script = record.value.script ?? record.value.argv[0]
    break
}

// Clear CLI-specific state - request is now unified
record.value = null

// ============================================================================
// Route to app via spl/cli-static/execute
// ============================================================================

// Terminal routing: cli-static app handles terminal requests
const appHandler = await requireSpl('spl/cli-static/execute', record)
await appHandler.invoke()

// Output result
const metaoutput = record.headers.spl.request.metaoutput
const output = record.headers.spl.request.output
if (metaoutput) {
  console.log(metaoutput)
}
if (output) {
  console.log(JSON.stringify(output, null, 2))
}
