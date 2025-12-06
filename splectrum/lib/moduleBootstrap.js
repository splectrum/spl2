// moduleBootstrap.js - Bootstrap for requiring splectrum and platform modules
//
// requireSpl(uri, record) → object (async)
//   - lib/...           → bound utility object
//   - pkg/api/method    → { invoke() } via overlay
//   - /absolute/path    → { invoke() } script file
//   - spl/script/inline → { invoke() } inline script from record
//
// requireNonSpl(moduleName) → platform module
// createOverlay(hierarchy) → overlay resolver
// loadOverlay(hierarchyPath) → overlay resolver from file

// Pre-load platform modules (sync at module load time)
import * as fsModule from 'fs'
import * as pathModule from 'path'
import { fileURLToPath } from 'url'

// Registry of platform modules used in splectrum
// Key must exist to require - enforces explicit registration
// Values will be Bare equivalents when we implement platform switch
const platformModules = {
  'fs': fsModule.default ?? fsModule,
  'path': pathModule.default ?? pathModule
}

const fs = platformModules['fs']
const path = platformModules['path']

// Derive modules folder from this file's location (sibling to lib/)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modulesDir = path.join(__dirname, '..', 'modules')

// Cached hierarchy
let hierarchy = null

/**
 * Load hierarchy.json from modules folder (lazy, cached)
 * @returns {Object} Hierarchy with layers array
 */
function loadHierarchy() {
  if (hierarchy) {
    return hierarchy
  }

  const hierarchyPath = path.join(modulesDir, 'hierarchy.json')
  if (!fs.existsSync(hierarchyPath)) {
    throw new Error(`hierarchy.json not found: ${hierarchyPath}`)
  }

  hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'))
  return hierarchy
}

// Cached app hierarchies by app name
const appHierarchies = new Map()

/**
 * Load app hierarchy.json (lazy, cached)
 * @param {string} appModulesDir - App modules directory path
 * @returns {Object|null} Hierarchy with layers array, or null if not found
 */
function loadAppHierarchy(appModulesDir) {
  if (appHierarchies.has(appModulesDir)) {
    return appHierarchies.get(appModulesDir)
  }

  const hierarchyPath = path.join(appModulesDir, 'hierarchy.json')
  if (!fs.existsSync(hierarchyPath)) {
    appHierarchies.set(appModulesDir, null)
    return null
  }

  const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'))
  appHierarchies.set(appModulesDir, hierarchy)
  return hierarchy
}

/**
 * Check a single path in app modules and splectrum modules
 * @param {string} nodePath - Module node path
 * @param {string} subPath - Path within node
 * @param {string} nodeRoot - Node root path
 * @param {string} appAPI - App API (e.g., 'spl/cli-static')
 * @param {boolean} enableAppOverlay - Whether app overlay is enabled
 * @returns {string|null} Absolute path to file, or null if not found
 */
