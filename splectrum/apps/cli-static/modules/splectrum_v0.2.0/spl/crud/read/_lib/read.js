// spl/crud/read/_lib/read.js - Read business logic
//
// Contains fs/path operations for read method.

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    /**
     * Get container filesystem path in work_module
     */
    getContainerFsPath(workModulePath, containerPath) {
      return path.join(workModulePath, containerPath)
    },

    /**
     * Check if container exists
     */
    containerExists(containerFsPath) {
      return fs.existsSync(containerFsPath)
    },

    /**
     * Find files matching a wildcard pattern
     */
    findMatchingFiles(containerFsPath, resource) {
      const resourceDir = path.dirname(resource)
      const resourcePattern = path.basename(resource)
      const searchDir = path.join(containerFsPath, resourceDir)

      if (!fs.existsSync(searchDir)) {
        return { found: false, files: [] }
      }

      // Convert glob pattern to regex
      const regexPattern = resourcePattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
      const regex = new RegExp(`^${regexPattern}$`)

      // Find matching files
      const files = fs.readdirSync(searchDir)
        .filter(f => regex.test(f))
        .map(f => resourceDir === '.' ? f : `${resourceDir}/${f}`)
        .sort()

      return { found: true, files }
    },

    /**
     * Read file contents
     */
    readFile(containerFsPath, resource) {
      const filePath = path.join(containerFsPath, resource)

      if (!fs.existsSync(filePath)) {
        return { exists: false, contents: null }
      }

      const contents = fs.readFileSync(filePath, 'utf8')
      return { exists: true, contents }
    }
  }
}
