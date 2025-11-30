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
import { handle as cliStaticHandle } from './apps/cli-static/spl.mjs'

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
// Hand off to cli-static app
// ============================================================================

await cliStaticHandle(record)
