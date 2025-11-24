// Core daemon v2 - Handler returns events, daemon publishes them
// Clean separation: watcher polls, handler processes, daemon publishes

import fs from 'fs'
import path from 'path'
import * as data from './data.js'

/**
 * Create a handler daemon
 *
 * @param {Object} config
 * @param {string} config.requestDir - Directory containing request subdirectories
 * @param {Function} config.processEvent - Function(requestId, event) that returns next event or null
 * @param {number} config.pollInterval - Polling interval in ms (default: 100)
 * @param {boolean} config.verbose - Enable verbose logging (default: true)
 * @returns {Object} { start, stop }
 */
function createDaemon(config) {
  const { requestDir, processEvent, pollInterval = 100, verbose = true } = config

  // Track the last step processed for each request
  const lastProcessedStep = new Map()
  let intervalId = null

  function log(...args) {
    if (verbose) {
      console.log(...args)
    }
  }

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
          log(`\n[${new Date().toISOString()}] Processing ${requestId} step ${nextEvent.step}`)

          // Handler processes event and returns next event (or null)
          const resultEvent = processEvent(requestId, nextEvent)

          if (resultEvent) {
            // Daemon publishes the event returned by handler
            data.publish(`request/${requestId}`, resultEvent)
            log(`  ✓ Step ${resultEvent.step} published (${resultEvent.status})`)
          }

          // Mark this step as processed
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
    log(`\n[Handler Daemon Started]`)
    log(`Watching: ${requestDir}`)
    log(`Waiting for requests...\n`)

    // Process any pending requests first
    log('Checking for pending requests...')
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
      log('\n[Handler Daemon Stopped]')
    }
  }

  return { start, stop }
}

export { createDaemon }
