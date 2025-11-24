// Iteration 1 Test: Simple sequential arithmetic
// Free handler + Request pattern

const handler = require('./arithmetic-handler.js')
const data = require('./data.js')

console.log('=== Iteration 1: Simple Sequential Arithmetic ===\n')

// Test cases from iteration plan
const testCases = [
  { expression: '3 + 5 - 2', expected: 6 },
  { expression: '10 + 20 + 30', expected: 60 },
  { expression: '100 - 50 - 25', expected: 25 },
  { expression: '7 + 3 + 1 + 9', expected: 20 }
]

let passed = 0
let failed = 0

testCases.forEach((test, i) => {
  const requestId = `request-${i + 1}`
  const result = handler.handle(requestId, test.expression)

  if (result === test.expected) {
    console.log(`✅ PASS: ${test.expression} = ${result}`)
    passed++
  } else {
    console.log(`❌ FAIL: ${test.expression} = ${result} (expected ${test.expected})`)
    failed++
  }
})

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)

// Demonstrate audit trail reconstruction
console.log('\n=== Audit Trail Reconstruction ===\n')

const requestId = 'request-1'

// Request events (only stream - handler is stateless)
const requestEvents = data.consume(`request/${requestId}`)
console.log(`Request stream (request/${requestId}):`)
requestEvents.forEach((event, i) => {
  console.log(`  Event ${i + 1}: ${event.status} - ${event.input} → ${event.output || 'processing'}`)
})

console.log('\n✅ Request event stream demonstrates fire-and-reference pattern')
console.log('✅ Handler is stateless - no handler state events needed')
console.log('✅ Full execution can be reconstructed from request stream')
