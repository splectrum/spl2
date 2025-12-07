// selfeval.js - Selfeval implementation
//
// Validates containers against declared constraints in _selfevals/.
// Data-driven: generic runners interpret per-container JSON data.
//
// Flags:
//   --facet=<name>  run specific facet (default: all)
//   --dry-run       list facets without executing
//   --fail-fast     quiet mode, stop on first failure
//   --report        output structured JSON only
//   --verbose       output both freetext and JSON
//
// Exports:
//   loadManifest(containerPath)              - load selfevals.json
//   selectFacets(manifest)                   - filter by --facet flag
//   runFacets(containerPath, absPath, facets) - execute runners
//   output(text, data)                       - format per flags

export function create(module) {
  const input = module.input()

  // Facet runners
  const runners = {
    structure: async (absPath, data) => {
      const fs = await module.require('fs')
      const path = await module.require('path')
      const checks = []

      for (const file of data.required_files || []) {
        const exists = fs.existsSync(path.join(absPath, file))
        checks.push({
          name: `required_file:${file}`,
          pass: exists,
          message: exists ? `Found ${file}` : `Missing required file: ${file}`
        })
      }

      for (const folder of data.required_folders || []) {
        const folderPath = path.join(absPath, folder)
        const exists = fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()
        checks.push({
          name: `required_folder:${folder}`,
          pass: exists,
          message: exists ? `Found ${folder}/` : `Missing required folder: ${folder}/`
        })
      }

      for (const folder of data.optional_folders || []) {
        const folderPath = path.join(absPath, folder)
        const exists = fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()
        checks.push({
          name: `optional_folder:${folder}`,
          pass: true,
          message: exists ? `Found ${folder}/` : `Optional folder not present: ${folder}/`
        })
      }

      return { facet: 'structure', checks }
    },

    schemas: async () => ({
      facet: 'schemas',
      checks: [{ name: 'not_implemented', pass: true, message: 'Schema validation not yet implemented' }]
    })
  }

  return {
    // Load manifest from container's _selfevals/selfevals.json
    loadManifest: async (containerPath) => {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const manifestPath = module.resolve(containerPath, '_selfevals/selfevals.json')
      if (!manifestPath) return { error: 'no_selfevals' }

      try {
        const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        const absPath = path.dirname(manifestPath).replace('/_selfevals', '')
        return { facets: data.facets || [], absPath }
      } catch (err) {
        return { error: err.message }
      }
    },

    // Select facets based on --facet flag
    selectFacets: (manifest) => {
      const filter = input.facet || 'all'
      return filter === 'all' ? manifest.facets : manifest.facets.filter(f => f === filter)
    },

    // Run selected facets, return { text, data }
    runFacets: async (containerPath, absPath, facets) => {
      const fs = await module.require('fs')
      const dryRun = input.dryRun || false
      const failFast = input.failFast || false

      // Dry run - just describe what would run
      if (dryRun) {
        return {
          text: `Selfevals for ${containerPath}:\n\nWould run: ${facets.join(', ')}\n`,
          data: { facets, dryRun: true }
        }
      }

      // Run each facet
      const results = []
      let text = failFast ? '' : `Selfeval: ${containerPath}\n\n`

      for (const facet of facets) {
        // Load facet data
        const dataPath = module.resolve(containerPath, `_selfevals/selfeval_${facet}.json`)
        if (!dataPath) {
          text += `[${facet}] FAIL - No data file\n`
          results.push({ facet, checks: [], error: 'no_data_file' })
          if (failFast) break
          continue
        }

        let facetData
        try {
          facetData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
        } catch (err) {
          text += `[${facet}] FAIL - ${err.message}\n`
          results.push({ facet, checks: [], error: err.message })
          if (failFast) break
          continue
        }

        if (!runners[facet]) {
          text += `[${facet}] FAIL - No runner\n`
          results.push({ facet, checks: [], error: 'no_runner' })
          if (failFast) break
          continue
        }

        const result = await runners[facet](absPath, facetData)
        results.push(result)

        const failedChecks = result.checks.filter(c => !c.pass)
        const passed = result.checks.length - failedChecks.length

        if (failFast) {
          // Quiet mode: one liner for pass, detail on fail
          if (failedChecks.length === 0) {
            text += `[${facet}] OK\n`
          } else {
            text += `[${facet}] FAIL\n`
            for (const check of failedChecks) {
              text += `  - ${check.message}\n`
            }
            break
          }
        } else {
          // Verbose mode: full detail
          text += `[${facet}] ${passed}/${result.checks.length} checks passed\n`
          for (const check of result.checks) {
            text += `  ${check.pass ? '+' : '-'} ${check.message}\n`
          }
          text += '\n'
        }
      }

      // Summary
      const allChecks = results.flatMap(r => r.checks || [])
      const totalPassed = allChecks.filter(c => c.pass).length
      const allPass = totalPassed === allChecks.length

      if (!failFast) {
        text += `Summary: ${totalPassed}/${allChecks.length} checks passed${allPass ? '' : ' (FAIL)'}`
      }

      return { text, data: { results, pass: allPass } }
    },

    // Output based on --report/--verbose flags
    output: (text, data) => {
      if (input.report) {
        module.output(null, data)
      } else if (input.verbose) {
        module.output(text, data)
      } else {
        module.output(text, null)
      }
    }
  }
}
