// ai.js - AI/exploration helper utilities
//
// Utility functions for exploring splectrum from inline scripts.
// Reduces boilerplate for common operations.
//
// Usage:
//   spl '/* explore */
//   const ai = await module.require("lib/spl/script/ai.js")
//   module.output(ai.json(ai.stack("spl/container")))
//   '

export function create(module) {
  let _fs = null
  let _path = null

  const getFs = async () => {
    if (!_fs) _fs = await module.require('fs')
    return _fs
  }

  const getPath = async () => {
    if (!_path) _path = await module.require('path')
    return _path
  }

  return {
    // ========================================================================
    // File Reading
    // ========================================================================

    /**
     * Read file through resolution
     * @param {string} containerPath - Container path (e.g., 'spl/container')
     * @param {string} relativePath - File relative to container (e.g., 'index.json')
     * @returns {Promise<string|null>} - File content or null if not found
     */
    async readFile(containerPath, relativePath) {
      const resolved = module.resolve(containerPath, relativePath)
      if (!resolved) return null
      const fs = await getFs()
      try {
        return fs.readFileSync(resolved, 'utf8')
      } catch {
        return null
      }
    },

    /**
     * Read JSON through resolution
     * @param {string} containerPath - Container path
     * @param {string} relativePath - JSON file relative to container
     * @returns {Promise<Object|null>} - Parsed JSON or null
     */
    async readJson(containerPath, relativePath) {
      const content = await this.readFile(containerPath, relativePath)
      if (!content) return null
      try {
        return JSON.parse(content)
      } catch {
        return null
      }
    },

    // ========================================================================
    // Inspection
    // ========================================================================

    /**
     * Get type stack (shorthand for buildTypeStack)
     * @param {string} containerPath - Container path
     * @param {string} mode - 'full' (default), 'extends', or 'instantiates'
     * @returns {{ stack: string[], instanceLevel: number }}
     */
    stack(containerPath, mode = 'full') {
      return module.buildTypeStack(containerPath, mode)
    },

    /**
     * List all methods available on a container
     * Walks the instantiates chain to find all methods
     * @param {string} containerPath - Container path
     * @returns {Promise<Array<{ name: string, definedAt: string }>>}
     */
    async methods(containerPath) {
      const { stack } = module.buildTypeStack(containerPath, 'instantiates')
      const methods = []
      const seen = new Set()

      for (const typePath of stack) {
        const index = await this.readJson(typePath, 'index.json')
        if (!index) continue

        const childList = index.instance?.children?.list || []
        for (const name of childList) {
          if (!seen.has(name)) {
            seen.add(name)
            methods.push({ name, definedAt: typePath })
          }
        }
      }

      return methods
    },

    /**
     * List children of a container
     * @param {string} containerPath - Container path
     * @returns {Promise<{ type: string, list: string[] } | null>}
     */
    async children(containerPath) {
      const index = await this.readJson(containerPath, 'index.json')
      if (!index?.instance?.children) return null
      return index.instance.children
    },

    // ========================================================================
    // Quick Checks
    // ========================================================================

    /**
     * Check if container exists (has index.json)
     * @param {string} containerPath - Container path
     * @returns {boolean}
     */
    exists(containerPath) {
      return module.resolve(containerPath, 'index.json') !== null
    },

    /**
     * Check if path is a method (no index.json, but parent has index.json)
     * @param {string} path - Path to check
     * @returns {boolean}
     */
    isMethod(path) {
      if (this.exists(path)) return false
      const segments = path.split('/')
      if (segments.length < 2) return false
      const parentPath = segments.slice(0, -1).join('/')
      return this.exists(parentPath)
    },

    /**
     * Find physical method definition for a virtual method path
     * @param {string} virtualMethodPath - e.g., 'spl/container/whoami'
     * @returns {string|null} - Physical method path or null
     */
    physicalMethod(virtualMethodPath) {
      const { stack } = module.buildTypeStack(virtualMethodPath, 'instantiates')
      // If resolution worked, first element is the physical method
      if (stack.length > 0 && stack[0] !== virtualMethodPath) {
        return stack[0]
      }
      // Check if it resolved to itself (already physical)
      if (this.exists(virtualMethodPath)) {
        return virtualMethodPath
      }
      return null
    },

    // ========================================================================
    // Output Helpers
    // ========================================================================

    /**
     * Pretty print JSON
     * @param {*} obj - Object to stringify
     * @returns {string}
     */
    json(obj) {
      return JSON.stringify(obj, null, 2)
    },

    /**
     * Format array as table
     * @param {Array<Object>} arr - Array of objects
     * @param {string[]} columns - Column keys to show (default: all keys from first item)
     * @returns {string}
     */
    table(arr, columns) {
      if (!arr || arr.length === 0) return '(empty)'

      const cols = columns || Object.keys(arr[0])
      const widths = {}

      // Calculate column widths
      for (const col of cols) {
        widths[col] = col.length
        for (const row of arr) {
          const val = String(row[col] ?? '')
          widths[col] = Math.max(widths[col], val.length)
        }
      }

      // Build header
      const header = cols.map(c => c.padEnd(widths[c])).join(' | ')
      const separator = cols.map(c => '-'.repeat(widths[c])).join('-+-')

      // Build rows
      const rows = arr.map(row =>
        cols.map(c => String(row[c] ?? '').padEnd(widths[c])).join(' | ')
      )

      return [header, separator, ...rows].join('\n')
    }
  }
}
