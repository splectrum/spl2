// watcher.js - Basic folder watcher
//
// Watches sourceDir for new .json files, invokes handler on arrival.
// Returns { stop } handle to close watcher.

import { watch, readFileSync, existsSync } from 'fs'
import path from 'path'

/**
 * Create a folder watcher
 * @param {Object} options
 * @param {string} options.sourceDir - Folder to watch
 * @param {Function} options.handler - async (record) => void
 * @param {string} options.consumerId - Consumer ID for trail stamping
 * @returns {{ stop: Function }}
 */
export function createWatcher({ sourceDir, handler, consumerId }) {
  const inFlight = new Set()

  const fsWatcher = watch(sourceDir, async (event, filename) => {
    // Only respond to rename (file dropped in)
    if (event !== 'rename') return
    if (!filename?.endsWith('.json')) return

    // Avoid double-processing
    if (inFlight.has(filename)) return
    inFlight.add(filename)

    try {
      const sourcePath = path.join(sourceDir, filename)

      // Check file exists (rename fires for add and remove)
      if (!existsSync(sourcePath)) {
        inFlight.delete(filename)
        return
      }

      // Read and parse
      const content = readFileSync(sourcePath, 'utf-8')
      const record = JSON.parse(content)

      // Attach source location
      record.sourcePath = sourcePath

      // Stamp consumer trail
      record.headers.spl.consumers ??= []
      record.headers.spl.consumers.push({
        id: consumerId,
        timestamp: Date.now()
      })

      // Invoke handler
      await handler(record)
    } catch (err) {
      console.error(`Watcher error processing ${filename}:`, err.message)
    } finally {
      inFlight.delete(filename)
    }
  })

  return {
    stop: () => fsWatcher.close()
  }
}
