// report.js - Build four-level structure from flat facts
//
// Transforms index.json (flat facts) into four-level structure
// (topline/summary/detail).
//
// Hierarchical: container wraps facets as children.
//
// Exports:
//   buildContainer(indexJson)  - container (name, type, extends, instantiates, purpose)
//   buildApi(indexJson)        - api facet (apiFacets, methodCount)
//   buildHandler(content)      - handler facet from index.js content
//   buildSchemas(indexJson)    - schemas facet from _schemas/index.json
//   buildLib(indexJson)        - lib facet from _lib/index.json
//   buildReqs(indexJson)       - reqs facet from _reqs/index.json

export function create(module) {

  return {
    // Build container (facets added by orchestrator)
    buildContainer(identity) {
      return {
        name: 'container',
        topline: {
          containerName: identity.name,
          type: identity.type || 'container',
          extends: identity.extends,
          instantiates: identity.instantiates
        },
        summary: {
          containerName: identity.name,
          type: identity.type || 'container',
          extends: identity.extends,
          instantiates: identity.instantiates,
          purpose: identity.purpose
        },
        detail: {
          containerName: identity.name,
          type: identity.type || 'container',
          extends: identity.extends,
          instantiates: identity.instantiates,
          purpose: identity.purpose
        },
        facets: []  // populated by orchestrator
      }
    },

    // Build api facet - what this container can do
    buildApi(identity) {
      const apiFacets = identity.api ? Object.keys(identity.api) : []
      const methodCount = countMethods(identity)

      return {
        name: 'api',
        topline: {
          apiFacets,
          methodCount
        },
        summary: {
          apiFacets,
          methodCount
        },
        detail: {
          api: identity.api
        }
      }
    },

    // Build handler facet from index.js content
    buildHandler(content) {
      // Extract comment after container name: "// spl/container - description"
      const match = content.match(/\/\/\s*\S+\s*-\s*(.+)/)
      const title = match ? match[1].trim() : null

      return {
        name: 'handler',
        topline: {
          exists: true,
          title
        },
        summary: {
          exists: true,
          title
        },
        detail: {
          exists: true,
          title,
          content
        }
      }
    },

    // Build schemas facet from _schemas/index.json
    buildSchemas(manifest) {
      return {
        name: 'schemas',
        topline: {
          files: manifest.files || []
        },
        summary: {
          purpose: manifest.purpose,
          files: manifest.files || []
        },
        detail: {
          purpose: manifest.purpose,
          files: manifest.files || []
        }
      }
    },

    // Build lib facet from _lib/index.json and file contents
    // manifest.files is object: { "file.js": { req, exports } }
    // fileContents is object: { "file.js": "source code..." }
    buildLib(manifest, fileContents = {}) {
      const manifestFiles = manifest.files || {}
      const fileNames = Object.keys(manifestFiles)

      // Summary: from manifest (index.json)
      const summaryFiles = {}
      for (const [fileName, meta] of Object.entries(manifestFiles)) {
        summaryFiles[fileName] = { exports: meta.exports || [] }
      }

      // Detail: from source (extracted)
      const detailFiles = {}
      for (const [fileName, content] of Object.entries(fileContents)) {
        detailFiles[fileName] = { exports: extractExports(content) }
      }

      return {
        name: 'lib',
        topline: {
          files: fileNames
        },
        summary: {
          purpose: manifest.purpose,
          files: summaryFiles
        },
        detail: {
          purpose: manifest.purpose,
          files: detailFiles
        }
      }
    },

    // Build reqs facet from _reqs/index.json
    buildReqs(manifest) {
      return {
        name: 'reqs',
        topline: {
          files: manifest.files || []
        },
        summary: {
          purpose: manifest.purpose,
          files: manifest.files || []
        },
        detail: {
          purpose: manifest.purpose,
          files: manifest.files || []
        }
      }
    }
  }
}

// Count total methods from apiFacets
function countMethods(identity) {
  if (!identity.api) return 0
  let count = 0
  for (const facet of Object.values(identity.api)) {
    if (Array.isArray(facet)) count += facet.length
  }
  return count
}

// Extract exported function names from source code
// Handles: return { foo() {}, bar: function() {} } pattern in create() factory
function extractExports(content) {
  const exports = []

  // Find method definitions in the returned object
  // Pattern 1: methodName(args) { - method shorthand
  // Pattern 2: methodName: function - traditional
  // Pattern 3: methodName: async function
  // Pattern 4: async methodName(args) { - async shorthand

  // Method shorthand: name( or async name(
  const shorthandMatches = content.matchAll(/^\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm)
  for (const match of shorthandMatches) {
    const name = match[1]
    // Skip create function itself and common non-export names
    if (!['create', 'if', 'for', 'while', 'switch', 'catch', 'function'].includes(name)) {
      exports.push(name)
    }
  }

  return [...new Set(exports)] // dedupe
}
