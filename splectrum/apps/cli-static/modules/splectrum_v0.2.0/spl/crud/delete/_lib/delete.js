// spl/crud/delete/_lib/delete.js - Delete business logic
//
// Contains fs/path operations for delete method.

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
     * Delete a file
     */
    deleteFile(fsPath) {
      fs.unlinkSync(fsPath)
    },

    /**
     * Delete a directory (recursive)
     */
    deleteDir(fsPath, recursive = false) {
      if (recursive) {
        fs.rmSync(fsPath, { recursive: true })
      } else {
        fs.rmdirSync(fsPath)
      }
    },

    /**
     * Read directory entries
     */
    readDir(fsPath) {
      return fs.readdirSync(fsPath, { withFileTypes: true })
    },

    /**
     * Read directory entries (names only)
     */
    readDirNames(fsPath) {
      return fs.readdirSync(fsPath)
    },

    /**
     * Check if path is directory
     */
    isDir(fsPath) {
      return fs.statSync(fsPath).isDirectory()
    },

    /**
     * Clean up empty directory
     */
    cleanupEmptyDir(dirPath, containerFsPath) {
      if (dirPath !== containerFsPath) {
        try {
          const entries = this.readDirNames(dirPath)
          if (entries.length === 0) {
            this.deleteDir(dirPath)
          }
        } catch (e) {
          // Ignore errors cleaning up directories
        }
      }
    }
  }
}
