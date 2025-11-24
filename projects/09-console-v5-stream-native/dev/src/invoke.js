// Free script - Fire-and-forget request creation
// Creates step 0 request event and exits immediately

const data = require('./data.js')

/**
 * Invoke arithmetic request (fire-and-forget)
 * @param {string} expression - Arithmetic expression to evaluate
 * @returns {string} requestId - Request identifier for tracking
 */
function invoke(expression) {
  // Generate unique request ID
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  console.log(`Invoking request ${requestId}: "${expression}"`)

  // Create step 0 request event
  const request = {
    requestId,
    step: 0,
    input: expression,
    status: 'pending'
  }

  // Fire-and-forget: publish and exit
  data.publish(`request/${requestId}`, request)
  console.log(`✓ Request published (fire-and-forget)`)

  return requestId
}

module.exports = { invoke }

// CLI usage
if (require.main === module) {
  const expression = process.argv[2]

  if (!expression) {
    console.error('Usage: node invoke.js "<expression>"')
    console.error('Example: node invoke.js "3 + 5 - 2"')
    process.exit(1)
  }

  const requestId = invoke(expression)
  console.log(`Request ID: ${requestId}`)
  console.log('Use handler-daemon.js to process requests')
}
