// moduleBootstrap.js - Bootstrap for requiring splectrum and platform modules
//
// requireSpl(uri, record) → bound splectrum object (async)
// requireNonSpl(moduleName) → platform module

// Pre-load platform modules (sync at module load time)
import * as fsModule from 'fs'
import * as pathModule from 'path'

// Registry of platform modules used in splectrum
// Key must exist to require - enforces explicit registration
// Values will be Bare equivalents when we implement platform switch
const platformModules = {
  'fs': fsModule.default ?? fsModule,
  'path': pathModule.default ?? pathModule
}

/**
 * Require a splectrum lib or module
 * @param {string} uri - 'lib/spl', 'lib/spl/cli', or 'pkg/api/method'
 * @param {Object} record - Record to bind
 * @returns {Promise<Object>} - Bound object
 */
export async function requireSpl(uri, record) {
  if (uri.startsWith('lib/')) {
    // Lib resolution:
    //   lib/spl     → modules/bm_spl/spl/_lib/spl.js (package level)
    //   lib/spl/cli → modules/bm_spl/spl/cli/_lib/cli.js (API level)
    const libPath = uri.replace('lib/', '')  // e.g., spl or spl/cli
    const parts = libPath.split('/')
    const libName = parts[parts.length - 1]  // e.g., spl or cli
    const mod = await import(`../modules/bm_spl/${libPath}/_lib/${libName}.js`)
    return mod.create(record, { requireNonSpl })
  }

  // Module resolution (pkg/api/method) - TODO
  throw new Error(`Module resolution not yet implemented: ${uri}`)
}

/**
 * Require a platform/external module (sync)
 * @param {string} moduleName - 'fs', 'path', 'os', etc.
 * @returns {Object} - The module
 */
export function requireNonSpl(moduleName) {
  if (!(moduleName in platformModules)) {
    throw new Error(`Unregistered platform module: ${moduleName}. Add to moduleBootstrap.js`)
  }
  return platformModules[moduleName]
}
