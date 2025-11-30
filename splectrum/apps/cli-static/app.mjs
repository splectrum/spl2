// apps/cli-static/app.mjs - CLI Static App implementation
//
// Provides: name, help, handle
//
// Flow:
// 1. Switch on mode, create request record
// 2. Handle errors (create error response)
// 3. FAF to outbox, watcher outputs response

import { fileURLToPath } from 'url'
import path from 'path'
import { createWatcher } from './scripts/watcher.js'
import * as faf from './scripts/faf.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Session paths
const sessionRoot = path.resolve(__dirname, '../../runtime/cli-static/requests')
const outboxDir = path.join(sessionRoot, 'outbox')

export const name = 'cli-static'

export const help = `
CLI Static App - processes CLI requests

Usage:
  node spl.mjs <json-record>
  node spl.mjs --help

Input: JSON record with structure:
  {
    "headers": {
      "spl": {
        "request": { "timeReceived": ... },
        "runtime": { "nodeRoot": ..., "invokedFrom": ..., "platform": { "type": ... } }
      }
    },
    "value": {
      "mode": "command" | "script" | "library",
      "method": "...",      // for command mode
      "script": "...",      // for script mode
      "resolvedPath": "...", // for library mode
      "input": { ... }
    }
  }

Output: Writes to console, returns nothing.
`

// ============================================================================
// Record Transformation
// ============================================================================
// Transform record in place - same record evolves through pipeline.
// Each FAF captures a snapshot of the record's evolution.
// Errors go in headers.spl.error.

/**
 * Set record as command request
 * @param {Object} record - evolving record
 */
function setCommandRequest(record) {
  record.headers.spl.request.type = 'command'
  record.headers.spl.request.method = record.value.method
  // input already in headers.spl.request.input from parseArgs()
  record.value = null  // API state, populated by execution
}

/**
 * Set record as library request
 * @param {Object} record - evolving record
 */
function setLibraryRequest(record) {
  record.headers.spl.error = {
    code: 'NOT_IMPLEMENTED',
    message: 'Library mode not yet implemented'
  }
}

/**
 * Set record as script request
 * @param {Object} record - evolving record
 */
function setScriptRequest(record) {
  record.headers.spl.error = {
    code: 'NOT_IMPLEMENTED',
    message: 'Script mode not yet implemented'
  }
}

/**
 * Set unknown mode error
 * @param {Object} record - evolving record
 * @param {string} mode - The unknown mode
 */
function setUnknownModeError(record, mode) {
  record.headers.spl.error = {
    code: 'UNKNOWN_MODE',
    message: `Unknown mode: ${mode}`
  }
}

// ============================================================================
// Main Handler
// ============================================================================

/**
 * Handle CLI request
 * @param {Object} cliRecord - spl/cli record
 */
export async function handle(record) {
  const timestamp = record.headers.spl.request.timeReceived
  const filename = `${timestamp}.json`
  const mode = record.value.mode

  // Transform record based on mode
  switch (mode) {
    case 'command':
      setCommandRequest(record)
      break
    case 'library':
      setLibraryRequest(record)
      break
    case 'script':
      setScriptRequest(record)
      break
    default:
      setUnknownModeError(record, mode)
  }

  // Handle error - output and return
  if (record.headers.spl.error) {
    console.log(JSON.stringify({
      error: record.headers.spl.error
    }, null, 2))
    return
  }

  // Promise to await watcher completion
  let resolveResponse
  const responsePromise = new Promise(resolve => {
    resolveResponse = resolve
  })

  // Start watcher on outbox
  const watcher = createWatcher({
    sourceDir: outboxDir,
    consumerId: 'apps/cli-static/outbox',
    handler: async (responseRecord) => {
      // Output to console
      console.log(JSON.stringify(responseRecord.value, null, 2))

      // Stop watcher
      watcher.stop()
      resolveResponse(responseRecord)
    }
  })

  // FAF request to outbox
  await faf.write({
    folder: outboxDir,
    filename: filename,
    dedupe: 'numeric-digit',
    record: record
  })

  // Wait for response
  await responsePromise
}
