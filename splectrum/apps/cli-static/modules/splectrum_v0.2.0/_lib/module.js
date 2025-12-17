// module.js - Universal module interface
//
// The foundation lib that all execution contexts receive.
// Contains all utilities needed for basic operation plus overlay resolution.
//
// Bootstrap:
//   1. moduleBootstrap.js creates minimal bootstrap module
//   2. module.js receives bootstrap via create(module) - same signature as all libs
//   3. spl.mjs calls bindRecord(record) to bind the request record
//
// After binding, methods receive: module (single arg)
// Libs receive: module (single arg)
// Scripts receive: module (injected)
//
// Platform compatibility: Uses import maps in package.json for Node/Bare switching.
// See package.json "imports" field for mappings (fs -> bare-fs, etc.)

// ============================================================================
// Overlay Resolution
// ============================================================================

// Cached hierarchies
let splectrumHierarchy = null
const appHierarchies = new Map()

/**
 * Load splectrum hierarchy.json (lazy, cached)
 */
function loadSplectrumHierarchy(modulesDir, fs, path) {
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
function loadAppHierarchy(appModulesDir, fs, path) {
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
function checkPath(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path) {
  // 1. Check app modules first (if app overlay is enabled)
  if (enableAppOverlay && nodeRoot && appAPI) {
    const appName = appAPI.replace('spl/', '')
    const appModulesDir = path.join(nodeRoot, 'apps', appName, 'modules')
    const appHierarchy = loadAppHierarchy(appModulesDir, fs, path)

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
  const h = loadSplectrumHierarchy(modulesDir, fs, path)
  for (const layer of h.layers) {
    const filePath = path.join(modulesDir, layer.name, nodePath, subPath)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

/**
 * Read index.json from a container path
 */
function readContainerIndex(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path) {
  const indexPath = checkPath(containerPath, 'index.json', nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
  if (!indexPath) return null
  try {
    return JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Build type stack for a container.
 *
 * Stack structure:
 * 1. Type layer first: container → extends chain
 * 2. Instance layer second: instantiates → extends chain (deduped)
 *
 * Returns { stack: [...], instanceLevel: N } where instanceLevel is the
 * 1-based index where instance layer begins (for instanceRunners).
 *
 * Examples:
 * - spl (instance): { stack: [spl, spl/package, spl/container], instanceLevel: 2 }
 * - spl/package (type): { stack: [spl/package, spl/container, spl/api], instanceLevel: 3 }
 *
 * @param {string} stackType - 'full' (default), 'extends', or 'instantiates'
 *   - full: complete stack (extends + instantiates chains)
 *   - extends: only the extends chain (type inheritance)
 *   - instantiates: only the instantiates chain (instance relationship)
 */
function buildTypeStackInternal(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path, stackType = 'full') {
  const index = readContainerIndex(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)

  // Virtual method handling: no index.json means we need to find the physical method
  if (!index) {
    // Only do method resolution for instantiates mode
    if (stackType === 'instantiates') {
      const segments = containerPath.split('/')
      if (segments.length >= 2) {
        const methodName = segments[segments.length - 1]
        const parentPath = segments.slice(0, -1).join('/')

        // Build parent's instantiates chain
        const { stack: parentStack } = buildTypeStackInternal(parentPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path, 'instantiates')

        // Find which type in the chain has this method as a physical child
        for (const typePath of parentStack) {
          const methodPath = `${typePath}/${methodName}`
          const methodIndex = readContainerIndex(methodPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
          if (methodIndex) {
            // Found the physical method - return its instantiates stack
            return buildTypeStackInternal(methodPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path, 'instantiates')
          }
        }
      }
    }
    return { stack: [containerPath], instanceLevel: 1 }
  }

  // For instantiates-only, build container + instantiates chain
  // Follow instantiates type's extends chain, skipping duplicates but continuing past them
  if (stackType === 'instantiates') {
    const instantiatesStack = [containerPath]
    const visited = new Set([containerPath])
    let current = index.instantiates
    while (current) {
      if (!visited.has(current)) {
        visited.add(current)
        instantiatesStack.push(current)
      }
      const typeIndex = readContainerIndex(current, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
      if (!typeIndex || !typeIndex.extends) break
      current = typeIndex.extends
    }
    return { stack: instantiatesStack, instanceLevel: 1 }
  }

  const extendsStack = [containerPath]
  const visited = new Set([containerPath])

  // 1. Follow extends chain first (type layer)
  let current = index.extends
  while (current && !visited.has(current)) {
    visited.add(current)
    extendsStack.push(current)
    const typeIndex = readContainerIndex(current, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
    if (!typeIndex) break
    current = typeIndex.extends
  }

  // 2. Determine instance level
  // If instantiates points to something already in stack, use that position
  // Otherwise, instance layer begins after type layer
  let instanceLevel
  if (index.instantiates && visited.has(index.instantiates)) {
    // Bootstrap case: instantiates points to self or ancestor
    instanceLevel = extendsStack.indexOf(index.instantiates) + 1
  } else {
    instanceLevel = extendsStack.length + 1
  }

  // For extends-only, return just the extends chain
  if (stackType === 'extends') {
    return { stack: extendsStack, instanceLevel }
  }

  // 3. Follow instantiates chain (instance layer), then extends from there
  const instantiatesStack = []
  current = index.instantiates
  while (current && !visited.has(current)) {
    visited.add(current)
    instantiatesStack.push(current)
    const typeIndex = readContainerIndex(current, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
    if (!typeIndex) break
    current = typeIndex.extends
  }

  // Full stack: extends + instantiates
  return { stack: [...extendsStack, ...instantiatesStack], instanceLevel }
}

/**
 * Resolve a file through overlay layers, following type stack.
 * For method paths (spl/whoami): split into container + method, search type stack
 * For file paths (spl/container/_lib/x.js): search type stack directly
 *
 * Virtual container support: if container doesn't exist (no index.json),
 * use spl/container stack. Virtual containers only get base container functionality.
 */
function resolveOverlay(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path) {
  // Direct check first
  const direct = checkPath(nodePath, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
  if (direct) return direct

  // Determine if this is a method path or a container/file path
  // Method path: nodePath is container/method, looking for method's index.js
  // Container path: nodePath is a container, looking for its own file (index.js, _lib/x.js, etc.)
  //
  // Heuristic: if nodePath has an index.json, it's a container. Otherwise treat as method.
  const segments = nodePath.split('/')
  const nodeIndex = readContainerIndex(nodePath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)

  if (!nodeIndex && segments.length >= 2) {
    // Method resolution: nodePath doesn't exist as container, treat last segment as method name
    const methodName = segments[segments.length - 1]
    const containerPath = segments.slice(0, -1).join('/')

    // Check if container exists (has index.json)
    const containerIndex = readContainerIndex(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)

    let stack
    if (containerIndex) {
      // Container exists - use its type stack
      stack = buildTypeStackInternal(containerPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path).stack
    } else {
      // Virtual container - only spl/container functionality available
      stack = buildTypeStackInternal('spl/container', nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path).stack
    }

    for (const typeName of stack) {
      const found = checkPath(`${typeName}/${methodName}`, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
      if (found) return found
    }
  } else {
    // File resolution: nodePath is a container, search type stack for the file
    const { stack } = buildTypeStackInternal(nodePath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
    for (const typeName of stack) {
      const found = checkPath(typeName, subPath, nodeRoot, appAPI, enableAppOverlay, modulesDir, fs, path)
      if (found) return found
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
function findUniqueFilename(folder, filename, dedupe, fs, path) {
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
 * Create module interface from bootstrap module.
 *
 * Same signature as all libs: create(module)
 * The bootstrap module provides minimal functionality for initialization.
 * Call bindRecord() to bind a request record for full functionality.
 *
 * @param {Object} bootstrapModule - Bootstrap module from moduleBootstrap.js
 * @returns {Object} - Module interface
 */
export function create(bootstrapModule) {
  // Platform modules - loaded via bootstrap, cached here
  let _fs = null
  let _path = null

  const getFs = async () => {
    if (!_fs) _fs = await bootstrapModule.require('fs')
    return _fs
  }

  const getPath = async () => {
    if (!_path) _path = await bootstrapModule.require('path')
    return _path
  }

  // Record binding - starts null, set via bindRecord()
  let record = null

  // Context getters - delegate to bootstrap until record is bound
  const getNodeRoot = () => {
    if (record?.headers?.spl?.runtime?.nodeRoot) {
      return record.headers.spl.runtime.nodeRoot
    }
    return bootstrapModule.getNodeRoot()
  }

  const getAppAPI = () => {
    if (record?.headers?.spl?.runtime?.appAPI) {
      return record.headers.spl.runtime.appAPI
    }
    return bootstrapModule.getAppAPI()
  }

  const getAppName = () => getAppAPI()?.replace('spl/', '')

  const getEnableAppOverlay = () => {
    if (record) {
      const appName = getAppName()
      return appName ? record.headers.spl?.[appName]?.enableAppOverlay : false
    }
    return bootstrapModule.getEnableAppOverlay()
  }

  const getModulesDir = () => {
    if (record?.headers?.spl?.runtime?.nodeRoot) {
      return _path ? _path.join(record.headers.spl.runtime.nodeRoot, 'modules') : null
    }
    return bootstrapModule.getModulesDir()
  }

  // The module interface
  return {
    // ========================================================================
    // Initialization
    // ========================================================================

    /**
     * Initialize platform modules (fs, path).
     * Must be called before using resolve, faf, consumeLatest, etc.
     * Typically called right after loadModule() returns.
     */
    async init() {
      await getFs()
      await getPath()
    },

    /**
     * Bind a request record to this module.
     * After binding, record-dependent methods become functional.
     * @param {Object} requestRecord - The request record
     */
    bindRecord(requestRecord) {
      record = requestRecord
    },

    /**
     * Create a new module instance bound to a different record.
     * Reuses the same bootstrap module and platform modules.
     * Useful for processing multiple requests with separate state.
     * @param {Object} requestRecord - The request record for the new instance
     * @returns {Promise<Object>} - New module instance
     */
    async createForRecord(requestRecord) {
      // Create new instance from same bootstrap
      const newModule = create(bootstrapModule)
      await newModule.init()
      newModule.bindRecord(requestRecord)
      return newModule
    },

    // ========================================================================
    // Module Resolution
    // ========================================================================

    /**
     * Require a module - handles three types:
     * 1. Platform modules: 'fs', 'path' - direct import (package.json handles mapping)
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
      const fs = await getFs()
      const path = await getPath()

      // 1. Platform modules and npm packages (no slashes)
      //    - Platform modules: package.json import maps handle Node/Bare switching
      //    - npm packages: need import attributes on Bare for Node.js compatibility
      if (!uri.includes('/')) {
        const isBare = typeof Bare !== 'undefined'
        if (isBare) {
          // On Bare, use import attributes for npm packages to get Node.js builtins mapped
          return import(uri, { with: { imports: 'bare-node-runtime/imports' } }).then(m => m.default ?? m)
        }
        return import(uri).then(m => m.default ?? m)
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
          libFilePath = this.resolve(containerPath, `_lib/${libFile}`)
        } else {
          // Container's main lib: lib/spl/container/selfeval -> spl/container/selfeval/_lib/selfeval.js
          const parts = libPath.split('/')
          const libName = parts[parts.length - 1]
          libFilePath = this.resolve(libPath, `_lib/${libName}.js`)
        }

        if (!libFilePath) {
          throw new Error(`Lib not found in any layer: ${uri}`)
        }
        const mod = await import(libFilePath)
        return mod.create(this)
      }

      // 3. Inline script
      if (uri === 'spl/script/inline') {
        const scriptContent = record.headers.spl.request.script
        return this._createScriptExecutable(scriptContent)
      }

      // 4. Script file (absolute path)
      if (uri.startsWith('/')) {
        const scriptContent = fs.readFileSync(uri, 'utf-8')
        return this._createScriptExecutable(scriptContent)
      }

      // 5. Commands (pkg/api/method) - resolve via overlay
      const modulePath = this.resolve(uri, 'index.js')
      if (!modulePath) {
        throw new Error(`Module not found in any layer: ${uri}`)
      }
      const mod = await import(modulePath)

      // Methods export default function
      if (typeof mod.default === 'function') {
        const self = this
        return {
          async invoke() {
            await mod.default(self)
          }
        }
      }

      // Fallback for create() pattern (libs)
      return mod.create(this)
    },

    /**
     * Resolve a path through overlay (without instantiation)
     * @param {string} nodePath - Container path (e.g., 'spl/container')
     * @param {string} filename - File to resolve (e.g., 'README.json')
     * @returns {string|null} - Absolute path or null if not found
     */
    resolve(nodePath, filename) {
      if (!_fs || !_path) return null
      const modulesDir = getModulesDir()
      if (!modulesDir) return null
      return resolveOverlay(nodePath, filename, getNodeRoot(), getAppAPI(), getEnableAppOverlay(), modulesDir, _fs, _path)
    },

    /**
     * Build type stack for a container
     * @param {string} containerPath - Container path (e.g., 'spl/container')
     * @param {string} stackType - 'full' (default), 'extends', or 'instantiates'
     * @returns {{ stack: string[], instanceLevel: number }} - Type stack and instance level
     */
    buildTypeStack(containerPath, stackType = 'full') {
      if (!_fs || !_path) return { stack: [containerPath], instanceLevel: 1 }
      const modulesDir = getModulesDir()
      if (!modulesDir) return { stack: [containerPath], instanceLevel: 1 }
      return buildTypeStackInternal(containerPath, getNodeRoot(), getAppAPI(), getEnableAppOverlay(), modulesDir, _fs, _path, stackType)
    },

    // ========================================================================
    // Input/Output
    // ========================================================================

    /**
     * Get record data (value)
     * Returns the actual object - callers can set properties directly
     * @returns {Object}
     */
    getData() {
      return record.value
    },

    /**
     * Set record data (value)
     * Replaces the entire data object (use null to clear)
     * @param {Object|null} value - New data value
     */
    setData(value) {
      record.value = value
    },

    /**
     * Get record metadata (headers)
     * Returns the actual object - callers can set properties directly
     * @returns {Object}
     */
    getMetaData() {
      return record.headers
    },

    /**
     * Get input from record
     * @returns {Object}
     */
    input() {
      return record?.headers?.spl?.request?.input || {}
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
      const input = record?.headers?.spl?.request?.input || {}
      const meta = input.meta

      if (meta === undefined || meta === true) return 'detail'
      if (['topline', 'summary', 'detail', 'enriched', 'report'].includes(meta)) return meta
      return 'detail'
    },

    /**
     * Get report level from --report flag
     * @returns {string|null} - null|'topline'|'summary'|'detail'|'enriched'
     */
    getReportLevel() {
      const input = record?.headers?.spl?.request?.input || {}
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
      if (!nodeRoot || !_fs || !_path) return null

      // Clone immediately - record may mutate before async write completes
      const recordClone = JSON.parse(JSON.stringify(record))

      // Generate filename if not provided
      const timestamp = record.headers.spl.request.timeReceived || Date.now()
      const filename = options.filename || `${timestamp}.json`

      // Resolve destination relative to node root
      const destPath = _path.isAbsolute(destination)
        ? destination
        : _path.join(nodeRoot, destination)

      // Ensure directory exists
      _fs.mkdirSync(destPath, { recursive: true })

      // Find unique filename
      const finalFilename = findUniqueFilename(destPath, filename, options.dedupe, _fs, _path)

      const filePath = _path.join(destPath, finalFilename)
      const recordJson = JSON.stringify(recordClone, null, 2)

      if (options.sync) {
        _fs.writeFileSync(filePath, recordJson, 'utf-8')
      } else {
        _fs.writeFile(filePath, recordJson, 'utf-8', (err) => {
          if (err) this.raiseAsyncError(err, { operation: 'faf', destination, filePath })
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
      if (!nodeRoot || !_fs || !_path) return null

      const topicPath = _path.isAbsolute(topic)
        ? topic
        : _path.join(nodeRoot, topic)

      if (!_fs.existsSync(topicPath)) return null

      const files = _fs.readdirSync(topicPath)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse()

      if (files.length === 0) return null

      const latestPath = _path.join(topicPath, files[0])
      const content = _fs.readFileSync(latestPath, 'utf-8')
      return JSON.parse(content)
    },

    // ========================================================================
    // Runtime Access
    // ========================================================================

    /**
     * Get node root from record (or bootstrap)
     * @returns {string|null}
     */
    getNodeRoot,

    /**
     * Get the modules directory
     * @returns {string|null}
     */
    getModulesDir,

    /**
     * Get the record's unique identifier
     * @returns {string}
     */
    getRecordId() {
      return String(record?.headers?.spl?.request?.timeReceived || '')
    },

    /**
     * Get current app API
     * @returns {string|null}
     */
    getAppAPI,

    /**
     * Get current app name
     * @returns {string|null}
     */
    getAppName,

    /**
     * Get the request method path
     * @returns {string}
     */
    getMethod() {
      return record?.headers?.spl?.request?.method
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
    raiseAsyncError(error, context = {}) {
      const nodeRoot = getNodeRoot()
      if (!nodeRoot || !_fs || !_path) return

      const errorRecord = JSON.parse(JSON.stringify(record))
      errorRecord.headers.spl.error = {
        timestamp: Date.now(),
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
        async: true
      }

      const errorPath = _path.join(nodeRoot, 'runtime/error')
      _fs.mkdirSync(errorPath, { recursive: true })

      const filename = `${Date.now()}.json`
      const finalFilename = findUniqueFilename(errorPath, filename, 'numeric-digit', _fs, _path)

      _fs.writeFile(
        _path.join(errorPath, finalFilename),
        JSON.stringify(errorRecord, null, 2),
        'utf-8',
        () => {}
      )
    },

    /**
     * Mark request as completed successfully
     */
    completeRequest() {
      record.headers.spl.request.completed = true
    },

    // ========================================================================
    // Internal Helpers
    // ========================================================================

    /**
     * Create script executable (internal)
     * @param {string} scriptContent - Script source code
     * @returns {Object} - Executable with invoke() method
     */
    _createScriptExecutable(scriptContent) {
      const self = this
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const fn = new AsyncFunction('module', scriptContent)
      return {
        async invoke() {
          await fn(self)
        }
      }
    }
  }
}
