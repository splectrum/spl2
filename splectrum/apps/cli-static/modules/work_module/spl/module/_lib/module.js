// module.js - Universal module interface
//
// The foundation lib that all execution contexts receive.
// Contains all utilities needed for basic operation plus overlay resolution.
//
// Bootstrap creates this bound to record, passes to all contexts.
// Methods receive: module (single arg)
// Libs receive: module (single arg)
// Scripts receive: module (injected)
//
// Platform compatibility: Uses import maps in package.json for Node/Bare switching.
// See package.json "imports" field for mappings (fs -> bare-fs, etc.)

// ============================================================================
// Platform Modules (via import maps - package.json handles Node/Bare switching)
// ============================================================================

const fs = await import('fs').then(m => m.default ?? m)
const path = await import('path').then(m => m.default ?? m)
const url = await import('url').then(m => m.default ?? m)

// Platform modules cache - loaded on demand
const platformModules = { fs, path, url }

// Known platform modules (can be loaded via module.require)
const knownPlatformModules = ['fs', 'path', 'os', 'url', 'crypto', 'events']

// ============================================================================
// Overlay Resolution (brought into library from bootstrap)
// ============================================================================

// Cached hierarchies
let splectrumHierarchy = null
const appHierarchies = new Map()

/**
 * Load splectrum hierarchy.json (lazy, cached)
 */
function loadSplectrumHierarchy(modulesDir) {
  if (splectrumHierarchy) return splectrumHierarchy

  const hierarchyPath = path.join(modulesDir, 'hierarchy.json')
  if (!fs.existsSync(hierarchyPath)) {
    throw new Error(`hierarchy.json not found: ${hierarchyPath}`)
  }

  splectrumHierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'))
  return splectrumHierarchy
}

/**
 * Load app hierarchy.json (lazy, cached)
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
 */
