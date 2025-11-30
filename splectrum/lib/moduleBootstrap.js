// moduleBootstrap.js - Bootstrap for requiring splectrum and platform modules
//
// requireSpl(uri, record) → bound splectrum object (async)
// requireNonSpl(moduleName) → platform module
// createOverlay(hierarchy) → overlay resolver
// loadOverlay(hierarchyPath) → overlay resolver from file

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

const fs = platformModules['fs']
const path = platformModules['path']

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

// ============================================================================
// Overlay Resolution
// ============================================================================
//
// Two operations:
// - selectFile(nodePath, filename) - first match wins (for implementation files)
// - collectAll(nodePath, folder, pattern) - accumulate from all layers (for selfevals, schemas)

/**
 * Create overlay resolver bound to a hierarchy map
 * @param {Object} hierarchy - The hierarchy.json content
 * @returns {Object} Resolver with selectFile and collectAll methods
 */
export function createOverlay(hierarchy) {
  return {
    /**
     * Select first matching file from layer sequence
     * @param {string} nodePath - Relative node path (e.g., 'pr09/console/hello')
     * @param {string} filename - File to find (e.g., 'index.js')
     * @returns {string|null} Absolute path to file, or null if not found
     */
    selectFile(nodePath, filename) {
      const node = hierarchy[nodePath]
      if (!node) return null

      for (const layer of node.layers) {
        const filePath = path.join(layer.path, filename)
        if (fs.existsSync(filePath)) {
          return filePath
        }
      }

      return null
    },

    /**
     * Select first matching file from underscore folder across layers
     * @param {string} nodePath - Relative node path
     * @param {string} folder - Underscore folder (e.g., '_lib', '_reqs')
     * @param {string} filename - File to find
     * @returns {string|null} Absolute path to file, or null if not found
     */
    selectFromFolder(nodePath, folder, filename) {
      const node = hierarchy[nodePath]
      if (!node) return null

      for (const layer of node.layers) {
        const filePath = path.join(layer.path, folder, filename)
        if (fs.existsSync(filePath)) {
          return filePath
        }
      }

      return null
    },

    /**
     * Collect all matching files from all layers (with overlay - same name = lower layer wins)
     * @param {string} nodePath - Relative node path
     * @param {string} folder - Underscore folder (e.g., '_reqs')
     * @param {function} filter - Filter function for filenames (default: all files)
     * @returns {Array<{name: string, path: string, layer: string}>} Collected files
     */
    collectAll(nodePath, folder, filter = () => true) {
      const node = hierarchy[nodePath]
      if (!node) return []

      const collected = new Map() // filename -> {name, path, layer}

      // Walk layers in order (highest priority first)
      for (const layer of node.layers) {
        const folderPath = path.join(layer.path, folder)
        if (!fs.existsSync(folderPath)) continue

        const files = fs.readdirSync(folderPath).filter(f => {
          const filePath = path.join(folderPath, f)
          return fs.statSync(filePath).isFile() && filter(f)
        })

        for (const file of files) {
          // Only add if not already collected (first/higher layer wins)
          if (!collected.has(file)) {
            collected.set(file, {
              name: file,
              path: path.join(folderPath, file),
              layer: layer.layer,
              layerPath: layer.path
            })
          }
        }
      }

      return Array.from(collected.values())
    },

    /**
     * Collect all files from folder across all layers (no overlay - get everything)
     * @param {string} nodePath - Relative node path
     * @param {string} folder - Underscore folder
     * @param {function} filter - Filter function for filenames
     * @returns {Array<{name: string, path: string, layer: string}>} All files from all layers
     */
    collectAllNoOverlay(nodePath, folder, filter = () => true) {
      const node = hierarchy[nodePath]
      if (!node) return []

      const collected = []

      for (const layer of node.layers) {
        const folderPath = path.join(layer.path, folder)
        if (!fs.existsSync(folderPath)) continue

        const files = fs.readdirSync(folderPath).filter(f => {
          const filePath = path.join(folderPath, f)
          return fs.statSync(filePath).isFile() && filter(f)
        })

        for (const file of files) {
          collected.push({
            name: file,
            path: path.join(folderPath, file),
            layer: layer.layer,
            layerPath: layer.path
          })
        }
      }

      return collected
    },

    /**
     * Get node info from hierarchy
     * @param {string} nodePath - Relative node path
     * @returns {Object|null} Node info or null
     */
    getNode(nodePath) {
      return hierarchy[nodePath] || null
    },

    /**
     * Get all node paths in hierarchy
     * @returns {string[]} Array of node paths
     */
    getAllNodes() {
      return Object.keys(hierarchy)
    }
  }
}

/**
 * Load hierarchy.json and create overlay resolver
 * @param {string} hierarchyPath - Path to hierarchy.json
 * @returns {Object} Overlay resolver
 */
export function loadOverlay(hierarchyPath) {
  const content = fs.readFileSync(hierarchyPath, 'utf8')
  const hierarchy = JSON.parse(content)
  return createOverlay(hierarchy)
}
