// Iteration 1 Test: Fire-and-forget + Handler daemon pattern
// Tests async request/response via file-based queue

const { invoke } = require('./invoke.js')
const data = require('./data.js')

console.log('=== Iteration 1: Fire-and-Forget + Handler Daemon ===\n')

// Test cases from iteration plan
const testCases = [
  { expression: '3 + 5 - 2', expected: 6 },
  { expression: '10 + 20 + 30', expected: 60 },
  { expression: '100 - 50 - 25', expected: 25 },
  { expression: '7 + 3 + 1 + 9', expected: 20 }
]

console.log('Step 1: Invoke requests (fire-and-forget)')
const requestIds = testCases.map(test => {
  const requestId = invoke(test.expression)
  console.log(`  → ${requestId}: "${test.expression}"`)
  return requestId
})

console.log('\nStep 2: Start handler-daemon.js in separate terminal to process')
console.log('  $ node handler-daemon.js')

console.log('\nStep 3: Wait a moment, then check results')
console.log('  $ node iteration-1-check-results.js')

console.log('\n✅ Requests submitted (fire-and-forget)')
console.log('📋 Request IDs:', requestIds)