function checkPath(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir) {
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
  const h = loadSplectrumHierarchy(modulesDir)
  for (const layer of h.layers) {
    const filePath = path.join(modulesDir, layer.name, nodePath, subPath)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

/**
 * Read container identity (index.json) from a container path
 */
function readContainerIdentity(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir) {
  const identityPath = checkPath(containerPath, 'index.json', nodeRoot, appAPI, enableAppOverlay, modulesDir)
  if (!identityPath) return null
  try {
    return JSON.parse(fs.readFileSync(identityPath, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Resolve a file through overlay layers, following instantiates then extends chain
 */
function resolveOverlay(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir) {
  // Direct check first
  const direct = checkPath(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir)
  if (direct) return direct

  // If looking for a method (path has 3+ segments like spl/api/whoami), follow inheritance
  const segments = nodePath.split('/')
  if (segments.length >= 3) {
    const methodName = segments[segments.length - 1]
    let containerPath = segments.slice(0, -1).join('/')
    const visited = new Set()

    while (containerPath && !visited.has(containerPath)) {
      visited.add(containerPath)
      const identity = readContainerIdentity(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir)
      if (!identity) break

      // Check instantiates first (instance -> type)
      if (identity.instantiates) {
        const typeMethodPath = `${identity.instantiates}/${methodName}`
        const found = checkPath(typeMethodPath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir)
        if (found) return found
        // Continue from the type
        containerPath = identity.instantiates
        continue
      }

      // Then check extends (type -> parent type)
      if (identity.extends) {
        const parentMethodPath = `${identity.extends}/${methodName}`
        const found = checkPath(parentMethodPath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir)
        if (found) return found
        // Continue up the chain
        containerPath = identity.extends
        continue
      }

      break
    }
  }

  return null
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Find unique filename using dedupe algorithm
 */
function findUniqueFilename(folder, filename, dedupe) {
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)

  if (dedupe === 'numeric-digit') {
    for (let digit = 0; digit < 1000; digit++) {
      const candidate = `${base}${digit}${ext}`
      const candidatePath = path.join(folder, candidate)
      if (!fs.existsSync(candidatePath)) {
        return candidate
      }
    }
    throw new Error(`Dedupe exhausted: could not find unique filename for ${filename}`)
  }

  // Default: try original first, then append digits
  const targetPath = path.join(folder, filename)
  if (!fs.existsSync(targetPath)) {
    return filename
  }

  for (let digit = 0; digit < 1000; digit++) {
    const candidate = `${base}${digit}${ext}`
    const candidatePath = path.join(folder, candidate)
    if (!fs.existsSync(candidatePath)) {
      return candidate
    }
  }
  throw new Error(`Dedupe exhausted: could not find unique filename for ${filename}`)
}

// ============================================================================
// Module Factory
// ============================================================================

/**
 * Create module interface bound to record
 *
 * @param {Object} record - The request record
 * @returns {Object} - Bound module interface
 */
export function create(record) {
  // Dynamic getters - read from record each time (record may be mutated after module creation)
  const getNodeRoot = () => record.headers.spl.runtime.nodeRoot
  const getAppAPI = () => record.headers.spl.runtime.appAPI
  const getAppName = () => getAppAPI()?.replace('spl/', '')
  const getEnableAppOverlay = () => {
    const appName = getAppName()
    return appName ? record.headers.spl?.[appName]?.enableAppOverlay : false
  }
  const getModulesDir = () => {
    const nodeRoot = getNodeRoot()
    return nodeRoot ? path.join(nodeRoot, 'modules') : null
  }

  // Forward reference to module interface (needed for closures in require/scripts)
  let moduleRef = null
  const getModuleRef = () => moduleRef

  // Internal resolve function
  const internalResolve = (nodePath, filename) => {
    const modulesDir = getModulesDir()
    if (!modulesDir) return null
    return resolveOverlay(nodePath, filename, getNodeRoot(), getAppAPI(), getEnableAppOverlay(), modulesDir)
  }

  // Internal require function
  const internalRequire = async (uri) => {
    // 1. Platform modules (no slashes, known module name)
    if (!uri.includes('/') && knownPlatformModules.includes(uri)) {
      // Check cache first
      if (!(uri in platformModules)) {
        platformModules[uri] = await import(uri).then(m => m.default ?? m)
      }
      return platformModules[uri]
    }

    // 2. Splectrum libs:
    //    lib/spl/container/selfeval    -> spl/container/selfeval/_lib/selfeval.js (container's main lib)
    //    lib/spl/container/report.js   -> spl/container/_lib/report.js (direct lib file)
    if (uri.startsWith('lib/')) {
      const libPath = uri.replace('lib/', '')
      let libFilePath

      if (libPath.endsWith('.js')) {
        // Direct lib file: lib/spl/container/report.js -> spl/container/_lib/report.js
        const parts = libPath.split('/')
        const libFile = parts.pop() // e.g. "report.js"
        const containerPath = parts.join('/') // e.g. "spl/container"
        libFilePath = internalResolve(containerPath, `_lib/${libFile}`)
      } else {
        // Container's main lib: lib/spl/container/selfeval -> spl/container/selfeval/_lib/selfeval.js
        const parts = libPath.split('/')
        const libName = parts[parts.length - 1]
        libFilePath = internalResolve(libPath, `_lib/${libName}.js`)
      }

      if (!libFilePath) {
        throw new Error(`Lib not found in any layer: ${uri}`)
      }
      const mod = await import(libFilePath)
      return mod.create(getModuleRef())
    }

    // 3. Inline script
    if (uri === 'spl/script/inline') {
      const scriptContent = record.headers.spl.request.script
      return createScriptExecutable(scriptContent)
    }

    // 4. Script file (absolute path)
    if (uri.startsWith('/')) {
      const scriptContent = fs.readFileSync(uri, 'utf-8')
      return createScriptExecutable(scriptContent)
    }

    // 5. Commands (pkg/api/method) - resolve via overlay
    const modulePath = internalResolve(uri, 'index.js')
    if (!modulePath) {
      throw new Error(`Module not found in any layer: ${uri}`)
    }
    const mod = await import(modulePath)

    // Methods export default function
    if (typeof mod.default === 'function') {
      return {
        async invoke() {
          await mod.default(getModuleRef())
        }
      }
    }

    // Fallback for create() pattern (libs)
    return mod.create(getModuleRef())
  }

  // Raise async error - defined early so it can be used in callbacks
  const raiseAsyncError = (error, context = {}) => {
    const nodeRoot = getNodeRoot()
    if (!nodeRoot) return

    const errorRecord = JSON.parse(JSON.stringify(record))
    errorRecord.headers.spl.error = {
      timestamp: Date.now(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      async: true
    }

    const errorPath = path.join(nodeRoot, 'runtime/error')
    fs.mkdirSync(errorPath, { recursive: true })

    const filename = `${Date.now()}.json`
    const finalFilename = findUniqueFilename(errorPath, filename, 'numeric-digit')

    fs.writeFile(
      path.join(errorPath, finalFilename),
      JSON.stringify(errorRecord, null, 2),
      'utf-8',
      () => {}
    )
  }

  // Script executable factory
  const createScriptExecutable = (scriptContent) => {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
    const fn = new AsyncFunction('module', scriptContent)
    return {
      async invoke() {
        await fn(getModuleRef())
      }
    }
  }

  // The module interface
  moduleRef = {
    // ========================================================================
    // Input/Output
    // ========================================================================

    /**
     * Get input from record
     * @returns {Object}
     */
    input() {
      return record.headers.spl.request.input || {}
    },

    /**
     * Set input flag on record
     * @param {string} key - Flag name
     * @param {*} value - Flag value (true to set, undefined to delete)
     */
    setInputFlag(key, value) {
      if (!record.headers.spl.request.input) {
        record.headers.spl.request.input = {}
      }
      if (value === undefined) {
        delete record.headers.spl.request.input[key]
      } else {
        record.headers.spl.request.input[key] = value
      }
    },

    /**
     * Set output pair on record
     * @param {string} freetext - Freetext output (narrative)
     * @param {*} structured - Structured output (data for parsing/chaining)
     */
    output(freetext, structured) {
      record.headers.spl.request.metaoutput = freetext
      record.headers.spl.request.output = structured
    },

    /**
     * Get meta level from --meta flag
     * @returns {string} - 'topline'|'summary'|'detail'|'enriched'|'report'
     */
    getMetaLevel() {
      const input = record.headers.spl.request.input || {}
      const meta = input.meta

      if (meta === undefined || meta === true) return 'summary'
      if (['topline', 'summary', 'detail', 'enriched', 'report'].includes(meta)) return meta
      return 'summary'
    },

    /**
     * Get report level from --report flag
     * @returns {string|null} - null|'topline'|'summary'|'detail'|'enriched'
     */
    getReportLevel() {
      const input = record.headers.spl.request.input || {}
      const report = input.report

      if (report === undefined) return null
      if (report === true) return 'summary'
      if (['topline', 'summary', 'detail', 'enriched'].includes(report)) return report
      return 'summary'
    },

    /**
     * Get detail level - max of meta and report levels
     * Methods use this to know what depth of content to build.
     * @returns {string} - 'topline'|'summary'|'detail'|'enriched'
     */
    getDetailLevel() {
      const levelOrder = ['topline', 'summary', 'detail', 'enriched']

      const metaLevel = this.getMetaLevel()
      const reportLevel = this.getReportLevel()

      // meta=report means echo structured, so use reportLevel for depth
      const effectiveMetaLevel = metaLevel === 'report' ? (reportLevel || 'summary') : metaLevel

      const metaIdx = levelOrder.indexOf(effectiveMetaLevel)
      const reportIdx = reportLevel ? levelOrder.indexOf(reportLevel) : -1

      return levelOrder[Math.max(metaIdx, reportIdx)]
    },

    /**
     * Extract output pair from another record and set on this record
     * @param {Object} sourceRecord - Record to extract output from
     */
    extractOutput(sourceRecord) {
      record.headers.spl.request.metaoutput = sourceRecord.headers.spl.request.metaoutput
      record.headers.spl.request.output = sourceRecord.headers.spl.request.output
    },

    /**
     * Snapshot the record state (deep clone)
     * @returns {Object} - Cloned record
     */
    snapshotRecord() {
      return JSON.parse(JSON.stringify(record))
    },

    /**
     * Restore record state from snapshot
     * @param {Object} snapshot - Previously snapshotted record
     */
    restoreRecord(snapshot) {
      Object.assign(record, JSON.parse(JSON.stringify(snapshot)))
    },

    // ========================================================================
    // Module Resolution
    // ========================================================================

    /**
     * Require a module - handles three types:
     * 1. Platform modules: 'fs', 'path' - returns platform module directly
     * 2. Splectrum libs: 'lib/spl' - returns bound lib instance
     * 3. Commands: 'spl/container/whoami' - returns { invoke() }
     *
     * Also handles scripts:
     * - 'spl/script/inline' - inline script from record
     * - '/absolute/path' - script file
     *
     * @param {string} uri - Module URI
     * @returns {Promise<Object>} - Loaded module, lib instance, or executable
     */
    async require(uri) {
      return internalRequire(uri)
    },

    /**
     * Resolve a path through overlay (without instantiation)
     * @param {string} nodePath - Container path (e.g., 'spl/container')
     * @param {string} filename - File to resolve (e.g., 'README.json')
     * @returns {string|null} - Absolute path or null if not found
     */
    resolve(nodePath, filename) {
      return internalResolve(nodePath, filename)
    },

    // ========================================================================
    // Fire and Forget / State Management
    // ========================================================================

    /**
     * Fire and Forget - write record to destination
     *
     * @param {string} destination - Target folder path
     * @param {Object} options - Options
     * @param {string} options.filename - Optional filename (default: timestamp-based)
     * @param {string} options.dedupe - Dedupe mode: 'numeric-digit' or undefined
     * @param {boolean} options.sync - Use sync fs operations (for pre-exit writes)
     * @returns {string} - Path where record was written
     */
    faf(destination, options = {}) {
      const nodeRoot = getNodeRoot()
      if (!nodeRoot) return null

      // Clone immediately - record may mutate before async write completes
      const recordClone = JSON.parse(JSON.stringify(record))

      // Generate filename if not provided
      const timestamp = record.headers.spl.request.timeReceived || Date.now()
      const filename = options.filename || `${timestamp}.json`

      // Resolve destination relative to node root
      const destPath = path.isAbsolute(destination)
        ? destination
        : path.join(nodeRoot, destination)

      // Ensure directory exists
      fs.mkdirSync(destPath, { recursive: true })

      // Find unique filename
      const finalFilename = findUniqueFilename(destPath, filename, options.dedupe)

      const filePath = path.join(destPath, finalFilename)
      const recordJson = JSON.stringify(recordClone, null, 2)

      if (options.sync) {
        fs.writeFileSync(filePath, recordJson, 'utf-8')
      } else {
        fs.writeFile(filePath, recordJson, 'utf-8', (err) => {
          if (err) raiseAsyncError(err, { operation: 'faf', destination, filePath })
        })
      }

      return filePath
    },

    /**
     * Consume Latest - read most recent record from topic folder
     *
     * @param {string} topic - Topic folder path (relative to nodeRoot or absolute)
     * @returns {Object|null} - Parsed record or null if topic empty/missing
     */
    consumeLatest(topic) {
      const nodeRoot = getNodeRoot()
      if (!nodeRoot) return null

      const topicPath = path.isAbsolute(topic)
        ? topic
        : path.join(nodeRoot, topic)

      if (!fs.existsSync(topicPath)) return null

      const files = fs.readdirSync(topicPath)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse()

      if (files.length === 0) return null

      const latestPath = path.join(topicPath, files[0])
      const content = fs.readFileSync(latestPath, 'utf-8')
      return JSON.parse(content)
    },

    // ========================================================================
    // Runtime Access
    // ========================================================================

    /**
     * Get node root from record
     * @returns {string|null}
     */
    getNodeRoot,

    /**
     * Get the record's unique identifier
     * @returns {string}
     */
    getRecordId() {
      return String(record.headers.spl.request.timeReceived)
    },

    /**
     * Get current app API
     * @returns {string|null}
     */
    getAppAPI,

    /**
     * Get the request method path
     * @returns {string}
     */
    getMethod() {
      return record.headers.spl.request.method
    },

    // ========================================================================
    // Error Handling
    // ========================================================================

    /**
     * Raise a sync error - sets error on record
     * @param {string} message - Error message
     */
    raiseError(message) {
      record.headers.spl.runtime.error = message
      record.headers.spl.request.completed = true
    },

    /**
     * Raise an async error - FAF to error folder
     * @param {Error} error - The error object
     * @param {Object} context - Additional context
     */
    raiseAsyncError,

    /**
     * Mark request as completed successfully
     */
    completeRequest() {
      record.headers.spl.request.completed = true
    }
  }

  return moduleRef
}
