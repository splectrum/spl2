// crud.js - CRUD utilities
//
// Work module path resolution for CRUD operations.
// Reads hierarchy.json to find the active work module dynamically.

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    /**
     * Get the path to the active work module
     * Reads hierarchy.json to find the layer with type: "work_module"
     * Respects app context (uses app hierarchy.json if in app context)
     *
     * @returns {string|null} Full path to work module, or null if none found
     */
    async getWorkModulePath() {

      const nodeRoot = module.getNodeRoot()
      const appAPI = module.getAppAPI()
      const appName = appAPI?.replace('spl/', '')

      // Determine modules directory and hierarchy.json location
      const modulesDir = appName
        ? path.join(nodeRoot, 'apps', appName, 'modules')
        : path.join(nodeRoot, 'modules')

      const hierarchyPath = path.join(modulesDir, 'hierarchy.json')

      // Read hierarchy.json
      if (!fs.existsSync(hierarchyPath)) {
        return null
      }

      let hierarchy
      try {
        hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf-8'))
      } catch (e) {
        return null
      }

      // Find the work_module layer
      const workLayer = hierarchy.layers?.find(l => l.type === 'work_module')
      if (!workLayer) {
        return null
      }

      return path.join(modulesDir, workLayer.name)
    }
  }
}
