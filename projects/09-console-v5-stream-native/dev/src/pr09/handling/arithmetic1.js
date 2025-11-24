// pr09/handling/arithmetic1.js
// Arithmetic handler - processes sequential arithmetic expressions

/**
 * Parse next operation from expression string
 * Returns { operator, operand, remaining } or null
 */
function parseNextOperation(expression) {
  const match = String(expression).trim().match(/^([+\-*/])\s*(\d+(?:\.\d+)?)\s*(.*)/)
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
 * Process arithmetic expression one step at a time
 *
 * @param {ExecutionContext} context - Execution context
 * @returns {Object} Next event to publish
 */
function processArithmetic(context) {
  // If already complete, don't process
  if (context.isComplete()) {
    return context.toEvent()
  }

  const value = context.value

  // Step 0: Parse initial value from expression
  if (typeof value === 'string') {
    const match = value.match(/^(\d+(?:\.\d+)?)\s*(.*)/)
    if (!match) {
      context.markError(`Invalid expression: ${value}`)
      return context.toEvent()
    }

    const initialValue = parseFloat(match[1])
    const remaining = match[2]

    // Update metadata hive
    context.headers.pr09.arithmetic.originalexpression = value
    context.headers.pr09.arithmetic.operationcount = 0

    // If no operations, we're done
    if (!remaining) {
      context.value = initialValue
      context.markComplete()
      return context.toEvent()
    }

    // Set initial value and continue
    context.value = { current: initialValue, remaining }
    return context.toEvent()
  }

  // Subsequent steps: Process one operation
  if (typeof value === 'object' && value.current !== undefined) {
    const nextOp = parseNextOperation(value.remaining)

    if (!nextOp) {
      // No more operations - extract final value
      context.value = value.current
      context.markComplete()
      return context.toEvent()
    }

    // Execute one operation
    const newValue = executeOperation(value.current, nextOp.operator, nextOp.operand)

    // Update metadata
    context.headers.pr09.arithmetic.operationcount++
    context.headers.pr09.arithmetic.lastoperator = nextOp.operator

    // Update value with new state
    context.value = {
      current: newValue,
      remaining: nextOp.remaining
    }

    return context.toEvent()
  }

  // Value is final number - mark complete
  if (typeof value === 'number') {
    context.markComplete()
    return context.toEvent()
  }

  // Unknown state
  context.markError(`Unknown value type: ${typeof value}`)
  return context.toEvent()
}

module.exports = {
  processArithmetic,
  parseNextOperation,
  executeOperation
}
