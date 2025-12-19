// spl/crud/create/_lib/create.js - Create container/resource business logic

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    /**
     * Create a resource file in a container
     */
    createResource(containerPath, resource, workModulePath, dryRun) {
      const resourceFsPath = path.join(workModulePath, containerPath, resource)

      if (dryRun) {
        return { status: 'dry_run', containerPath, resource, resourceFsPath }
      }

      fs.mkdirSync(path.dirname(resourceFsPath), { recursive: true })
      fs.writeFileSync(resourceFsPath, '', 'utf8')

      return { status: 'created', containerPath, resource, resourceFsPath }
    },

    /**
     * Read and parse index.json from a path
     */
    readIndex(indexPath) {
      return JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    },

    /**
     * Check if container already exists
     */
    containerExists(indexJsonPath) {
      return fs.existsSync(indexJsonPath)
    },

    /**
     * Create a container with index.json
     */
    createContainer(targetPath, targetFsPath, indexContent, dryRun) {
      const indexJsonPath = path.join(targetFsPath, 'index.json')

      if (dryRun) {
        return { status: 'dry_run', targetPath, targetFsPath, indexContent }
      }

      fs.mkdirSync(targetFsPath, { recursive: true })
      fs.writeFileSync(indexJsonPath, JSON.stringify(indexContent, null, 2) + '\n', 'utf8')

      return { status: 'created', targetPath, targetFsPath, indexContent }
    },

    /**
     * Get full filesystem path for a container in work_module
     */
    getContainerFsPath(workModulePath, containerPath) {
      return path.join(workModulePath, containerPath)
    },

    /**
     * Get index.json path for a container
     */
    getIndexJsonPath(containerFsPath) {
      return path.join(containerFsPath, 'index.json')
    }
  }
}
