// report.js - Build four-level structure from flat facts
//
// Transforms index.json (flat facts) into four-level structure
// (topline/summary/detail).
//
// One function per facet type - each facet has its own structure.
// No composition - caller decides how to combine.
//
// Exports:
//   buildIdentity(indexJson)   - identity facet from root index.json
//   buildHandler(content)      - handler facet from index.js content
//   buildSchemas(indexJson)    - schemas facet from _schemas/index.json
//   buildLib(indexJson)        - lib facet from _lib/index.json
//   buildReqs(indexJson)       - reqs facet from _reqs/index.json

export function create(module) {

  return {
    // Build identity facet from root index.json
    buildIdentity(identity) {
      const apiFacets = identity.api ? Object.keys(identity.api) : []
      const methodCount = countMethods(identity)

      return {
        name: 'identity',
        topline: {
          containerName: identity.name,
          type: identity.type || 'container',
          extends: identity.extends,
          instantiates: identity.instantiates,
          apiFacets,
          methodCount
        },
        summary: {
          containerName: identity.name,
          type: identity.type || 'container',
          purpose: identity.purpose,
          extends: identity.extends,
          instantiates: identity.instantiates,
          apiFacets,
          methodCount
        },
        detail: {
          containerName: identity.name,
          type: identity.type || 'container',
          purpose: identity.purpose,
          extends: identity.extends,
          instantiates: identity.instantiates,
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

    // Build lib facet from _lib/index.json
    buildLib(manifest) {
      return {
        name: 'lib',
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
