// lib/entryPoint.js - Framework for external entry points
//
// Provides consistent CLI-style handling for all spl.mjs entry points.
// Apps provide { name, help, handle } module, framework does the rest.

import { fileURLToPath } from 'url'

/**
 * Create an entry point from an app module
 * @param {Object} app - App module with name, help, handle
 * @param {string} app.name - App name
 * @param {string} app.help - Help text
 * @param {Function} app.handle - Handler function (record) => Promise
 * @param {string} callerUrl - import.meta.url from caller
 */
export function entryPoint(app, callerUrl) {
  const { name, help, handle } = app

  // Check if this is direct invocation (main module)
  const isMain = callerUrl && process.argv[1] === fileURLToPath(callerUrl)

  if (isMain) {
    const arg = process.argv[2]

    // No args or --help
    if (!arg || arg === '--help' || arg === '-h') {
      console.log(help)
      process.exit(0)
    }

    // Parse JSON and call handler
    try {
      const record = JSON.parse(arg)
      handle(record).catch(err => {
        console.error(`Error in ${name}:`, err.message)
        process.exit(1)
      })
    } catch (e) {
      console.error(`Invalid JSON input: ${e.message}`)
      console.error('')
      console.log(help)
      process.exit(1)
    }
  }

  // Return handle for programmatic use
  return { handle }
}
