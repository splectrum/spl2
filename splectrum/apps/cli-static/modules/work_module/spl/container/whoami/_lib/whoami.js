// whoami.js - Orchestrate report building and freetext rendering
//
// Uses container libs (report.js, freetext.js) for per-facet work.
// Handles: component selection, accumulation, level combination, output shaping.
//
// Exports:
//   getContainerPath()   - resolve parent container from method path
//   buildReport()        - build structured report array
//   renderFreetext()     - render report to natural language at level

export function create(module) {
  let _fs = null
  let _path = null
  let _report = null
  let _freetext = null

  const getFs = async () => {
    if (!_fs) _fs = await module.require('fs')
    return _fs
  }

  const getPath = async () => {
    if (!_path) _path = await module.require('path')
    return _path
  }

  const getReport = async () => {
    if (!_report) _report = await module.require('lib/spl/container/report.js')
    return _report
  }

  const getFreetext = async () => {
    if (!_freetext) _freetext = await module.require('lib/spl/container/freetext.js')
    return _freetext
  }

  // Get parent container path from method path
  const getContainerPath = () => {
    const methodPath = module.getMethod()
    return methodPath.split('/').slice(0, -1).join('/')
  }

  // Get filesystem path for container using module.resolve
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

  // Read JSON file, return null if not found
  const readJson = async (filePath) => {
    const fs = await getFs()
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      return null
    }
  }

  // Read file content, return null if not found
  const readFile = async (filePath) => {
    const fs = await getFs()
    try {
      return fs.readFileSync(filePath, 'utf8')
    } catch (e) {
      return null
    }
  }

  return {
    getContainerPath,

    // Build structured report as array of facets
    async buildReport() {
      const path = await getPath()
      const report = await getReport()

      const containerPath = getContainerPath()
      const containerFsPath = await getContainerFsPath(containerPath)

      // Read container identity
      const identity = await readJson(path.join(containerFsPath, 'index.json'))
      if (!identity) return []

      // Build facet reports
      const facets = []

      // Identity facet (includes container-level info)
      const identityReport = report.buildIdentity(identity)
      facets.push(identityReport)

      // Handler facet
      const handlerContent = await readFile(path.join(containerFsPath, 'index.js'))
      if (handlerContent) {
        const handlerReport = report.buildHandler(handlerContent)
        facets.push(handlerReport)
      }

      // Schemas facet
      const schemasManifest = await readJson(path.join(containerFsPath, '_schemas', 'index.json'))
      if (schemasManifest) {
        const schemasReport = report.buildSchemas(schemasManifest)
        facets.push(schemasReport)
      }

      // Lib facet
      const libManifest = await readJson(path.join(containerFsPath, '_lib', 'index.json'))
      if (libManifest) {
        const libReport = report.buildLib(libManifest)
        facets.push(libReport)
      }

      // Reqs facet
      const reqsManifest = await readJson(path.join(containerFsPath, '_reqs', 'index.json'))
      if (reqsManifest) {
        const reqsReport = report.buildReqs(reqsManifest)
        facets.push(reqsReport)
      }

      // Return as array (single entry for now, multi-container later)
      return [{ facets }]
    },

    // Render freetext from report at level
    async renderFreetext(reportArray, level = 'topline') {
      const freetext = await getFreetext()
      const levelNum = { topline: 1, summary: 2, detail: 3, enriched: 4 }[level] || 1

      const lines = []

      for (const entry of reportArray) {
        for (const facet of entry.facets) {
          // Identity is special - has container line + facet line
          if (facet.name === 'identity') {
            const result = freetext.renderIdentityTopline(facet)
            lines.push(result.containerLine)
            lines.push('  ' + result.facetLine)

            if (levelNum >= 2) {
              const summary = freetext.renderIdentitySummary(facet)
              if (summary) lines.push('    ' + summary)
            }
            if (levelNum >= 3) {
              const detail = freetext.renderIdentityDetail(facet)
              if (detail) {
                for (const line of detail.split('\n')) {
                  if (line) lines.push('    ' + line)
                }
              }
            }
          } else {
            // Other facets: just facet line
            const toplineRenderer = `render${capitalize(facet.name)}Topline`
            if (freetext[toplineRenderer]) {
              lines.push('  ' + freetext[toplineRenderer](facet))
            }

            if (levelNum >= 2) {
              const summaryRenderer = `render${capitalize(facet.name)}Summary`
              if (freetext[summaryRenderer]) {
                const summary = freetext[summaryRenderer](facet)
                if (summary) lines.push('    ' + summary)
              }
            }

            if (levelNum >= 3) {
              const detailRenderer = `render${capitalize(facet.name)}Detail`
              if (freetext[detailRenderer]) {
                const detail = freetext[detailRenderer](facet)
                if (detail) {
                  for (const line of detail.split('\n')) {
                    if (line) lines.push('    ' + line)
                  }
                }
              }
            }
          }
        }
      }

      return lines.join('\n')
    }
  }
}

// Helper: capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
