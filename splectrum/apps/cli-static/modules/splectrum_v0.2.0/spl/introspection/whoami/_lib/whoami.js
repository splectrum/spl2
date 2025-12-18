// whoami.js - Container introspection lib
//
// Exports:
//   parseFacets(input)                    - parse --facet flag
//   buildContainer(detailLevel, facets)  - build container with facets
//   buildChain(depthLevel, detailLevel, facets) - traverse type chain
//   renderFreetext(container, level)     - render to natural language

import fs from 'fs'
import path from 'path'

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
  let _report = null
  let _freetext = null

  const getReport = async () => {
    if (!_report) _report = await module.require('lib/spl/container/report.js')
    return _report
  }

  const getFreetext = async () => {
    if (!_freetext) _freetext = await module.require('lib/spl/container/freetext.js')
    return _freetext
  }

  // Get parent container path from method path (resolves to physical location)
  const getContainerPath = () => {
    const methodPath = module.getMethod()
    const calledContainerPath = methodPath.split('/').slice(0, -1).join('/')

    // Check if the called container physically exists
    const resolvedPath = module.resolve(calledContainerPath, 'index.json')
    if (resolvedPath) {
      // Container exists - read its identity to get the canonical name
      try {
        const identity = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
        if (identity.name) return identity.name
      } catch (e) {
        // Fall through
      }
      return calledContainerPath
    }

    // Container doesn't exist - it's an inherited method
    // Extract method name and parent path, then find where method physically lives
    const pathParts = calledContainerPath.split('/')
    const methodName = pathParts.pop()
    const parentPath = pathParts.join('/')

    // Walk the extends chain of the parent to find where this method exists
    const { stack } = module.buildTypeStack(parentPath, 'extends')

    for (const typePath of stack) {
      // Check if this type has the method as a child
      const typeIndexPath = module.resolve(typePath, 'index.json')
      if (!typeIndexPath) continue

      try {
        const typeIdentity = JSON.parse(fs.readFileSync(typeIndexPath, 'utf8'))
        const children = typeIdentity.instance?.children?.list || []
        if (children.includes(methodName)) {
          // Found it - the physical container is typePath/methodName
          return `${typePath}/${methodName}`
        }
      } catch (e) {
        continue
      }
    }

    // Fallback to called path
    return calledContainerPath
  }

  // Get filesystem path for container
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

  // Read JSON file, return null if not found
  const readJson = (filePath) => {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      return null
    }
  }

  // Read file content, return null if not found
  const readFile = (filePath) => {
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
  const readJsonOverlay = (containerPath, relativePath) => {
    const resolved = resolveFacetFile(containerPath, relativePath)
    if (!resolved) return null
    return readJson(resolved)
  }

  // Read file through overlay resolution
  const readFileOverlay = (containerPath, relativePath) => {
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
      const identity = readJsonOverlay(containerPath, 'index.json')
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
        const handlerContent = readFileOverlay(containerPath, 'index.js')
        if (handlerContent) {
          container.facets.push(report.buildHandler(handlerContent, detailLevel))
        }
      }

      // Schemas facet (through overlay - inherits from parent types)
      if (hasFacet(facets, 'schemas')) {
        const schemasManifest = readJsonOverlay(containerPath, '_schemas/index.json')
        if (schemasManifest) {
          this.applyFacetFilter(facets, 'schemas', schemasManifest, 'files', '.avsc')
          const schemaContents = {}
          const filesField = schemasManifest.files || {}
          const files = Array.isArray(filesField) ? filesField : Object.keys(filesField)
          for (const fileName of files) {
            const content = readJsonOverlay(containerPath, `_schemas/${fileName}`)
            if (content) schemaContents[fileName] = content
          }
          container.facets.push(report.buildSchemas(schemasManifest, schemaContents, detailLevel))
        }
      }

      // Lib facet (through overlay)
      if (hasFacet(facets, 'lib')) {
        const libManifest = readJsonOverlay(containerPath, '_lib/index.json')
        if (libManifest) {
          const libFileContents = {}
          const libFiles = libManifest.files || {}
          for (const fileName of Object.keys(libFiles)) {
            const content = readFileOverlay(containerPath, `_lib/${fileName}`)
            if (content) libFileContents[fileName] = content
          }
          container.facets.push(report.buildLib(libManifest, libFileContents, detailLevel))
        }
      }

      // Reqs facet (through overlay)
      if (hasFacet(facets, 'reqs')) {
        const reqsManifest = readJsonOverlay(containerPath, '_reqs/index.json')
        if (reqsManifest) {
          const reqsFileContents = {}
          const requirements = reqsManifest.requirements || []
          for (const req of requirements) {
            if (req.file) {
              const content = readFileOverlay(containerPath, `_reqs/${req.file}`)
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

    // Build container at specific level (direct reads - no overlay inheritance)
    async buildContainerAtLevel(levelName, detailLevel, facets) {
      const report = await getReport()

      // levelName is the container path (e.g., spl/container)
      const containerPath = levelName
      const containerFsPath = getContainerFsPath(containerPath)
      if (!containerFsPath) return null

      // Read container identity directly (no overlay)
      const identity = readJson(path.join(containerFsPath, 'index.json'))
      if (!identity) return null

      // Container detail level: full if 'container' in facets, topline otherwise
      const containerDetailLevel = hasFacet(facets, 'container') ? detailLevel : 'topline'
      const container = report.buildContainer(identity, containerDetailLevel)

      // Api facet (only if container has children)
      if (hasFacet(facets, 'children') && identity.instance?.children?.list?.length > 0) {
        container.facets.push(report.buildChildren(identity, detailLevel))
      }

      // Handler facet (direct read)
      if (hasFacet(facets, 'handler')) {
        const handlerContent = readFile(path.join(containerFsPath, 'index.js'))
        if (handlerContent) {
          container.facets.push(report.buildHandler(handlerContent, detailLevel))
        }
      }

      // Schemas facet (direct read - only what's at this level)
      if (hasFacet(facets, 'schemas')) {
        const schemasManifest = readJson(path.join(containerFsPath, '_schemas/index.json'))
        if (schemasManifest) {
          this.applyFacetFilter(facets, 'schemas', schemasManifest, 'files', '.avsc')
          const schemaContents = {}
          const filesField = schemasManifest.files || {}
          const files = Array.isArray(filesField) ? filesField : Object.keys(filesField)
          for (const fileName of files) {
            const content = readJson(path.join(containerFsPath, '_schemas', fileName))
            if (content) schemaContents[fileName] = content
          }
          container.facets.push(report.buildSchemas(schemasManifest, schemaContents, detailLevel))
        }
      }

      // Lib facet (direct read)
      if (hasFacet(facets, 'lib')) {
        const libManifest = readJson(path.join(containerFsPath, '_lib/index.json'))
        if (libManifest) {
          const libFileContents = {}
          const libFiles = libManifest.files || {}
          for (const fileName of Object.keys(libFiles)) {
            const content = readFile(path.join(containerFsPath, '_lib', fileName))
            if (content) libFileContents[fileName] = content
          }
          container.facets.push(report.buildLib(libManifest, libFileContents, detailLevel))
        }
      }

      // Reqs facet (direct read)
      if (hasFacet(facets, 'reqs')) {
        const reqsManifest = readJson(path.join(containerFsPath, '_reqs/index.json'))
        if (reqsManifest) {
          const reqsFileContents = {}
          const requirements = reqsManifest.requirements || []
          for (const req of requirements) {
            if (req.file) {
              const content = readFile(path.join(containerFsPath, '_reqs', req.file))
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
