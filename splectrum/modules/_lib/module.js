// module.js - Universal module interface
//
// The foundation lib that all execution contexts receive.
// Contains all utilities needed for basic operation.
//
// Bootstrap creates this bound to record, passes to all contexts.

import fs from 'fs'
import path from 'path'

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

/**
 * Create module interface bound to record
 *
 * @param {Object} record - The request record
 * @param {Object} deps - Dependencies from bootstrap
 * @param {Function} deps.requireFn - Module require function
 * @param {Function} deps.resolveFn - Module resolve function
 * @returns {Object} - Bound module interface
 */
export function create(record, { requireFn, resolveFn }) {
  return {
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
     * Set output pair on record
     * @param {*} meta - Metaoutput (narrative/help)
     * @param {*} data - Data output (payload, or null if none)
     */
    output(meta, data) {
      record.headers.spl.request.metaoutput = meta
      record.headers.spl.request.output = data
    },

    /**
     * Extract output pair from another record and set on this record
     * @param {Object} sourceRecord - Record to extract output from
     */
    extractOutput(sourceRecord) {
      record.headers.spl.request.metaoutput = sourceRecord.headers.spl.request.metaoutput
      record.headers.spl.request.output = sourceRecord.headers.spl.request.output
    },

    // ========================================================================
    // Module Resolution
    // ========================================================================

    /**
     * Require a module (lib or method)
     * @param {string} uri - Module URI (e.g., 'lib/something' or 'spl/container/method')
     * @returns {Promise<Object>} - Loaded module
     */
    async require(uri) {
      return requireFn(uri, record)
    },

    /**
     * Resolve a path through overlay (without instantiation)
     * @param {string} nodePath - Container path (e.g., 'spl/container')
     * @param {string} filename - File to resolve (e.g., 'README.json')
     * @returns {string|null} - Absolute path or null if not found
     */
    resolve(nodePath, filename) {
      return resolveFn(nodePath, filename, record)
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
      const nodeRoot = record.headers.spl.runtime.nodeRoot
      if (!nodeRoot) {
        return null
      }

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
      const nodeRoot = record.headers.spl.runtime.nodeRoot
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
    getNodeRoot() {
      return record.headers.spl.runtime.nodeRoot
    },

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
    getAppAPI() {
      return record.headers.spl.runtime.appAPI
    },

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
    raiseAsyncError(error, context = {}) {
      const nodeRoot = record.headers.spl.runtime.nodeRoot
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
    },

    /**
     * Mark request as completed successfully
     */
    completeRequest() {
      record.headers.spl.request.completed = true
    }
  }
}
