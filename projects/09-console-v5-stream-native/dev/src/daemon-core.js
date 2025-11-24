// Core daemon pattern - reusable handler framework
// Polls for pending events and processes them sequentially

const fs = require('fs')
const path = require('path')
const data = require('./data.js')

/**
 * Create a handler daemon
 *
 * @param {Object} config
 * @param {string} config.requestDir - Directory containing request subdirectories
 * @param {Function} config.processEvent - Function(requestId, event) to process each event
 * @param {number} config.pollInterval - Polling interval in ms (default: 100)
 * @returns {Object} { start, stop }
 */
function createDaemon(config) {
  const { requestDir, processEvent, pollInterval = 100 } = config

  // Track the last step processed for each request
  const lastProcessedStep = new Map()
  let intervalId = null

  /**
   * Process pending requests (on startup or poll)
   */
  function processPendingRequests() {
    if (!fs.existsSync(requestDir)) {
      return
    }

    const requestDirs = fs.readdirSync(requestDir)
      .filter(name => {
        const dirPath = path.join(requestDir, name)
        return fs.statSync(dirPath).isDirectory()
      })

    for (const requestId of requestDirs) {
      try {
        const events = data.consume(`request/${requestId}`)

        // Check if already completed
        const completed = events.some(e => e.status === 'completed')
        if (completed) {
          continue
        }

        // Get the last step we processed for this request
        const lastStep = lastProcessedStep.get(requestId) ?? -1

        // Find the next step to process (lastStep + 1)
        const nextStep = lastStep + 1
        const nextEvent = events.find(e => e.step === nextStep && e.status === 'pending')

        if (nextEvent) {
          processEvent(requestId, nextEvent)
          lastProcessedStep.set(requestId, nextStep)
        }
      } catch (err) {
        // Events may not be ready yet, will retry on next poll
        console.error(`Error processing ${requestId}:`, err.message)
      }
    }
  }

  /**
   * Start the daemon
   */
  function start() {
    console.log(`\n[Handler Daemon Started]`)
    console.log(`Watching: ${requestDir}`)
    console.log(`Waiting for requests...\n`)

    // Process any pending requests first
    console.log('Checking for pending requests...')
    processPendingRequests()

    // Poll for new/updated requests
    intervalId = setInterval(() => {
      processPendingRequests()
    }, pollInterval)
  }

  /**
   * Stop the daemon
   */
  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
      console.log('\n[Handler Daemon Stopped]')
    }
  }

  return { start, stop }
}

module.exports = { createDaemon }
