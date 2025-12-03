// spl.js - Core splectrum utilities (lib/spl/spl)
//
// Bound pattern: create(record, { requireNonSpl }) returns object with methods
// This is the foundation lib imported by all other libs.

let fs, path

/**
 * Find unique filename using dedupe algorithm
 * @param {string} folder - Target folder path
 * @param {string} filename - Base filename
 * @param {string} dedupe - Dedupe mode ('numeric-digit') or falsy for default
 * @returns {string} - Unique filename
 */
function findUniqueFilename(folder, filename, dedupe) {
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)

  if (dedupe === 'numeric-digit') {
    // Always append digit starting from 0
    // 1732789234567.json -> 17327892345670.json -> 17327892345671.json
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
 * Create core utilities bound to record
 * @param {Object} record - The request record
 * @param {Object} deps - Dependencies from bootstrap
 * @param {Function} deps.requireNonSpl - Platform module loader
 * @returns {Object} - Bound core methods
 */
export function create(record, { requireNonSpl }) {
  fs = requireNonSpl('fs')
  path = requireNonSpl('path')

  return {
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
        // Can't write without a node - silent fail for FAF
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

      // Ensure directory exists (sync - needed for dedupe check)
      fs.mkdirSync(destPath, { recursive: true })

      // Find unique filename (FAF always dedupes - never overwrites)
      const finalFilename = findUniqueFilename(destPath, filename, options.dedupe)

      const filePath = path.join(destPath, finalFilename)
      const recordJson = JSON.stringify(recordClone, null, 2)

      if (options.sync) {
        // Sync write - blocks until complete
        fs.writeFileSync(filePath, recordJson, 'utf-8')
      } else {
        // Async write - fire and forget
        fs.writeFile(filePath, recordJson, 'utf-8', (err) => {
          if (err) this.raiseAsyncError(err, { operation: 'faf', destination, filePath })
        })
      }

      return filePath
    },

    /**
     * Raise an async error - clone record, add error info, FAF to error folder
     * Use this for errors in async callbacks where throwing isn't possible.
     *
     * @param {Error} error - The error object
     * @param {Object} context - Additional context about where/why error occurred
     */
    raiseAsyncError(error, context = {}) {
      const nodeRoot = record.headers.spl.runtime.nodeRoot
      if (!nodeRoot) return

      // Clone immediately - record may have mutated
      const errorRecord = JSON.parse(JSON.stringify(record))

      // Add error info to the clone (async: true indicates async context)
      errorRecord.headers.spl.error = {
        timestamp: Date.now(),
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
        async: true
      }

      // FAF to error folder
      const errorPath = path.join(nodeRoot, 'runtime/error')
      fs.mkdirSync(errorPath, { recursive: true })

      const filename = `${Date.now()}.json`
      const finalFilename = findUniqueFilename(errorPath, filename, 'numeric-digit')

      fs.writeFile(
        path.join(errorPath, finalFilename),
        JSON.stringify(errorRecord, null, 2),
        'utf-8',
        () => {} // Swallow errors in error handler - nowhere else to go
      )
    },

    /**
     * Get the record's unique identifier
     * Based on timestamp for now
     * @returns {string}
     */
    getRecordId() {
      return String(record.headers.spl.request.timeReceived)
    },

    /**
     * Get node root from record
     * @returns {string|null}
     */
    getNodeRoot() {
      return record.headers.spl.runtime.nodeRoot
    },

    /**
     * Get input from record (shortcut for scripts)
     * @returns {Object}
     */
    input() {
      return record.headers.spl.request.input
    },

    /**
     * Set output on record (for scripts)
     * @param {*} value - Output value
     */
    output(value) {
      record.headers.spl.request.output = value
    },

    /**
     * Mark request as completed successfully
     */
    completeRequest() {
      record.headers.spl.request.completed = true
    },

    /**
     * Raise a sync error - sets error on record and marks completed
     * @param {string} message - Error message
     */
    raiseError(message) {
      record.headers.spl.runtime.error = message
      record.headers.spl.request.completed = true
    },

    /**
     * Consume Latest - read most recent record from topic folder
     *
     * Pairs with faf() for state save/load pattern:
     * - faf() writes timestamped records (never overwrites)
     * - consumeLatest() reads the latest by filename sort
     *
     * @param {string} topic - Topic folder path (relative to nodeRoot or absolute)
     * @returns {Object|null} - Parsed record or null if topic empty/missing
     */
    consumeLatest(topic) {
      const nodeRoot = record.headers.spl.runtime.nodeRoot
      if (!nodeRoot) return null

      // Resolve topic path
      const topicPath = path.isAbsolute(topic)
        ? topic
        : path.join(nodeRoot, topic)

      // Check if folder exists
      if (!fs.existsSync(topicPath)) return null

      // List json files, sort descending (latest first)
      const files = fs.readdirSync(topicPath)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse()

      if (files.length === 0) return null

      // Read and parse latest
      const latestPath = path.join(topicPath, files[0])
      const content = fs.readFileSync(latestPath, 'utf-8')
      return JSON.parse(content)
    }
  }
}
