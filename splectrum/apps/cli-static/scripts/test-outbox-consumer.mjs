// test-outbox-consumer.mjs - Test the outbox consumer
//
// Run with: node splectrum/apps/cli-static/scripts/test-outbox-consumer.mjs

import { consumeOutbox } from '../app.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outboxDir = path.resolve(__dirname, '../../../runtime/cli-static/requests/outbox')

console.log('Starting outbox consumer...')
console.log(`Watching: ${outboxDir}`)

// Start consumer (async)
const resultPromise = consumeOutbox()

// Give watcher time to start
setTimeout(() => {
  // FAF a test record to outbox
  const testRecord = {
    headers: {
      spl: {
        request: {
          timeReceived: Date.now(),
          method: 'test/outbox',
          output: { test: 'result' }
        },
        runtime: {}
      }
    },
    value: null
  }

  const filename = `${Date.now()}.json`
  const filePath = path.join(outboxDir, filename)

  console.log(`Writing test record to: ${filename}`)
  fs.writeFileSync(filePath, JSON.stringify(testRecord, null, 2))
}, 100)

// Wait for result
const result = await resultPromise
console.log('\nReceived result:')
console.log(JSON.stringify(result, null, 2))
console.log('\nTest passed!')
