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

    // Build structured report - container with nested facets
    async buildReport() {
      const path = await getPath()
      const report = await getReport()

      const containerPath = getContainerPath()
      const containerFsPath = await getContainerFsPath(containerPath)

      // Read container identity
      const identity = await readJson(path.join(containerFsPath, 'index.json'))
      if (!identity) return null

      // Build container with nested facets
      const container = report.buildContainer(identity)

      // Api facet (what this container can do)
      container.facets.push(report.buildApi(identity))

      // Handler facet
      const handlerContent = await readFile(path.join(containerFsPath, 'index.js'))
      if (handlerContent) {
        container.facets.push(report.buildHandler(handlerContent))
      }

      // Schemas facet
      const schemasManifest = await readJson(path.join(containerFsPath, '_schemas', 'index.json'))
      if (schemasManifest) {
        container.facets.push(report.buildSchemas(schemasManifest))
      }

      // Lib facet
      const libManifest = await readJson(path.join(containerFsPath, '_lib', 'index.json'))
      if (libManifest) {
        // Read lib file contents for export extraction
        const libFileContents = {}
        const libFiles = libManifest.files || {}
        for (const fileName of Object.keys(libFiles)) {
          const content = await readFile(path.join(containerFsPath, '_lib', fileName))
          if (content) libFileContents[fileName] = content
        }
        container.facets.push(report.buildLib(libManifest, libFileContents))
      }

      // Reqs facet
      const reqsManifest = await readJson(path.join(containerFsPath, '_reqs', 'index.json'))
      if (reqsManifest) {
        container.facets.push(report.buildReqs(reqsManifest))
      }

      return container
    },

    // Render freetext from container report at level
    async renderFreetext(container, level = 'topline') {
      const freetext = await getFreetext()
      const levelNum = { topline: 1, summary: 2, detail: 3, enriched: 4 }[level] || 1

      if (!container) return ''

      const lines = []

      // Container headline
      lines.push(freetext.renderContainerTopline(container))

      if (levelNum >= 2) {
        const summary = freetext.renderContainerSummary(container)
        if (summary) lines.push('  ' + summary)
      }

      // Facets (children of container)
      for (const facet of container.facets) {
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

      return lines.join('\n')
    }
  }
}

// Helper: capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
