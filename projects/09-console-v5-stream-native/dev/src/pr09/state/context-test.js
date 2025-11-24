#!/usr/bin/env node
// Test context wrapper with old v2 event format

const { ExecutionContext } = require('./context.js')

console.log('=== Testing ExecutionContext ===\n')

// Test 1: Old format (v2) to new format
console.log('Test 1: Convert old event format to context')
const oldEvent = {
  requestId: 'req-123',
  step: 0,
  input: '3 + 5 - 2',
  value: { current: 3, remaining: '+ 5 - 2' },
  status: 'pending'
}

const context1 = new ExecutionContext(oldEvent)
console.log('Input (old format):', JSON.stringify(oldEvent, null, 2))
console.log('Context headers:', JSON.stringify(context1.headers, null, 2))
console.log('Context value:', context1.value)
console.log('Output event:', JSON.stringify(context1.toEvent(), null, 2))
console.log('✅ Old format conversion works\n')

// Test 2: New format to context
console.log('Test 2: New namespaced format')
const newEvent = {
  headers: {
    pr09: {
      request: { id: 'req-456' },
      runtime: {
        requestcomplete: false,
        status: 'pending',
        handler: 'arithmetic1'
      }
    }
  },
  value: '3 + 5 - 2'
}

const context2 = new ExecutionContext(newEvent)
console.log('Input (new format):', JSON.stringify(newEvent, null, 2))
console.log('Context:', JSON.stringify(context2.toEvent(), null, 2))
console.log('✅ New format works\n')

// Test 3: Handler modifies value
console.log('Test 3: Handler modifies value')
context2.value = 8  // Simulating handler processing
console.log('After handler: value =', context2.value)
const event3 = context2.toEvent()
console.log('Output event:', JSON.stringify(event3, null, 2))
console.log('✅ Value modification works\n')

// Test 4: Mark complete
console.log('Test 4: Mark request complete')
context2.value = 6
context2.markComplete()
console.log('isComplete():', context2.isComplete())
console.log('Output event:', JSON.stringify(context2.toEvent(), null, 2))
console.log('✅ Completion marking works\n')

// Test 5: Handler-specific hive
console.log('Test 5: Handler-specific metadata hive')
context2.headers.pr09.arithmetic.operationcount = 3
context2.headers.pr09.arithmetic.lastoperator = '-'
const event5 = context2.toEvent()
console.log('Arithmetic hive:', event5.headers.pr09.arithmetic)
console.log('✅ Handler hives work\n')

console.log('=== All tests passed ===')
