// selfeval.js - Selfeval framework for container validation
//
// Loads runners from _lib/, executes selected runners,
// returns structured results with hierarchical levels.
//
// Exports:
//   loadRegistry(containerFsPath)  - load _selfevals/index.json
//   loadRunner(runnerMeta)         - load a runner from _lib
//   runAll(containerFsPath, containerName, runners, opts)
//   buildTypeStack(containerPath)  - build type stack for levels
//   loadRegistryFromType(typePath) - load _selfevals from a type

import fs from 'fs'
import path from 'path'

export function create(module) {
  const readJson = (filePath) => {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      return null
    }
  }

  // Get filesystem path for a container path
  const getContainerFsPath = (containerPath) => {
    const indexJsonPath = module.resolve(containerPath, 'index.json')
    if (indexJsonPath) {
      return path.dirname(indexJsonPath)
    }
    const indexJsPath = module.resolve(containerPath, 'index.js')
    if (indexJsPath) {
      return path.dirname(indexJsPath)
    }
    return null
  }

  return {
    // Load registry from _selfevals/index.json
    loadRegistry(containerFsPath) {
      const registry = readJson(path.join(containerFsPath, '_selfevals', 'index.json'))
      return registry || { runners: {} }
    },

    // Load a runner by file path from _lib
    async loadRunner(runnerMeta, containerFsPath) {
      const runnerPath = path.join(containerFsPath, '_lib', runnerMeta.file)
      try {
        const runnerModule = await import(runnerPath)
        // Runners use create() pattern - instantiate with module
        if (runnerModule.create) {
          const instance = runnerModule.create(module)
          return instance.run || null
        }
        return null
      } catch (e) {
        return null
      }
    },

    // Run selected runners against container
    async runAll(containerFsPath, containerName, runners, options = {}) {
      const { failFast = false } = options
      const runnerResults = []

      for (const { meta, fn } of runners) {
        const result = await fn(containerFsPath, meta)
        runnerResults.push(result)

        // Stop on first failure if failFast
        if (failFast && !result.pass) break
      }

      const allPass = runnerResults.every(r => r.pass)
      const passCount = runnerResults.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `${containerName} | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${runnerResults.length} runners passed`,
        runners: runnerResults
      }
    },

    // Build type stack: delegates to module.buildTypeStack
    buildTypeStack(containerPath) {
      return module.buildTypeStack(containerPath)
    },

    // Load registry from a type's _selfevals/index.json
    loadRegistryFromType(typePath) {
      const typeFsPath = getContainerFsPath(typePath)
      if (!typeFsPath) return { runners: {} }

      const registry = readJson(path.join(typeFsPath, '_selfevals', 'index.json'))
      return registry || { runners: {} }
    },

    // Load a runner from a type's _lib (uses overlay resolution for inheritance)
    async loadRunnerFromType(runnerMeta, typePath) {
      // Resolve through overlay - _lib files are final so inherited from parent types
      const runnerPath = module.resolve(typePath, `_lib/${runnerMeta.file}`)
      if (!runnerPath) return null

      try {
        const runnerModule = await import(runnerPath)
        // Runners use create() pattern - instantiate with module
        if (runnerModule.create) {
          const instance = runnerModule.create(module)
          return instance.run || null
        }
        return null
      } catch (e) {
        return null
      }
    }
  }
}
