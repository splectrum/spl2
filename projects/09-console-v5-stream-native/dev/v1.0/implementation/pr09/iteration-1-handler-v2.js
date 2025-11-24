// Iteration 1 Handler v2: Pure handler (returns events, doesn't publish)
// Processes one arithmetic operation at a time

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
 * Returns the next event to be published (or null if no action needed)
 *
 * @param {string} requestId
 * @param {Object} event - Current event to process
 * @returns {Object|null} Next event to publish, or null
 */
function processRequest(requestId, event) {
  // Step 0: Initial parse
  if (event.step === 0) {
    const match = event.input.match(/^(\d+(?:\.\d+)?)\s*(.*)/)
    if (!match) {
      throw new Error(`Invalid expression: ${event.input}`)
    }

    const initialValue = parseFloat(match[1])
    const remaining = match[2]

    // Return step 1 event
    return {
      requestId: event.requestId,
      step: event.step + 1,
      value: initialValue,
      remaining: remaining,
      originalInput: event.input,
      status: remaining ? 'pending' : 'completed'
    }
  }

  // Subsequent steps: Process one operation at a time
  const nextOp = parseNextOperation(event.remaining)

  if (!nextOp) {
    // No more operations - no event to publish
    return null
  }

  const newValue = executeOperation(event.value, nextOp.operator, nextOp.operand)

  // Return next step event
  return {
    requestId: event.requestId,
    step: event.step + 1,
    value: newValue,
    remaining: nextOp.remaining,
    originalInput: event.originalInput,
    status: nextOp.remaining ? 'pending' : 'completed'
  }
}

export {
  processRequest,
  parseNextOperation,
  executeOperation
}
