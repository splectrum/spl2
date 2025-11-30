// spl.js - Core splectrum utilities (lib/spl/spl)
//
// Bound pattern: create(record, { requireNonSpl }) returns object with methods
// This is the foundation lib imported by all other libs.

let fs, path

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
     * @param {boolean} options.sync - Use sync fs operations (for pre-exit writes)
     * @returns {string} - Path where record was written
     */
    faf(destination, options = {}) {
      const nodeRoot = record.headers.spl.runtime.nodeRoot
      if (!nodeRoot) {
        // Can't write without a node - silent fail for FAF
        return null
      }

      // Generate filename if not provided
      const timestamp = record.headers.spl.request.timeReceived || Date.now()
      const filename = options.filename || `${timestamp}.json`

      // Resolve destination relative to node root
      const destPath = path.isAbsolute(destination)
        ? destination
        : path.join(nodeRoot, destination)

      const filePath = path.join(destPath, filename)
      const recordJson = JSON.stringify(record, null, 2)

      if (options.sync) {
        // Sync write - blocks until complete
        fs.mkdirSync(destPath, { recursive: true })
        fs.writeFileSync(filePath, recordJson, 'utf-8')
      } else {
        // Async write - fire and forget
        fs.mkdir(destPath, { recursive: true }, (err) => {
          if (err) return
          fs.writeFile(filePath, recordJson, 'utf-8', () => {})
        })
      }

      return filePath
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
    }
  }
}
