// moduleBootstrap.js - Minimal loader for module.js
//
// Single responsibility: find and load module.js (app-first, then splectrum)
// All other functionality is in module.js itself.
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
// Module.js Loader
// ============================================================================

/**
 * Load module.js
 *
 * Resolution order:
 * 1. apps/{appName}/modules/{layer}/_lib/module.js (if appName provided)
 * 2. splectrum/modules/{layer}/_lib/module.js (fallback, or only if no appName)
 *
 * @param {string} [appName] - App name for overlay (e.g., 'cli-static'). Omit for splectrum-only.
 * @returns {Promise<Object>} - module.js exports (with create function)
 */
export async function loadModule(appName) {
  // 1. Check app modules first (if appName provided)
  if (appName) {
    const appModulesDir = path.join(nodeRoot, 'apps', appName, 'modules')
    const appHierarchyPath = path.join(appModulesDir, 'hierarchy.json')

    if (fs.existsSync(appHierarchyPath)) {
      const appHierarchy = JSON.parse(fs.readFileSync(appHierarchyPath, 'utf8'))

      for (const layer of appHierarchy.layers) {
        const modulePath = path.join(appModulesDir, layer.name, '_lib/module.js')
        if (fs.existsSync(modulePath)) {
          return await import(modulePath)
        }
      }
    }
  }

  // 2. Fall back to splectrum modules
  const splectrumModulesDir = path.join(nodeRoot, 'modules')
  const splectrumHierarchyPath = path.join(splectrumModulesDir, 'hierarchy.json')

  if (!fs.existsSync(splectrumHierarchyPath)) {
    throw new Error(`hierarchy.json not found: ${splectrumHierarchyPath}`)
  }

  const splectrumHierarchy = JSON.parse(fs.readFileSync(splectrumHierarchyPath, 'utf8'))

  for (const layer of splectrumHierarchy.layers) {
    const modulePath = path.join(splectrumModulesDir, layer.name, '_lib/module.js')
    if (fs.existsSync(modulePath)) {
      return await import(modulePath)
    }
  }

  throw new Error('module.js not found in any layer')
}
