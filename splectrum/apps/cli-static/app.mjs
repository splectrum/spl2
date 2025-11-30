// apps/cli-static/app.mjs - CLI Static App implementation
//
// Provides: name, help, handle
//
// Receives unified request record (transformation done by caller).
// Direct execution mode - no FAF/watcher, executes and outputs directly.

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { requireSpl, requireNonSpl } from '../../lib/moduleBootstrap.js'
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

  // Dispatch based on method type
  if (method.startsWith('/')) {
    // Library script - absolute path
    await executeScript(record)
  } else if (method === 'spl/script/inline') {
    // Inline script
    await executeInline(record)
  } else {
    // Module method
    await executeMethod(record)
  }

  // Output result
  console.log(JSON.stringify(record, null, 2))
}

// ============================================================================
// Execution handlers - TODO: implement properly
// ============================================================================

/**
 * Wrap and execute script content
 * Same wrapper for inline and library scripts
 * @param {string} scriptContent - The script body
 * @param {Object} record - The request record
 */
async function wrapAndExecute(scriptContent, record) {
  // Same bootstrapping as formal implementations
  const spl = await requireSpl('lib/spl', record)

  // Wrap script with full splectrum access:
  // - record: the record
  // - spl: pre-loaded lib/spl (convenience)
  // - requireSpl: load splectrum libs
  // - requireNonSpl: load platform modules
  // Scripts also have freedom for non-splectrum patterns (direct imports, etc)
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  const fn = new AsyncFunction('record', 'spl', 'requireSpl', 'requireNonSpl', scriptContent)

  await fn(record, spl, requireSpl, requireNonSpl)
}

async function executeScript(record) {
  const scriptPath = record.headers.spl.request.method
  const fs = await import('fs')
  const scriptContent = fs.readFileSync(scriptPath, 'utf-8')

  await wrapAndExecute(scriptContent, record)
}

async function executeInline(record) {
  const scriptContent = record.headers.spl.request.script

  await wrapAndExecute(scriptContent, record)
}

async function executeMethod(record) {
  const method = record.headers.spl.request.method
  const nodeRoot = record.headers.spl.runtime.nodeRoot

  // Resolve method path to module location
  // e.g., pr09/console/hello → modules/bm_spl/pr09/console/hello/index.js
  const modulePath = path.join(nodeRoot, 'modules', 'bm_spl', method, 'index.js')

  // Import the module
  const module = await import(modulePath)

  // Bootstrap spl (same as scripts)
  const spl = await requireSpl('lib/spl', record)

  // Call handle with same signature as scripts
  await module.handle(record, spl, requireSpl, requireNonSpl)
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
