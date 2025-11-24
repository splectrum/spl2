// Arithmetic handler - Iteration 1: Simple sequential
// Free script handler (no pipeline needed)

const data = require('./data.js')

/**
 * Parse simple arithmetic expression (iteration 1: sequential only)
 * @param {string} expression - e.g., "3 + 5 - 2"
 * @returns {array} Array of operations [{op: '+', value: 5}, {op: '-', value: 2}]
 */
function parseExpression(expression) {
  // Split by operators while keeping them
  const tokens = expression.split(/([+\-*/])/).map(t => t.trim()).filter(t => t)

  // First number
  const result = { initial: parseFloat(tokens[0]), operations: [] }

  // Parse operator-number pairs
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i]
    const value = parseFloat(tokens[i + 1])
    result.operations.push({ operator, value })
  }

  return result
}

/**
 * Execute arithmetic operations sequentially
 * @param {number} initial - Starting value
 * @param {array} operations - Array of {operator, value}
 * @returns {number} Result
 */
function execute(initial, operations) {
  let result = initial

  for (const { operator, value } of operations) {
    switch (operator) {
      case '+': result += value; break
      case '-': result -= value; break
      case '*': result *= value; break
      case '/': result /= value; break
      default: throw new Error(`Unknown operator: ${operator}`)
    }
  }

  return result
}

/**
 * Handle arithmetic request
 * @param {string} requestId - Request identifier
 * @param {string} expression - Arithmetic expression
 * @returns {number} Result
 */
function handle(requestId, expression) {
  console.log(`\nHandling request ${requestId}: "${expression}"`)

  const requestTopic = `request/${requestId}`

  // Publish initial request event
  const request = {
    requestId,
    input: expression,
    status: 'processing'
  }
  data.publish(requestTopic, request)
  console.log('✓ Request event published (processing)')

  // Parse and execute (stateless handler - no handler state to track)
  const parsed = parseExpression(expression)
  console.log(`✓ Parsed: initial=${parsed.initial}, operations=${parsed.operations.length}`)

  const result = execute(parsed.initial, parsed.operations)
  console.log(`✓ Executed: result=${result}`)

  // Processing complete - publish request completion
  const completedRequest = {
    requestId,
    input: expression,
    output: result,
    status: 'completed'
  }
  data.publish(requestTopic, completedRequest)
  console.log('✓ Request event published (completed)')

  return result
}

module.exports = {
  handle,
  parseExpression,
  execute
}
