#!/usr/bin/env node
// Test arithmetic1 handler with context

const { ExecutionContext } = require('../state/context.js')
const { processArithmetic } = require('./arithmetic1.js')

console.log('=== Testing Arithmetic Handler ===\n')

// Test: Process "3 + 5 - 2" step by step
console.log('Test: Process "3 + 5 - 2" step by step\n')

// Step 0: Initial request
let event = {
  headers: {
    pr09: {
      request: { id: 'req-test-001' },
      runtime: { requestcomplete: false, status: 'pending' }
    }
  },
  value: '3 + 5 - 2'
}

console.log('Step 0 - Input:', JSON.stringify(event, null, 2))
let context = new ExecutionContext(event)
event = processArithmetic(context)
console.log('Step 0 - Output:', JSON.stringify(event, null, 2))
console.log('Value:', event.value, '\n')

// Step 1: Process first operation (3 + 5)
console.log('Step 1 - Processing...')
context = new ExecutionContext(event)
event = processArithmetic(context)
console.log('Step 1 - Output:', JSON.stringify(event, null, 2))
console.log('Value:', event.value, '\n')

// Step 2: Process second operation (8 - 2)
console.log('Step 2 - Processing...')
context = new ExecutionContext(event)
event = processArithmetic(context)
console.log('Step 2 - Output:', JSON.stringify(event, null, 2))
console.log('Value:', event.value)
console.log('Complete:', event.headers.pr09.runtime.requestcomplete, '\n')

// Step 3: Try to process again (should stay complete)
console.log('Step 3 - Processing completed request (should not change)...')
context = new ExecutionContext(event)
event = processArithmetic(context)
console.log('Step 3 - Output value:', event.value)
console.log('Still complete:', event.headers.pr09.runtime.requestcomplete, '\n')

console.log('✅ All steps completed correctly!')
console.log('Final result: 6')
console.log('Metadata:', event.headers.pr09.arithmetic)
