// whoami.js - Container introspection lib
//
// Exports:
//   parseFacets(input)                    - parse --facet flag
//   buildContainer(detailLevel, facets)  - build container with facets
//   buildChain(depthLevel, detailLevel, facets) - traverse type chain
//   renderFreetext(container, level)     - render to natural language

const ALL_FACETS = ['container', 'api', 'handler', 'schemas', 'lib', 'reqs']

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

  // Check if facet is requested
  const hasFacet = (facets, name) => {
    if (!facets) return true  // null = all facets
    return facets.includes(name)
  }

  return {
    // Parse --facet flag into array
    parseFacets(facetInput) {
      if (!facetInput || facetInput === true) return null  // all facets
      if (typeof facetInput === 'string') {
        const facets = facetInput.split(',').map(f => f.trim()).filter(f => ALL_FACETS.includes(f))
        return facets.length > 0 ? facets : null
      }
      return null
    },

    // Build container with facets at detail level
    async buildContainer(detailLevel, facets) {
      const path = await getPath()
      const report = await getReport()

      const containerPath = getContainerPath()
      const containerFsPath = await getContainerFsPath(containerPath)

      // Read container identity
      const identity = await readJson(path.join(containerFsPath, 'index.json'))
      if (!identity) return null

      // Container detail level: full if 'container' in facets, topline otherwise
      const containerDetailLevel = hasFacet(facets, 'container') ? detailLevel : 'topline'
      const container = report.buildContainer(identity, containerDetailLevel)

      // Api facet
      if (hasFacet(facets, 'api')) {
        container.facets.push(report.buildApi(identity, detailLevel))
      }

      // Handler facet
      if (hasFacet(facets, 'handler')) {
        const handlerContent = await readFile(path.join(containerFsPath, 'index.js'))
        if (handlerContent) {
          container.facets.push(report.buildHandler(handlerContent, detailLevel))
        }
      }

      // Schemas facet
      if (hasFacet(facets, 'schemas')) {
        const schemasManifest = await readJson(path.join(containerFsPath, '_schemas', 'index.json'))
        if (schemasManifest) {
          container.facets.push(report.buildSchemas(schemasManifest, detailLevel))
        }
      }

      // Lib facet
      if (hasFacet(facets, 'lib')) {
        const libManifest = await readJson(path.join(containerFsPath, '_lib', 'index.json'))
        if (libManifest) {
          const libFileContents = {}
          const libFiles = libManifest.files || {}
          for (const fileName of Object.keys(libFiles)) {
            const content = await readFile(path.join(containerFsPath, '_lib', fileName))
            if (content) libFileContents[fileName] = content
          }
          container.facets.push(report.buildLib(libManifest, libFileContents, detailLevel))
        }
      }

      // Reqs facet
      if (hasFacet(facets, 'reqs')) {
        const reqsManifest = await readJson(path.join(containerFsPath, '_reqs', 'index.json'))
        if (reqsManifest) {
          container.facets.push(report.buildReqs(reqsManifest, detailLevel))
        }
      }

      return container
    },

    // Build type stack: instance chain first, then type chain, deduped
    // Returns array of type names from bottom (most base) to top (current)
    async buildTypeStack() {
      const path = await getPath()
      const containerPath = getContainerPath()
      const containerFsPath = await getContainerFsPath(containerPath)
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

    // Get levels info string
    async getLevelsInfo() {
      const stack = await this.buildTypeStack()
      const containerPath = getContainerPath()
      const parts = stack.map((t, i) => `${i + 1} ${t}`)
      return `${containerPath} levels: ${parts.join(', ')}`
    },

    // Build container at specific level
    async buildContainerAtLevel(levelName, detailLevel, facets) {
      const path = await getPath()
      const report = await getReport()

      const containerFsPath = await getContainerFsPath(levelName)
      if (!containerFsPath) return null

      // Read container identity
      const identity = await readJson(path.join(containerFsPath, 'index.json'))
      if (!identity) return null

      // Container detail level: full if 'container' in facets, topline otherwise
      const containerDetailLevel = hasFacet(facets, 'container') ? detailLevel : 'topline'
      const container = report.buildContainer(identity, containerDetailLevel)

      // Api facet
      if (hasFacet(facets, 'api')) {
        container.facets.push(report.buildApi(identity, detailLevel))
      }

      // Handler facet
      if (hasFacet(facets, 'handler')) {
        const handlerContent = await readFile(path.join(containerFsPath, 'index.js'))
        if (handlerContent) {
          container.facets.push(report.buildHandler(handlerContent, detailLevel))
        }
      }

      // Schemas facet
      if (hasFacet(facets, 'schemas')) {
        const schemasManifest = await readJson(path.join(containerFsPath, '_schemas', 'index.json'))
        if (schemasManifest) {
          container.facets.push(report.buildSchemas(schemasManifest, detailLevel))
        }
      }

      // Lib facet
      if (hasFacet(facets, 'lib')) {
        const libManifest = await readJson(path.join(containerFsPath, '_lib', 'index.json'))
        if (libManifest) {
          const libFileContents = {}
          const libFiles = libManifest.files || {}
          for (const fileName of Object.keys(libFiles)) {
            const content = await readFile(path.join(containerFsPath, '_lib', fileName))
            if (content) libFileContents[fileName] = content
          }
          container.facets.push(report.buildLib(libManifest, libFileContents, detailLevel))
        }
      }

      // Reqs facet
      if (hasFacet(facets, 'reqs')) {
        const reqsManifest = await readJson(path.join(containerFsPath, '_reqs', 'index.json'))
        if (reqsManifest) {
          container.facets.push(report.buildReqs(reqsManifest, detailLevel))
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
    async renderFreetext(report, level = 'summary') {
      const freetext = await getFreetext()
      return freetext.render(report, level)
    }
  }
}
