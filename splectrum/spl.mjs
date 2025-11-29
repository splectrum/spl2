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
        timeReceived: Date.now()
      },
      runtime: {
        nodeRoot: null
      }
    }
  },
  value: {
    argv: process.argv.slice(2),
    cwd: process.cwd(),
    mode: null,
    resolvedPath: null,
    input: null,
    method: null,
    error: null
  }
}

// ============================================================================
// Process CLI state
// ============================================================================

const cli = requireSpl('lib/cli', record)

cli.resolveNode()

if (!cli.validate()) cli.handleError()

cli.detectMode()
cli.parseArgs()

// Test: show record after processing
console.log('=== CLI Record (after processing) ===')
console.log(JSON.stringify(record, null, 2))
