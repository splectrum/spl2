// spl.mjs - Splectrum CLI entry point
//
// Creates record first thing, uses module interface for execution.
//
// Invocation modes:
//   1. Command:  spl spl/dev/cycle --name=env-123
//   2. Inline:   spl "/* */ await spl.dev.cycle({ name: 'env-123' })"
//   3. File:     spl ./workflow.js --env=prod
//   4. Library:  spl status

import { loadModule } from './lib/moduleBootstrap.js'
import process from 'process'

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
        platform: { type: 'node' }  // TODO: detect from process
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
// Load module (returns instantiated module, not lib)
// ============================================================================

const module = await loadModule('cli-static')

// Initialize platform modules (fs, path) and bind record
await module.init()
module.bindRecord(record)

// ============================================================================
// Process CLI state
// ============================================================================

// CLI lib is entrypoint infrastructure - receives module + raw record
const { create: createCli } = await import('./modules/bm_spl/spl/cli/_lib/cli.js')
const cli = await createCli(module, record)

cli.resolveNode()
cli.detectMode()
cli.parseArgs()
if (cli.isExternalScriptFile()) cli.loadExternalScriptFile()

if (!cli.validate()) {
  module.faf(cli.resolveErrorTopic(), { sync: true })
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
// Set up app context before routing
// ============================================================================

// Load app state and set on record
const appStateTopic = 'apps/cli-static/state'
const appState = module.consumeLatest(appStateTopic)
if (appState) {
  record.headers.spl['cli-static'] = appState.headers.spl['cli-static']
  record.headers.spl['cli-static-session'] = appState.headers.spl['cli-static-session']
  record.headers.spl.runtime.appAPI = 'spl/cli-static'
}

// ============================================================================
// Route to app via spl/cli-static/execute
// ============================================================================

// Terminal routing: cli-static app handles terminal requests
const appHandler = await module.require('spl/cli-static/execute')
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
