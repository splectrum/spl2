// Iteration 1: Sequential arithmetic handler
// Processes one operation at a time, fire-and-forget pattern

const data = require('./data.js')

/**
 * Parse next operation from expression string
 * Returns { operator, operand, remaining } or null if no more operations
 */
function parseNextOperation(expression) {
  const match = expression.trim().match(/^([+\-*/])\s*(\d+(?:\.\d+)?)\s*(.*)/)
  if (!match) {
    return null
  }

  return {
    operator: match[1],
    operand: parseFloat(match[2]),
    remaining: match[3]
  }
}

/**
 * Execute a single arithmetic operation
 */
function executeOperation(value, operator, operand) {
  switch (operator) {
    case '+': return value + operand
    case '-': return value - operand
    case '*': return value * operand
    case '/': return value / operand
    default: throw new Error(`Unknown operator: ${operator}`)
  }
}

/**
 * Process a request event (one step at a time)
 */
function processRequest(requestId, event) {
  console.log(`\n[${new Date().toISOString()}] Processing ${requestId} step ${event.step}`)

  // Step 0: Initial parse
  if (event.step === 0) {
    const match = event.input.match(/^(\d+(?:\.\d+)?)\s*(.*)/)
    if (!match) {
      throw new Error(`Invalid expression: ${event.input}`)
    }

    const initialValue = parseFloat(match[1])
    const remaining = match[2]

    console.log(`  Initial value: ${initialValue}`)
    console.log(`  Remaining: "${remaining}"`)

    // Publish step 1 event
    const nextStep = {
      requestId: event.requestId,
      step: event.step + 1,
      value: initialValue,
      remaining: remaining,
      originalInput: event.input,
      status: remaining ? 'pending' : 'completed'
    }

    data.publish(`request/${requestId}`, nextStep)
    console.log(`  ✓ Step ${nextStep.step} published (${nextStep.status})`)
    return
  }

  // Subsequent steps: Process one operation at a time
  const nextOp = parseNextOperation(event.remaining)

  if (!nextOp) {
    // No more operations - already completed
    return
  }

  const newValue = executeOperation(event.value, nextOp.operator, nextOp.operand)

  console.log(`  ${event.value} ${nextOp.operator} ${nextOp.operand} = ${newValue}`)
  console.log(`  Remaining: "${nextOp.remaining}"`)

  // Publish next step event
  const nextStep = {
    requestId: event.requestId,
    step: event.step + 1,
    value: newValue,
    remaining: nextOp.remaining,
    originalInput: event.originalInput,
    status: nextOp.remaining ? 'pending' : 'completed'
  }

  data.publish(`request/${requestId}`, nextStep)
  console.log(`  ✓ Step ${nextStep.step} published (${nextStep.status})`)
}

module.exports = {
  processRequest,
  parseNextOperation,
  executeOperation
}
