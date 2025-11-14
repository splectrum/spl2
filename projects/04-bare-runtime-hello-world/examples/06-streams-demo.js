// 06-streams-demo.js - Test stream capabilities
// Self-testing: Verifies stream operations

const fs = require('bare-fs')
const { Readable, Writable } = require('bare-stream')

console.log('Testing stream capabilities...\n')

// Test 1: Custom readable stream
console.log('=== Test 1: Readable Stream ===')

const data = ['chunk1', 'chunk2', 'chunk3']
let dataIndex = 0

const readable = new Readable({
  read() {
    if (dataIndex < data.length) {
      this.push(data[dataIndex++])
    } else {
      this.push(null) // End of stream
    }
  }
})

const chunks = []
readable.on('data', chunk => {
  console.log('Received chunk:', chunk.toString())
  chunks.push(chunk.toString())
})

readable.on('end', () => {
  console.log('✓ Stream ended')

  // Self-test validation
  if (chunks.length !== data.length) {
    console.error('✗ FAIL: Wrong number of chunks received')
    Bare.exit(1)
  }

  for (let i = 0; i < data.length; i++) {
    if (chunks[i] !== data[i]) {
      console.error(`✗ FAIL: Chunk ${i} mismatch`)
      Bare.exit(1)
    }
  }

  console.log('\n✓ All stream tests passed!')
})
