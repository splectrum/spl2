// spl/dev/cycle - Run prepare + test in sequence
//
// Convenience method for the common development workflow:
// 1. Rebuild hierarchy.json (prepare)
// 2. Run all selfevals (test)

import { createSpl } from 'lib/core.js'
import { handle as prepareHandle } from '../prepare/index.js'
import { handle as testHandle } from '../test/index.js'

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.dev.cycle || {}

  // Initialize sub-method headers if not present
  if (!spl.headers.spl.dev.prepare) {
    spl.headers.spl.dev.prepare = {}
  }
  if (!spl.headers.spl.dev.test) {
    spl.headers.spl.dev.test = {}
  }

  // Pass through environment name if specified
  if (input.name) {
    spl.headers.spl.dev.prepare.name = input.name
    spl.headers.spl.dev.test.name = input.name
  }

  // Pass through continueOnFailure if specified
  if (input.continueOnFailure) {
    spl.headers.spl.dev.test.continueOnFailure = input.continueOnFailure
  }

  // Step 1: Prepare
  prepareHandle(record)

  // Check if prepare succeeded
  if (spl.headers.spl.runtime.error) {
    spl.headers.spl.dev.cycle.output = {
      status: 'failed',
      failedAt: 'prepare',
      error: spl.headers.spl.runtime.error
    }
    return
  }

  const prepareOutput = spl.headers.spl.dev.prepare.output

  // Reset completion flag for test
  spl.headers.spl.request.completed = false

  // Step 2: Test
  testHandle(record)

  // Check if test succeeded
  if (spl.headers.spl.runtime.error) {
    spl.headers.spl.dev.cycle.output = {
      status: 'failed',
      failedAt: 'test',
      prepare: prepareOutput,
      error: spl.headers.spl.runtime.error
    }
    return
  }

  const testOutput = spl.headers.spl.dev.test.output

  // Set combined output
  spl.headers.spl.dev.cycle.output = {
    status: testOutput.status,
    environment: prepareOutput.environment,
    prepare: {
      nodeCount: prepareOutput.nodeCount,
      typeCount: prepareOutput.typeCount
    },
    test: testOutput.summary
  }

  spl.complete()
}
