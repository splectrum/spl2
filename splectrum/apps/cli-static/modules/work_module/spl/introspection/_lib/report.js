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
//   buildChildren(indexJson)   - children facet
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

      // Build lineage info for topline
      const lineage = []
      if (identity.extends) lineage.push(`extends: ${identity.extends}`)
      if (identity.instantiates) lineage.push(`instantiates: ${identity.instantiates}`)
      const topline = lineage.length > 0
        ? `${identity.name} | (${lineage.join(', ')})`
        : identity.name

      const result = {
        name: 'container',
        topline,
        facets: []
      }

      // Summary: add purpose (if level allows)
      if (maxIdx >= 1 && identity.purpose) {
        result.summary = identity.purpose
      }

      return result
    },

    // Build children facet
    // Reads from instance.children.list and instance.children.type
    buildChildren(identity) {
      const children = identity.instance?.children
      if (!children || !children.list || children.list.length === 0) {
        return { name: 'children', topline: 'children | empty' }
      }

      const childList = children.list
      const childType = children.type || 'unknown'
      const result = {
        name: 'children',
        topline: `children | ${childList.length} [${childType}]`,
        detail: childList.join(', ')
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
    buildSchemas(manifest, schemaContents = {}, detailLevel = 'enriched') {
      const levels = ['topline', 'summary', 'detail', 'enriched']
      const maxIdx = levels.indexOf(detailLevel)
      // Handle both array (legacy) and map (current) formats
      const filesField = manifest.files || {}
      const files = Array.isArray(filesField) ? filesField : Object.keys(filesField)

      const result = {
        name: 'schemas',
        topline: `schemas | ${files.join(', ') || 'empty'}`
      }

      if (maxIdx >= 1 && manifest.purpose) {
        result.summary = manifest.purpose
      }

      // Detail: show schema fields
      if (maxIdx >= 2) {
        const schemaDetails = []
        for (const fileName of files) {
          const schema = schemaContents[fileName]
          if (schema && schema.fields) {
            const fieldLines = schema.fields.map(f => {
              const typeStr = typeof f.type === 'string' ? f.type : formatAvroType(f.type)
              const defaultStr = f.default !== undefined ? ` (default: ${f.default})` : ''
              const docStr = f.doc ? ` - ${f.doc}` : ''
              return `  --${f.name}: ${typeStr}${defaultStr}${docStr}`
            })
            schemaDetails.push(fieldLines.join('\n'))
          }
        }
        if (schemaDetails.length > 0) {
          result.detail = schemaDetails.join('\n')
        }
      }

      // Enriched: full schema JSON
      if (maxIdx >= 3 && Object.keys(schemaContents).length > 0) {
        result.enriched = JSON.stringify(schemaContents, null, 2)
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
    buildReqs(manifest, fileContents = {}, detailLevel = 'enriched') {
      const levels = ['topline', 'summary', 'detail', 'enriched']
      const maxIdx = levels.indexOf(detailLevel)

      const requirements = manifest.requirements || []
      const fileNames = requirements.map(r => r.name || r.file)

      const result = {
        name: 'reqs',
        topline: `reqs | ${fileNames.join(', ') || 'empty'}`
      }

      // Summary: purpose from manifest
      if (maxIdx >= 1 && manifest.purpose) {
        result.summary = manifest.purpose
      }

      // Detail: requirements list with descriptions
      if (maxIdx >= 2 && requirements.length > 0) {
        result.detail = requirements.map(r => `${r.name}: ${r.description}`).join('\n')
      }

      // Enriched: actual file contents
      if (maxIdx >= 3 && Object.keys(fileContents).length > 0) {
        const contents = Object.entries(fileContents)
          .map(([file, content]) => `--- ${file} ---\n${content}`)
          .join('\n\n')
        result.enriched = contents
      }

      return result
    }
  }
}

// Count total methods (children)
function countMethods(identity) {
  return identity.instance?.children?.list?.length || 0
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

// Format Avro type for display
function formatAvroType(type) {
  if (Array.isArray(type)) {
    // Union type like ["null", "string"] or ["null", { type: "enum", ... }]
    const types = type.map(t => {
      if (t === 'null') return null
      if (typeof t === 'string') return t
      if (t.type === 'enum') return t.symbols ? t.symbols.join('|') : 'enum'
      return JSON.stringify(t)
    }).filter(Boolean)
    return types.join('|')
  }
  if (typeof type === 'object') {
    if (type.type === 'enum') return type.symbols ? type.symbols.join('|') : 'enum'
    return JSON.stringify(type)
  }
  return String(type)
}
