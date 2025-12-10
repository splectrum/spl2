// report.js - Build four-level structure from flat facts
//
// Each level contains only INCREMENTAL information:
// - topline: identity/existence
// - summary: purpose/description
// - detail: full breakdown
// - enriched: source code
//
// Exports:
//   buildContainer(indexJson)  - container envelope
//   buildApi(indexJson)        - api facet
//   buildHandler(content)      - handler facet
//   buildSchemas(indexJson)    - schemas facet
//   buildLib(indexJson)        - lib facet
//   buildReqs(indexJson)       - reqs facet

export function create(module) {

  return {
    // Build container envelope
    // detailLevel caps what gets included
    buildContainer(identity, detailLevel = 'enriched') {
      const levels = ['topline', 'summary', 'detail', 'enriched']
      const maxIdx = levels.indexOf(detailLevel)

      const result = {
        name: 'container',
        topline: `${identity.name} | ${identity.type || 'container'}`,
        facets: []
      }

      // Summary: add purpose (if level allows)
      if (maxIdx >= 1 && identity.purpose) {
        result.summary = identity.purpose
      }

      // Detail: add extends/instantiates if present (if level allows)
      if (maxIdx >= 2) {
        const lineage = []
        if (identity.extends) lineage.push(`extends: ${identity.extends}`)
        if (identity.instantiates) lineage.push(`instantiates: ${identity.instantiates}`)
        if (lineage.length > 0) {
          result.detail = lineage.join(' | ')
        }
      }

      return result
    },

    // Build api facet
    buildApi(identity) {
      const apiFacets = identity.api ? Object.keys(identity.api) : []
      const methodCount = countMethods(identity)

      const result = {
        name: 'api',
        topline: `api | ${apiFacets.length} facets, ${methodCount} methods`
      }

      // Detail: method breakdown
      if (identity.api) {
        const lines = []
        for (const [facetName, methods] of Object.entries(identity.api)) {
          if (Array.isArray(methods) && methods.length > 0) {
            lines.push(`${facetName}: ${methods.join(', ')}`)
          }
        }
        if (lines.length > 0) {
          result.detail = lines.join('\n')
        }
      }

      return result
    },

    // Build handler facet
    buildHandler(content) {
      // Extract comment after container name
      const match = content.match(/\/\/\s*\S+\s*-\s*(.+)/)
      const title = match ? match[1].trim() : 'implemented'

      const result = {
        name: 'handler',
        topline: `handler | ${title}`
      }

      // Enriched: source code
      if (content) {
        result.enriched = content
      }

      return result
    },

    // Build schemas facet
    buildSchemas(manifest) {
      const files = manifest.files || []

      const result = {
        name: 'schemas',
        topline: `schemas | ${files.join(', ') || 'empty'}`
      }

      if (manifest.purpose) {
        result.summary = manifest.purpose
      }

      return result
    },

    // Build lib facet
    buildLib(manifest, fileContents = {}) {
      const manifestFiles = manifest.files || {}
      const fileNames = Object.keys(manifestFiles)

      const result = {
        name: 'lib',
        topline: `lib | ${fileNames.join(', ') || 'empty'}`
      }

      if (manifest.purpose) {
        result.summary = manifest.purpose
      }

      // Detail: exports per file
      const detailLines = []
      for (const [fileName, content] of Object.entries(fileContents)) {
        const exports = extractExports(content)
        if (exports.length > 0) {
          detailLines.push(`${fileName}: ${exports.join(', ')}`)
        }
      }
      if (detailLines.length > 0) {
        result.detail = detailLines.join('\n')
      }

      // Enriched: full source code
      const enrichedParts = []
      for (const [fileName, content] of Object.entries(fileContents)) {
        enrichedParts.push(`=== ${fileName} ===\n${content}`)
      }
      if (enrichedParts.length > 0) {
        result.enriched = enrichedParts.join('\n\n')
      }

      return result
    },

    // Build reqs facet
    buildReqs(manifest) {
      const files = manifest.files || []

      const result = {
        name: 'reqs',
        topline: `reqs | ${files.join(', ') || 'empty'}`
      }

      if (manifest.purpose) {
        result.summary = manifest.purpose
      }

      return result
    }
  }
}

// Count total methods
function countMethods(identity) {
  if (!identity.api) return 0
  let count = 0
  for (const facet of Object.values(identity.api)) {
    if (Array.isArray(facet)) count += facet.length
  }
  return count
}

// Extract exported function names from source
function extractExports(content) {
  const exports = []
  const shorthandMatches = content.matchAll(/^\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm)
  for (const match of shorthandMatches) {
    const name = match[1]
    if (!['create', 'if', 'for', 'while', 'switch', 'catch', 'function'].includes(name)) {
      exports.push(name)
    }
  }
  return [...new Set(exports)]
}
