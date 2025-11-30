// apps/cli-static/app.mjs - CLI Static App implementation
//
// Provides: name, help, handle
//
// Receives unified request record (transformation done by caller).
// Direct execution mode - no FAF/watcher, executes and outputs directly.

import { fileURLToPath } from 'url'
import path from 'path'
import { requireSpl, requireNonSpl } from '../../lib/moduleBootstrap.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  record.headers.spl.request.output = {
    status: 'NOT_IMPLEMENTED',
    message: `Method execution: ${method}`
  }
}
