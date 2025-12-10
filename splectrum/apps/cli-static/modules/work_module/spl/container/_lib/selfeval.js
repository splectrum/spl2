// selfeval.js - Selfeval framework for container validation
//
// Loads runners from _lib/, executes selected runners,
// returns structured results with hierarchical levels.
//
// Exports:
//   loadRegistry(containerFsPath)  - load _selfevals/index.json
//   loadRunner(runnerMeta)         - load a runner from _lib
//   runAll(containerFsPath, containerName, runners, opts)

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
        return runnerModule.default || null
      } catch (e) {
        return null
      }
    },

    // Run selected runners against container
    async runAll(containerFsPath, containerName, runners, options = {}) {
      const { failFast = false } = options
      const runnerResults = []

      for (const { meta, fn } of runners) {
        const result = await fn(containerFsPath, module)
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
    }
  }
}
