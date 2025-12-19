// spl/crud/write/_lib/write.js - Write business logic
//
// Contains fs/path operations for write method.

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
     * Check if resource file exists
     */
    resourceExists(containerFsPath, resource) {
      const filePath = path.join(containerFsPath, resource)
      return fs.existsSync(filePath)
    },

    /**
     * Write content to file
     */
    writeFile(containerFsPath, resource, content) {
      const filePath = path.join(containerFsPath, resource)
      fs.writeFileSync(filePath, content, 'utf8')
    }
  }
}
