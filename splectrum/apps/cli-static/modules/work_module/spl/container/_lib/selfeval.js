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

  const readJson = async (filePath) => {
    const fs = await getFs()
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      return null
    }
  }

  // Get filesystem path for a container path
  const getContainerFsPath = async (containerPath) => {
    const path = await getPath()
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
    async loadRegistry(containerFsPath) {
      const path = await getPath()
      const registry = await readJson(path.join(containerFsPath, '_selfevals', 'index.json'))
      return registry || { runners: {} }
    },

    // Load a runner by file path from _lib
    async loadRunner(runnerMeta, containerFsPath) {
      const path = await getPath()
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
        const result = await fn(containerFsPath)
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

    // Build type stack: instance chain first, then type chain, deduped
    // Returns array of type names from bottom (most base) to top (current)
    async buildTypeStack(containerPath) {
      const path = await getPath()
      const containerFsPath = await getContainerFsPath(containerPath)
      if (!containerFsPath) return [containerPath]

      const identity = await readJson(path.join(containerFsPath, 'index.json'))
      if (!identity) return [containerPath]

      const visited = new Set()
      const instanceChain = []
      const typeChain = []

      // Follow instantiates chain first
      const buildInstanceChain = async (typeName) => {
        if (!typeName || visited.has(typeName)) return
        visited.add(typeName)

        const typeFsPath = await getContainerFsPath(typeName)
        if (!typeFsPath) return

        const typeIdentity = await readJson(path.join(typeFsPath, 'index.json'))
        if (!typeIdentity) return

        // Recurse to base first
        if (typeIdentity.instantiates) {
          await buildInstanceChain(typeIdentity.instantiates)
        }
        instanceChain.push(typeName)
      }

      // Follow extends chain
      const buildTypeChain = async (typeName) => {
        if (!typeName || visited.has(typeName)) return
        visited.add(typeName)

        const typeFsPath = await getContainerFsPath(typeName)
        if (!typeFsPath) return

        const typeIdentity = await readJson(path.join(typeFsPath, 'index.json'))
        if (!typeIdentity) return

        // Recurse to base first
        if (typeIdentity.extends) {
          await buildTypeChain(typeIdentity.extends)
        }
        typeChain.push(typeName)
      }

      // Build instance chain from instantiates
      if (identity.instantiates) {
        await buildInstanceChain(identity.instantiates)
      }

      // Build type chain from extends (will skip already visited)
      if (identity.extends) {
        await buildTypeChain(identity.extends)
      }

      // Add current container at the end
      if (!visited.has(containerPath)) {
        typeChain.push(containerPath)
      }

      // Combine: instance chain first, then type chain
      return [...instanceChain, ...typeChain]
    },

    // Load registry from a type's _selfevals/index.json
    async loadRegistryFromType(typePath) {
      const path = await getPath()
      const typeFsPath = await getContainerFsPath(typePath)
      if (!typeFsPath) return { runners: {} }

      const registry = await readJson(path.join(typeFsPath, '_selfevals', 'index.json'))
      return registry || { runners: {} }
    },

    // Load a runner from a specific type's _lib
    async loadRunnerFromType(runnerMeta, typePath) {
      const path = await getPath()
      const typeFsPath = await getContainerFsPath(typePath)
      if (!typeFsPath) return null

      const runnerPath = path.join(typeFsPath, '_lib', runnerMeta.file)
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
