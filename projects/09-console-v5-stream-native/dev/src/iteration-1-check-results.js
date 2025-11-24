// Check results after handler has processed requests

const data = require('./data.js')
const fs = require('fs')
const path = require('path')

const REQUEST_DIR = path.join(__dirname, '../events/request')

console.log('=== Checking Results ===\n')

// Expected results
const expected = {
  '3 + 5 - 2': 6,
  '10 + 20 + 30': 60,
  '100 - 50 - 25': 25,
  '7 + 3 + 1 + 9': 20
}

if (!fs.existsSync(REQUEST_DIR)) {
  console.log('❌ No requests found')
  process.exit(1)
}

const requestDirs = fs.readdirSync(REQUEST_DIR)
  .filter(name => fs.statSync(path.join(REQUEST_DIR, name)).isDirectory())

console.log(`Found ${requestDirs.length} request(s)\n`)

let passed = 0
let failed = 0
let pending = 0

requestDirs.forEach(requestId => {
  const events = data.consume(`request/${requestId}`)

  if (events.length === 0) {
    console.log(`⚠️  ${requestId}: No events`)
    return
  }

  const initial = events.find(e => e.step === 0)
  const completion = events.find(e => e.status === 'completed')

  if (!completion) {
    console.log(`⏳ ${requestId}: "${initial.input}" - PENDING`)
    pending++
    return
  }

  const expression = initial.input
  const result = completion.value  // Changed from completion.output
  const expectedResult = expected[expression]

  if (result === expectedResult) {
    console.log(`✅ ${requestId}: "${expression}" = ${result}`)
    passed++
  } else {
    console.log(`❌ ${requestId}: "${expression}" = ${result} (expected ${expectedResult})`)
    failed++
  }
})

console.log(`\n=== Results: ${passed} passed, ${failed} failed, ${pending} pending ===`)

// Show audit trail for first request
if (requestDirs.length > 0) {
  console.log('\n=== Audit Trail Example ===\n')
  const requestId = requestDirs[0]
  const events = data.consume(`request/${requestId}`)

  console.log(`Request: ${requestId}`)
  events.forEach((event, i) => {
    const display = event.step === 0
      ? `input: "${event.input}"`
      : `value: ${event.value}, remaining: "${event.remaining}"`
    console.log(`  Step ${event.step}: ${event.status} - ${display}`)
  })

  console.log('\n✅ Fire-and-forget pattern demonstrated')
  console.log('✅ Each step triggers next step automatically')
  console.log('✅ Full execution reconstructable from events')
}
