// test-session-pipeline.mjs - Test full session pipeline
//
// Run with: node splectrum/apps/cli-static/scripts/test-session-pipeline.mjs

import { handleViaSession } from '../app.mjs'

// Create a test record
const record = {
  headers: {
    spl: {
      request: {
        timeReceived: Date.now(),
        method: 'pr09/console/hello',
        input: { message: 'Hello via session!' }
      },
      runtime: {
        nodeRoot: '/home/herma/splectrum/spl2/splectrum',
        invokedFrom: '/home/herma/splectrum/spl2',
        platform: { type: 'node' }
      }
    }
  },
  value: null
}

console.log('Testing session pipeline...\n')
console.log('Input:')
console.log(`  method: ${record.headers.spl.request.method}`)
console.log(`  input: ${JSON.stringify(record.headers.spl.request.input)}`)
console.log('')

await handleViaSession(record)

console.log('\nTest completed!')