function checkPath(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay) {
  // 1. Check app modules first (if app overlay is enabled)
  if (enableAppOverlay && nodeRoot && appAPI) {
    const appName = appAPI.replace('spl/', '')
    const appModulesDir = path.join(nodeRoot, 'apps', appName, 'modules')
    const appHierarchy = loadAppHierarchy(appModulesDir)

    if (appHierarchy) {
      for (const layer of appHierarchy.layers) {
        const appFilePath = path.join(appModulesDir, layer.name, nodePath, subPath)
        if (fs.existsSync(appFilePath)) {
          return appFilePath
        }
      }
    }
  }

  // 2. Fall back to splectrum modules
  const h = loadHierarchy()
  for (const layer of h.layers) {
    const filePath = path.join(modulesDir, layer.name, nodePath, subPath)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

/**
 * Read README.json from a container path
 * @param {string} containerPath - Container path (e.g., 'spl/api')
 * @param {string} nodeRoot - Node root path
 * @param {string} appAPI - App API
 * @param {boolean} enableAppOverlay - Whether app overlay is enabled
 * @returns {Object|null} Parsed README.json or null
 */
function readContainerReadme(containerPath, nodeRoot, appAPI, enableAppOverlay) {
  const readmePath = checkPath(containerPath, 'README.json', nodeRoot, appAPI, enableAppOverlay)
  if (!readmePath) return null
  try {
    return JSON.parse(fs.readFileSync(readmePath, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Resolve a file through overlay layers, following implements then extends chain
 * @param {string} nodePath - Module node path (e.g., 'spl/dev/cycle')
 * @param {string} subPath - Path within node (e.g., 'index.js' or '_lib/spl.js')
 * @param {Object} record - Record with runtime context
 * @returns {string|null} Absolute path to file, or null if not found
 */
function resolveOverlay(nodePath, subPath, record) {
  const nodeRoot = record?.headers?.spl?.runtime?.nodeRoot
  const appAPI = record?.headers?.spl?.runtime?.appAPI

  // Get enableAppOverlay from app state (appAPI is 'spl/cli-static', header key is 'cli-static')
  const appName = appAPI?.replace('spl/', '')
  const enableAppOverlay = appName ? record?.headers?.spl?.[appName]?.enableAppOverlay : false

  // Direct check first
  const direct = checkPath(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay)
  if (direct) return direct

  // If looking for a method (path has 3+ segments like spl/api/whoami), follow inheritance
  const segments = nodePath.split('/')
  if (segments.length >= 3) {
    const methodName = segments[segments.length - 1]
    let containerPath = segments.slice(0, -1).join('/')
    const visited = new Set()

    while (containerPath && !visited.has(containerPath)) {
      visited.add(containerPath)
      const readme = readContainerReadme(containerPath, nodeRoot, appAPI, enableAppOverlay)
      if (!readme) break

      // Check implements first (instance -> type)
      if (readme.implements) {
        const typeMethodPath = `${readme.implements}/${methodName}`
        const found = checkPath(typeMethodPath, subPath, nodeRoot, appAPI, enableAppOverlay)
        if (found) return found
        // Continue from the type
        containerPath = readme.implements
        continue
      }

      // Then check extends (type -> parent type)
      if (readme.extends) {
        const parentMethodPath = `${readme.extends}/${methodName}`
        const found = checkPath(parentMethodPath, subPath, nodeRoot, appAPI, enableAppOverlay)
        if (found) return found
        // Continue up the chain
        containerPath = readme.extends
        continue
      }

      break
    }
  }

  return null
}

/**
 * Create executable wrapper for script content
 * @param {string} scriptContent - Script source code
 * @param {Object} record - Record to bind
 * @returns {Object} Object with invoke() method
 */
async function createScriptExecutable(scriptContent, record) {
  const spl = await requireSpl('lib/spl', record)
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  const fn = new AsyncFunction('record', 'spl', 'requireSpl', 'requireNonSpl', scriptContent)

  return {
    async invoke() {
      await fn(record, spl, requireSpl, requireNonSpl)
    }
  }
}


/**
 * Require a splectrum lib, module, or script
 * @param {string} uri - 'lib/spl', 'pkg/api/method', '/path/to/script.js', or 'spl/script/inline'
 * @param {Object} record - Record to bind
 * @returns {Promise<Object>} - Bound object or executable with invoke()
 */
export async function requireSpl(uri, record) {
  // 1. Lib resolution
  if (uri.startsWith('lib/')) {
    const libPath = uri.replace('lib/', '')
    const parts = libPath.split('/')
    const libName = parts[parts.length - 1]
    const mod = await import(`../modules/bm_spl/${libPath}/_lib/${libName}.js`)
    return mod.create(record, { requireNonSpl })
  }

  // 2. Inline script
  if (uri === 'spl/script/inline') {
    const scriptContent = record.headers.spl.request.script
    return createScriptExecutable(scriptContent, record)
  }

  // 3. Script file (absolute path)
  if (uri.startsWith('/')) {
    const scriptContent = fs.readFileSync(uri, 'utf-8')
    return createScriptExecutable(scriptContent, record)
  }

  // 4. Module method (pkg/api/method) - resolve via overlay
  const modulePath = resolveOverlay(uri, 'index.js', record)
  if (!modulePath) {
    throw new Error(`Module not found in any layer: ${uri}`)
  }
  const mod = await import(modulePath)
  // Methods export default function, not create()
  if (typeof mod.default === 'function') {
    // Create bound resolveSpl for this record
    const boundResolveSpl = (nodePath, filename) => resolveSpl(nodePath, filename, record)
    return {
      async invoke() {
        await mod.default(record, requireSpl, boundResolveSpl)
      }
    }
  }
  // Fallback for create() pattern (libs, older modules)
  return mod.create(record, { requireSpl })
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

/**
 * Resolve a splectrum path to filesystem path (without instantiation)
 * @param {string} nodePath - Module node path (e.g., 'spl/container')
 * @param {string} filename - File to resolve (e.g., 'README.json')
 * @param {Object} record - Record with runtime context
 * @returns {string|null} Absolute path to file, or null if not found
 */
export function resolveSpl(nodePath, filename, record) {
  return resolveOverlay(nodePath, filename, record)
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
