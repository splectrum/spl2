// selfeval.js - Selfeval framework for container validation
//
// Loads runners from _selfevals/, executes selected runners,
// returns structured results.
//
// Exports:
//   loadRegistry(containerFsPath)     - load _selfevals/index.json
//   loadRunner(containerFsPath, name) - load a runner by name
//   runAll(report, runners)           - run all runners against report
//   renderFreetext(results)           - render results to freetext

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

    // Load a runner by name
    async loadRunner(containerFsPath, runnerName, registry) {
      const path = await getPath()
      const runnerMeta = registry.runners?.[runnerName]
      if (!runnerMeta) return null

      const runnerPath = path.join(containerFsPath, '_selfevals', runnerMeta.file)
      try {
        const runnerModule = await import(runnerPath)
        return runnerModule.create ? runnerModule.create(module) : null
      } catch (e) {
        return null
      }
    },

    // Run selected runners against container report
    async runAll(containerReport, runners, options = {}) {
      const { failFast = false } = options
      const results = []

      for (const runner of runners) {
        // Find the facet this runner checks
        const facet = containerReport.facets.find(f => f.name === runner.name)
        const result = runner.run(facet)
        results.push({
          runner: runner.name,
          description: runner.description,
          ...result
        })

        // Stop on first failure if failFast
        if (failFast && !result.pass) break
      }

      const allPass = results.every(r => r.pass)
      return { pass: allPass, results }
    },

    // Render results to freetext at specified level
    renderFreetext(selfevalResults, containerName, level = 'summary') {
      const lines = [`Selfeval: ${containerName}`]
      lines.push('')

      for (const result of selfevalResults.results) {
        const status = result.pass ? 'PASS' : 'FAIL'
        lines.push(`[${result.runner}] ${status}`)

        if (result.results) {
          for (const r of result.results) {
            const mark = r.pass ? '+' : '-'
            lines.push(`  ${mark} ${r.name}: ${r.actual}/${r.expected} exports`)

            // Detail level: show missing/extra
            if (level === 'detail') {
              if (r.missing?.length > 0) {
                lines.push(`    missing: ${r.missing.join(', ')}`)
              }
              if (r.extra?.length > 0) {
                lines.push(`    extra: ${r.extra.join(', ')}`)
              }
            }
          }
        }
        lines.push('')
      }

      const summary = selfevalResults.pass ? 'PASS' : 'FAIL'
      lines.push(`Summary: ${summary}`)

      return lines.join('\n')
    }
  }
}
