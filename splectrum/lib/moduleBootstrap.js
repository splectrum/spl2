// moduleBootstrap.js - Bootstrap function for module resolution
//
// Real file in lib/ (not symlink). Foundation that modules sit on top of.
// Cannot be inside a module because it enables module loading.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const nodeRoot = path.resolve(__dirname, '..')

/**
 * Resolve module path for a method (internal helper)
 */
function resolveModule(methodPath, runtime) {
  const parts = methodPath.split('/')

  if (parts.length !== 3) {
    throw new Error(`Invalid method path: ${methodPath}. Expected package/api/method`)
  }

  const [pkg, api, method] = parts

  // Build list of module directories to scan
  // App modules first (if override), then node modules
  const moduleDirs = []

  if (runtime.appModuleOverride && runtime.appId) {
    const appModulesDir = path.join(nodeRoot, 'apps', runtime.appId, 'modules')
    if (fs.existsSync(appModulesDir)) {
      moduleDirs.push(appModulesDir)
    }
  }

  moduleDirs.push(path.join(nodeRoot, 'modules'))

  // Scan directories in order
  for (const modulesDir of moduleDirs) {
    if (!fs.existsSync(modulesDir)) continue

    const moduleEntries = fs.readdirSync(modulesDir)

    for (const moduleName of moduleEntries) {
      const candidatePath = path.join(modulesDir, moduleName, pkg, api, method)
      if (fs.existsSync(candidatePath)) {
        return {
          moduleName,
          methodDir: candidatePath
        }
      }
    }
  }

  return null
}

/**
 * Create spl wrapper bound to record (internal helper)
 */
function createSpl(record) {
  return {
    headers: record.headers,
    value: record.value,

    complete() {
      record.headers.spl.request.completed = true
    },

    error(message) {
      record.headers.spl.runtime.error = message
      record.headers.spl.request.completed = true
    }
  }
}

/**
 * Require and wrap an spl method
 *
 * Resolves module, imports it, creates record with input, wraps with createSpl.
 * Does NOT execute - returns prepared instance with internalized record state.
 *
 * @param {string} methodPath - Method path (e.g., 'spl/dev/cycle')
 * @param {Object} input - Input for the method
 * @param {Object} runtime - Runtime context
 * @param {boolean} runtime.appModuleOverride - Enable app+node resolution
 * @param {string} runtime.appId - App ID for app module resolution
 * @returns {Promise<{ spl: Object, handle: Function, record: Object }>}
 */
export async function requireSpl(methodPath, input, runtime = {}) {
  const parts = methodPath.split('/')
  const [pkg, api, method] = parts

  // Resolve module
  const resolved = resolveModule(methodPath, runtime)

  if (!resolved) {
    throw new Error(`Method not found: ${methodPath}`)
  }

  // Import method module
  const methodIndex = path.join(resolved.methodDir, 'index.js')
  const methodMod = await import(methodIndex)

  // Build record
  const record = {
    headers: {
      spl: {
        request: { completed: false },
        runtime: runtime
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

  // Create wrapper
  const spl = createSpl(record)

  return {
    spl,
    handle: methodMod.handle,
    record
  }
}
