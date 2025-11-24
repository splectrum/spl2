// Invoke v2 - Submit request and wait for result
// Fire-and-forget submission, but can optionally wait for completion

import * as data from './data.js'

/**
 * Generate unique request ID
 */
function generateRequestId() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 11)
  return `req-${timestamp}-${random}`
}

/**
 * Create a request (fire-and-forget)
 *
 * @param {string} input - The input expression/command
 * @returns {string} requestId
 */
function createRequest(input) {
  const requestId = generateRequestId()

  const event = {
    requestId,
    step: 0,
    input,
    status: 'pending'
  }

  data.publish(`request/${requestId}`, event)

  return requestId
}

/**
 * Wait for request completion and return result
 *
 * @param {string} requestId
 * @param {Object} options
 * @param {number} options.timeout - Max wait time in ms (default: 30000)
 * @param {number} options.pollInterval - Check interval in ms (default: 100)
 * @returns {Promise<Object>} Completion event with result
 */
async function waitForCompletion(requestId, options = {}) {
  const { timeout = 30000, pollInterval = 100 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      const events = data.consume(`request/${requestId}`)
      const completed = events.find(e => e.status === 'completed')

      if (completed) {
        return completed
      }
    } catch (err) {
      // Events not ready yet
    }

    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  throw new Error(`Request ${requestId} timed out after ${timeout}ms`)
}

/**
 * Invoke request and wait for result (convenience wrapper)
 *
 * @param {string} input
 * @param {Object} options - waitForCompletion options
 * @returns {Promise<Object>} Completion event with result
 */
async function invoke(input, options = {}) {
  const requestId = createRequest(input)
  console.log(`Request ${requestId} submitted: "${input}"`)

  const result = await waitForCompletion(requestId, options)
  console.log(`Request ${requestId} completed: ${result.value}`)

  return result
}

export {
  generateRequestId,
  createRequest,
  waitForCompletion,
  invoke
}
