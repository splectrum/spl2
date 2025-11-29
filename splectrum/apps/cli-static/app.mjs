// apps/cli-static/app.mjs - CLI Static App implementation
//
// Provides: name, help, handle

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

/**
 * Handle CLI request
 * @param {Object} record - spl/cli record
 */
export async function handle(record) {
  // Starting point - just dump record
  console.log('=== cli-static app received ===')
  console.log(JSON.stringify(record, null, 2))

  // TODO: Dispatch based on mode
  // - command: invoke method
  // - library: load and run internal script
  // - script: run inline script
}
