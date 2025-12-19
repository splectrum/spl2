// spl/crud/lift/_lib/lift.js - Lift business logic
//
// Contains implementation for lift modes (single resource and modules).

import fs from 'fs'
import path from 'path'

// Container facet directories (part of container, not child containers)
const FACET_DIRS = ['_lib', '_schemas', '_reqs', '_tests', '_selfevals']

export function create(module) {
  return {
    /**
     * Check if container exists in work_module
     */
    containerExists(workModulePath, targetPath) {
      const indexJsonPath = path.join(workModulePath, targetPath, 'index.json')
      return fs.existsSync(indexJsonPath)
    },

    /**
     * Check if resource already exists locally
     */
    resourceExistsLocally(workModulePath, targetPath, resource) {
      const resourcePath = path.join(workModulePath, targetPath, resource)
      return fs.existsSync(resourcePath)
    },

    /**
     * Lift a single resource from overlay to work_module
     */
    liftResource(sourcePath, workModulePath, targetPath, resource, dryRun) {
      const resourceTargetPath = path.join(workModulePath, targetPath, resource)

      if (dryRun) {
        return {
          status: 'dry_run',
          resource,
          sourcePath,
          targetPath: resourceTargetPath
        }
      }

      // Ensure parent directories exist
      const resourceDir = path.dirname(resourceTargetPath)
      if (!fs.existsSync(resourceDir)) {
        fs.mkdirSync(resourceDir, { recursive: true })
      }

      // Copy resource
      fs.copyFileSync(sourcePath, resourceTargetPath)

      // Read contents for immediate use
      const contents = fs.readFileSync(resourceTargetPath, 'utf8')

      return {
        status: 'lifted',
        resource,
        sourcePath,
        targetPath: resourceTargetPath,
        contents
      }
    },

    /**
     * Lift container from lower module layer to work_module
     */
    async liftModules(targetPath, dryRun, recursive = false) {
      const crud = await module.require('lib/spl/crud')
      const nodeRoot = module.getNodeRoot()
      const appAPI = module.getAppAPI()
      const appName = appAPI?.replace('spl/', '')

      const workModuleBase = await crud.getWorkModulePath()
      if (!workModuleBase) {
        return { error: 'no_work_module' }
      }

      const appModulesDir = appName
        ? path.join(nodeRoot, 'apps', appName, 'modules')
        : null
      const splectrumModulesDir = path.join(nodeRoot, 'modules')
      const workModulePath = path.join(workModuleBase, targetPath)

      const filesToCopy = []
      const skipped = []
      const seenFiles = new Set()
      const sourceLayers = []

      function walkDir(dir, relBase, layerName, location) {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return

        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
          const relPath = relBase ? path.join(relBase, entry.name) : entry.name
          const srcFullPath = path.join(dir, entry.name)
          const destFullPath = path.join(workModulePath, relPath)

          if (entry.isDirectory()) {
            const isFacetDir = FACET_DIRS.includes(entry.name)
            if (recursive || isFacetDir) {
              walkDir(srcFullPath, relPath, layerName, location)
            }
          } else {
            if (seenFiles.has(relPath)) continue
            seenFiles.add(relPath)

            if (fs.existsSync(destFullPath)) {
              skipped.push(relPath)
            } else {
              filesToCopy.push({ relPath, srcFullPath, destFullPath, layerName, location })
            }
          }
        }
      }

      // Walk app modules
      if (appModulesDir) {
        const appHierarchyPath = path.join(appModulesDir, 'hierarchy.json')
        if (fs.existsSync(appHierarchyPath)) {
          const hierarchy = JSON.parse(fs.readFileSync(appHierarchyPath, 'utf8'))
          for (const layer of hierarchy.layers) {
            if (layer.type === 'work_module') continue
            const candidatePath = path.join(appModulesDir, layer.name, targetPath)
            walkDir(candidatePath, '', layer.name, 'app')
            if (fs.existsSync(candidatePath)) {
              sourceLayers.push(`app/${layer.name}`)
            }
          }
        }
      }

      // Walk splectrum modules
      const splHierarchyPath = path.join(splectrumModulesDir, 'hierarchy.json')
      if (fs.existsSync(splHierarchyPath)) {
        const hierarchy = JSON.parse(fs.readFileSync(splHierarchyPath, 'utf8'))
        for (const layer of hierarchy.layers) {
          if (layer.type === 'work_module') continue
          const candidatePath = path.join(splectrumModulesDir, layer.name, targetPath)
          walkDir(candidatePath, '', layer.name, 'splectrum')
          if (fs.existsSync(candidatePath)) {
            sourceLayers.push(`splectrum/${layer.name}`)
          }
        }
      }

      if (filesToCopy.length === 0 && skipped.length === 0) {
        return { error: 'not_found', targetPath, searchedLayers: sourceLayers }
      }

      if (dryRun) {
        return {
          status: 'dry_run',
          targetPath,
          sourceLayers,
          toCopy: filesToCopy.map(f => f.relPath),
          skipped
        }
      }

      // Copy files
      for (const f of filesToCopy) {
        const destDir = path.dirname(f.destFullPath)
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        fs.copyFileSync(f.srcFullPath, f.destFullPath)
      }

      return {
        status: 'lifted',
        targetPath,
        sourceLayers,
        copied: filesToCopy.map(f => f.relPath),
        skipped
      }
    }
  }
}
