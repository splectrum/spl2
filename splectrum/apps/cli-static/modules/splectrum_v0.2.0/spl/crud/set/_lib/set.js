// spl/crud/set/_lib/set.js - Set business logic
//
// Contains fs/path operations for set method.

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    /**
     * Join paths
     */
    joinPath(...parts) {
      return path.join(...parts)
    },

    /**
     * Get directory path
     */
    getDirPath(filePath) {
      return path.dirname(filePath)
    },

    /**
     * Check if path exists
     */
    exists(fsPath) {
      return fs.existsSync(fsPath)
    },

    /**
     * Read JSON file
     */
    readJson(filePath) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    },

    /**
     * Write JSON file
     */
    writeJson(filePath, data) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    },

    /**
     * Ensure directory exists
     */
    ensureDir(dirPath) {
      if (!this.exists(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    }
  }
}
