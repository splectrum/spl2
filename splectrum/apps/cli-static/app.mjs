// apps/cli-static/app.mjs - CLI Static App implementation
//
// Provides: name, help, handle
//
// Receives unified request record (transformation done by caller).
// Direct execution mode - no FAF/watcher, executes and outputs directly.

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { requireSpl } from '../../lib/moduleBootstrap.js'
import { startSession } from './session.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Session paths
const sessionRoot = path.resolve(__dirname, '../../runtime/cli-static/requests')
const inboxDir = path.join(sessionRoot, 'inbox')

export const name = 'cli-static'

export const help = `
CLI Static App - processes unified requests

Usage:
  node spl.mjs <json-record>
  node spl.mjs --help

Input: Unified request record:
  {
    "headers": {
      "spl": {
        "request": {
          "timeReceived": ...,
          "method": "spl/dev/cycle",
          "input": { "name": "env-123" }
        },
        "runtime": { "nodeRoot": ..., "invokedFrom": ..., "platform": { "type": ... } }
      }
    },
    "value": null
  }

method can be:
  - Module path: "spl/dev/cycle"
  - Script path: "/absolute/path/to/script.js"
  - Inline: "spl/script/inline" (with script in request.script)

Output: Writes to console, returns nothing.
`

// ============================================================================
// Main Handler
// ============================================================================

/**
 * Handle unified request - direct execution
 * @param {Object} record - unified request record
 */
export async function handle(record) {
  const method = record.headers.spl.request.method

  // Unified execution via requireSpl
  const executable = await requireSpl(method, record)
  await executable.invoke()

  // Output result
  console.log(JSON.stringify(record, null, 2))
}

// ============================================================================
// Session-based Handler
// ============================================================================

/**
 * Handle request via session pipeline
 * FAF to inbox → session processes → consume from outbox
 * @param {Object} record - unified request record
 */
export async function handleViaSession(record) {
  // Start session watchers
  const session = startSession()

  try {
    // Start outbox consumer (before FAF to not miss the result)
    const resultPromise = consumeOutbox()

    // FAF request to inbox
    const spl = await requireSpl('lib/spl', record)
    spl.faf(inboxDir, { sync: true })

    // Wait for result from outbox
    const result = await resultPromise

    // Output result
    console.log(JSON.stringify(result, null, 2))
  } finally {
    // Stop session
    session.stop()
  }
}

// ============================================================================
// Outbox Consumer - watches for session results
// ============================================================================

const APP_CONSUMER_ID = 'apps/cli-static'

/**
 * Watch outbox for a result, return when one arrives
 * Single-event consumer - stops after first result
 * @returns {Promise<Object>} - The result record
 */
export function consumeOutbox() {
  const outboxDir = path.join(sessionRoot, 'outbox')

  return new Promise((resolve, reject) => {
    const watcher = fs.watch(outboxDir, (event, filename) => {
      // Only respond to rename (file dropped in)
      if (event !== 'rename') return
      if (!filename?.endsWith('.json')) return

      const filePath = path.join(outboxDir, filename)

      // Check file exists (rename fires for add and remove)
      if (!fs.existsSync(filePath)) return

      try {
        // Read and parse
        const content = fs.readFileSync(filePath, 'utf-8')
        const record = JSON.parse(content)

        // Stamp consumer (boundary crossing back to app)
        record.headers.spl.consumer = {
          id: APP_CONSUMER_ID,
          timestamp: Date.now(),
          sourcePath: filePath
        }

        // Remove from outbox (consumed)
        fs.unlinkSync(filePath)

        // Stop watching and resolve
        watcher.close()
        resolve(record)
      } catch (err) {
        watcher.close()
        reject(err)
      }
    })
  })
}
