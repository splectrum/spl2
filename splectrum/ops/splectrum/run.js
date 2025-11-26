// run.js - Core runner for Splectrum methods
//
// Usage: Called by spl entry point
// Input: method path (e.g., 'spl/dev/clone') and input object
// Output: method result

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Run a method
 * @param {string} methodPath - Method path (e.g., 'spl/dev/clone')
 * @param {Object} input - Input object for the method
 * @param {Object} runtime - Runtime properties (cwd, splectrumDir, invokedFrom)
 * @returns {Object} Result with headers and any output
 */
export async function run(methodPath, input, runtime) {
  // Parse method path: 'package/api/method' (fully specified, no defaults)
  const parts = methodPath.split('/')

  if (parts.length !== 3) {
    throw new Error(`Invalid method path: ${methodPath}. Expected package/api/method (e.g., spl/dev/clone)`)
  }

  const [pkg, api, method] = parts

  // Find module containing method
  const modulesDir = path.join(__dirname, 'modules')
  const moduleEntries = fs.readdirSync(modulesDir)

  // Look for method in each module (bm_* or wm_* modules)
  let methodModule = null
  let methodDir = null

  for (const moduleName of moduleEntries) {
    const candidatePath = path.join(modulesDir, moduleName, pkg, api, method)
    if (fs.existsSync(candidatePath)) {
      methodModule = moduleName
      methodDir = candidatePath
      break
    }
  }

  if (!methodModule) {
    throw new Error(`Method not found: ${pkg}/${api}/${method}`)
  }

  // Build record with input and runtime
  const record = {
    headers: {
      spl: {
        request: { completed: false },
        runtime: runtime || {}
      }
    },
    value: null
  }

  // Add method input under package.api.method
  if (pkg === 'spl') {
    record.headers.spl[api] = record.headers.spl[api] || {}
    record.headers.spl[api][method] = input
  } else {
    record.headers[pkg] = { [api]: { [method]: input } }
  }

  // Import and run method
  const methodIndex = path.join(methodDir, 'index.js')
  const methodMod = await import(methodIndex)

  methodMod.handle(record)

  // Return result
  return {
    completed: record.headers.spl.request.completed,
    error: record.headers.spl.runtime.error || null,
    output: record.headers[pkg][api][method].output || null
  }
}

export default { run }
