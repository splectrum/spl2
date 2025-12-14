// whoami.js - Container introspection lib
//
// Exports:
//   parseFacets(input)                    - parse --facet flag
//   buildContainer(detailLevel, facets)  - build container with facets
//   buildChain(depthLevel, detailLevel, facets) - traverse type chain
//   renderFreetext(container, level)     - render to natural language

const ALL_FACETS = ['container', 'children', 'handler', 'schemas', 'lib', 'reqs']

// Extract base facet name from path (schemas/input -> schemas)
function getBaseFacet(facetPath) {
  return facetPath.split('/')[0]
}

// Extract file filter from path (schemas/input -> input, schemas -> null)
function getFileFilter(facetPath) {
  const parts = facetPath.split('/')
  return parts.length > 1 ? parts[1] : null
}

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

  // Get filesystem path for container
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

  // Resolve facet file through overlay (walks type chain)
  const resolveFacetFile = (containerPath, relativePath) => {
    return module.resolve(containerPath, relativePath)
  }

  // Read JSON through overlay resolution
  const readJsonOverlay = async (containerPath, relativePath) => {
    const resolved = resolveFacetFile(containerPath, relativePath)
    if (!resolved) return null
    return readJson(resolved)
  }

  // Read file through overlay resolution
  const readFileOverlay = async (containerPath, relativePath) => {
    const resolved = resolveFacetFile(containerPath, relativePath)
    if (!resolved) return null
    return readFile(resolved)
  }

  // Check if facet is requested (handles paths like schemas/input)
  const hasFacet = (facets, name) => {
    if (!facets) return true  // null = all facets
    return facets.some(f => getBaseFacet(f) === name)
  }

  // Get suffix for a facet (schemas/input -> input, schemas -> null)
  const getFacetSuffix = (facets, name) => {
    if (!facets) return null
    const match = facets.find(f => getBaseFacet(f) === name)
    return match ? getFileFilter(match) : null
  }

  return {
    // Parse --facet flag into array (supports paths like schemas/input)
    parseFacets(facetInput) {
      if (!facetInput || facetInput === true) return null  // all facets
      if (typeof facetInput === 'string') {
        const facets = facetInput.split(',').map(f => f.trim()).filter(f => ALL_FACETS.includes(getBaseFacet(f)))
        return facets.length > 0 ? facets : null
      }
      return null
    },

    // Build container with facets at detail level
    async buildContainer(detailLevel, facets) {
      const report = await getReport()

      const containerPath = getContainerPath()

      // Read container identity (through overlay)
      const identity = await readJsonOverlay(containerPath, 'index.json')
      if (!identity) return null

      // Container detail level: full if 'container' in facets, topline otherwise
      const containerDetailLevel = hasFacet(facets, 'container') ? detailLevel : 'topline'
      const container = report.buildContainer(identity, containerDetailLevel)

      // Api facet (only if container has children)
      if (hasFacet(facets, 'children') && identity.instance?.children?.list?.length > 0) {
        container.facets.push(report.buildChildren(identity, detailLevel))
      }

      // Handler facet
      if (hasFacet(facets, 'handler')) {
        const handlerContent = await readFileOverlay(containerPath, 'index.js')
        if (handlerContent) {
          container.facets.push(report.buildHandler(handlerContent, detailLevel))
        }
      }

      // Schemas facet (through overlay - inherits from parent types)
      if (hasFacet(facets, 'schemas')) {
        const schemasManifest = await readJsonOverlay(containerPath, '_schemas/index.json')
        if (schemasManifest) {
          this.applyFacetFilter(facets, 'schemas', schemasManifest, 'files', '.avsc')
          const schemaContents = {}
          const filesField = schemasManifest.files || {}
          const files = Array.isArray(filesField) ? filesField : Object.keys(filesField)
          for (const fileName of files) {
            const content = await readJsonOverlay(containerPath, `_schemas/${fileName}`)
            if (content) schemaContents[fileName] = content
          }
          container.facets.push(report.buildSchemas(schemasManifest, schemaContents, detailLevel))
        }
      }

      // Lib facet (through overlay)
      if (hasFacet(facets, 'lib')) {
        const libManifest = await readJsonOverlay(containerPath, '_lib/index.json')
        if (libManifest) {
          const libFileContents = {}
          const libFiles = libManifest.files || {}
          for (const fileName of Object.keys(libFiles)) {
            const content = await readFileOverlay(containerPath, `_lib/${fileName}`)
            if (content) libFileContents[fileName] = content
          }
          container.facets.push(report.buildLib(libManifest, libFileContents, detailLevel))
        }
      }

      // Reqs facet (through overlay)
      if (hasFacet(facets, 'reqs')) {
        const reqsManifest = await readJsonOverlay(containerPath, '_reqs/index.json')
        if (reqsManifest) {
          const reqsFileContents = {}
          const requirements = reqsManifest.requirements || []
          for (const req of requirements) {
            if (req.file) {
              const content = await readFileOverlay(containerPath, `_reqs/${req.file}`)
              if (content) reqsFileContents[req.file] = content
            }
          }
          container.facets.push(report.buildReqs(reqsManifest, reqsFileContents, detailLevel))
        }
      }

      return container
    },

    // Apply suffix filter to facet files (mutates manifest)
    applyFacetFilter(facets, facetName, manifest, fileField = 'files', extension = '') {
      const suffix = getFacetSuffix(facets, facetName)
      if (suffix && manifest[fileField]) {
        const files = manifest[fileField]
        if (Array.isArray(files)) {
          manifest[fileField] = files.filter(f => f.replace(extension, '') === suffix)
        } else {
          // Map format - filter keys
          const filtered = {}
          for (const [k, v] of Object.entries(files)) {
            if (k.replace(extension, '') === suffix) filtered[k] = v
          }
          manifest[fileField] = filtered
        }
      }
    },

    // Build type stack: delegates to module.buildTypeStack
    // stackType: 'full' (default), 'extends', or 'instantiates'
    buildTypeStack(stackType = 'full') {
      const containerPath = getContainerPath()
      return module.buildTypeStack(containerPath, stackType)
    },

    // Get levels info string
    getLevelsInfo() {
      const stack = this.buildTypeStack()
      const containerPath = getContainerPath()
      const parts = stack.map((t, i) => `${i + 1} ${t}`)
      return `${containerPath} levels: ${parts.join(', ')}`
    },

    // Build container at specific level (uses overlay resolution)
    async buildContainerAtLevel(levelName, detailLevel, facets) {
      const report = await getReport()

      // levelName is the container path (e.g., spl/container)
      const containerPath = levelName

      // Read container identity (through overlay)
      const identity = await readJsonOverlay(containerPath, 'index.json')
      if (!identity) return null

      // Container detail level: full if 'container' in facets, topline otherwise
      const containerDetailLevel = hasFacet(facets, 'container') ? detailLevel : 'topline'
      const container = report.buildContainer(identity, containerDetailLevel)

      // Api facet (only if container has children)
      if (hasFacet(facets, 'children') && identity.instance?.children?.list?.length > 0) {
        container.facets.push(report.buildChildren(identity, detailLevel))
      }

      // Handler facet
      if (hasFacet(facets, 'handler')) {
        const handlerContent = await readFileOverlay(containerPath, 'index.js')
        if (handlerContent) {
          container.facets.push(report.buildHandler(handlerContent, detailLevel))
        }
      }

      // Schemas facet (through overlay)
      if (hasFacet(facets, 'schemas')) {
        const schemasManifest = await readJsonOverlay(containerPath, '_schemas/index.json')
        if (schemasManifest) {
          this.applyFacetFilter(facets, 'schemas', schemasManifest, 'files', '.avsc')
          const schemaContents = {}
          const filesField = schemasManifest.files || {}
          const files = Array.isArray(filesField) ? filesField : Object.keys(filesField)
          for (const fileName of files) {
            const content = await readJsonOverlay(containerPath, `_schemas/${fileName}`)
            if (content) schemaContents[fileName] = content
          }
          container.facets.push(report.buildSchemas(schemasManifest, schemaContents, detailLevel))
        }
      }

      // Lib facet (through overlay)
      if (hasFacet(facets, 'lib')) {
        const libManifest = await readJsonOverlay(containerPath, '_lib/index.json')
        if (libManifest) {
          const libFileContents = {}
          const libFiles = libManifest.files || {}
          for (const fileName of Object.keys(libFiles)) {
            const content = await readFileOverlay(containerPath, `_lib/${fileName}`)
            if (content) libFileContents[fileName] = content
          }
          container.facets.push(report.buildLib(libManifest, libFileContents, detailLevel))
        }
      }

      // Reqs facet (through overlay)
      if (hasFacet(facets, 'reqs')) {
        const reqsManifest = await readJsonOverlay(containerPath, '_reqs/index.json')
        if (reqsManifest) {
          const reqsFileContents = {}
          const requirements = reqsManifest.requirements || []
          for (const req of requirements) {
            if (req.file) {
              const content = await readFileOverlay(containerPath, `_reqs/${req.file}`)
              if (content) reqsFileContents[req.file] = content
            }
          }
          container.facets.push(report.buildReqs(reqsManifest, reqsFileContents, detailLevel))
        }
      }

      return container
    },

    // Build type chain (--levels)
    async buildChain(depthLevel, detailLevel, facets) {
      // TODO: implement type chain traversal
      return []
    },

    // Render freetext from structured report
    async renderFreetext(report, level = 'summary', options = {}) {
      const freetext = await getFreetext()
      return freetext.render(report, level, options)
    }
  }
}
