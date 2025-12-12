// moduleBootstrap.js - Bootstrap loader for module.js
//
// Creates a minimal bootstrap module that module.js can receive via standard
// create(module) signature. The bootstrap module provides just enough for
// module.js to initialize: nodeRoot, modulesDir, and platform imports.
//
// Platform compatibility: Uses import maps in package.json for Node/Bare switching.

// ============================================================================
// Platform Modules (via import maps - package.json handles Node/Bare switching)
// ============================================================================

const fs = await import('fs').then(m => m.default ?? m)
const path = await import('path').then(m => m.default ?? m)
const { fileURLToPath } = await import('url')

// Derive node root from this file's location (sibling to lib/)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nodeRoot = path.join(__dirname, '..')

// ============================================================================
// Bootstrap Module
// ============================================================================

/**
 * Create minimal bootstrap module for module.js initialization.
 *
 * Provides:
 * - getNodeRoot() - node root path
 * - getModulesDir() - splectrum modules directory
 * - getAppAPI() - null (no app context at bootstrap)
 * - require(uri) - platform modules only (fs, path, etc.)
 */
function createBootstrapModule(modulesDir) {
  return {
    getNodeRoot: () => nodeRoot,
    getModulesDir: () => modulesDir,
    getAppAPI: () => null,
    getAppName: () => null,
    getEnableAppOverlay: () => false,

    // Platform modules only - package.json handles Node/Bare mapping
    async require(uri) {
      return import(uri).then(m => m.default ?? m)
    }
  }
}

// ============================================================================
// Module.js Loader
// ============================================================================

/**
 * Load module.js and create instance with bootstrap module.
 *
 * Resolution order:
 * 1. apps/{appName}/modules/{layer}/_lib/module.js (if appName provided)
 * 2. splectrum/modules/{layer}/_lib/module.js (fallback, or only if no appName)
 *
 * @param {string} [appName] - App name for overlay (e.g., 'cli-static'). Omit for splectrum-only.
 * @returns {Promise<Object>} - Instantiated module (result of create(bootstrapModule))
 */
export async function loadModule(appName) {
  let modulePath = null
  let modulesDir = null

  // 1. Check app modules first (if appName provided)
  if (appName) {
    const appModulesDir = path.join(nodeRoot, 'apps', appName, 'modules')
    const appHierarchyPath = path.join(appModulesDir, 'hierarchy.json')

    if (fs.existsSync(appHierarchyPath)) {
      const appHierarchy = JSON.parse(fs.readFileSync(appHierarchyPath, 'utf8'))

      for (const layer of appHierarchy.layers) {
        const candidatePath = path.join(appModulesDir, layer.name, '_lib/module.js')
        if (fs.existsSync(candidatePath)) {
          modulePath = candidatePath
          modulesDir = appModulesDir
          break
        }
      }
    }
  }

  // 2. Fall back to splectrum modules
  if (!modulePath) {
    const splectrumModulesDir = path.join(nodeRoot, 'modules')
    const splectrumHierarchyPath = path.join(splectrumModulesDir, 'hierarchy.json')

    if (!fs.existsSync(splectrumHierarchyPath)) {
      throw new Error(`hierarchy.json not found: ${splectrumHierarchyPath}`)
    }

    const splectrumHierarchy = JSON.parse(fs.readFileSync(splectrumHierarchyPath, 'utf8'))

    for (const layer of splectrumHierarchy.layers) {
      const candidatePath = path.join(splectrumModulesDir, layer.name, '_lib/module.js')
      if (fs.existsSync(candidatePath)) {
        modulePath = candidatePath
        modulesDir = splectrumModulesDir
        break
      }
    }
  }

  if (!modulePath) {
    throw new Error('module.js not found in any layer')
  }

  // Create bootstrap module and instantiate module.js
  const bootstrapModule = createBootstrapModule(modulesDir)
  const moduleLib = await import(modulePath)
  return moduleLib.create(bootstrapModule)
}
