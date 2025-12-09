// freetext.js - Render four-level structure to natural language
//
// Transforms four-level structure into natural language text.
// Each function renders ONE level of ONE component.
// No composition - caller decides how to combine.
//
// Exports:
//   renderContainerTopline(report)  - container headline (name - type, lineage)
//   renderContainerSummary(report)  - container purpose
//   renderApiTopline(report)        - api facet (facet count, method count)
//   renderHandlerTopline(report)    - handler facet
//   etc.

export function create(module) {

  // Render files list (abbreviated if long)
  const renderFilesList = (files, maxItems = 3) => {
    if (!files || files.length === 0) return 'empty'
    if (files.length <= maxItems) return files.join(', ')
    return `${files.length} files`
  }

  return {
    // === Container ===

    renderContainerTopline(report) {
      const t = report.topline
      const parts = [`${t.containerName} - ${t.type}`]
      if (t.extends) parts.push(`extends ${t.extends}`)
      if (t.instantiates) parts.push(`instantiates ${t.instantiates}`)
      return parts.join(' | ')
    },

    renderContainerSummary(report) {
      const s = report.summary
      return s.purpose || ''
    },

    renderContainerDetail(report) {
      return ''
    },

    // === Api (what this container CAN DO) ===

    renderApiTopline(report) {
      const t = report.topline
      if (t.methodCount > 0) {
        return `api - ${t.apiFacets.length} facets, ${t.methodCount} methods`
      }
      return 'api - none'
    },

    renderApiSummary(report) {
      return ''
    },

    renderApiDetail(report) {
      const d = report.detail
      if (!d.api) return ''
      const lines = []
      for (const [facetName, methods] of Object.entries(d.api)) {
        lines.push(`${facetName}: ${methods.join(', ')}`)
      }
      return lines.join('\n')
    },

    // === Handler ===

    renderHandlerTopline(report) {
      const t = report.topline
      const rollup = t.exists ? (t.title || 'implemented') : 'not found'
      return `handler - ${rollup}`
    },

    renderHandlerSummary(report) {
      return ''
    },

    renderHandlerDetail(report) {
      return ''
    },

    // === Schemas ===

    renderSchemasTopline(report) {
      const t = report.topline
      return `schemas - ${renderFilesList(t.files)}`
    },

    renderSchemasSummary(report) {
      const s = report.summary
      return s.purpose || ''
    },

    renderSchemasDetail(report) {
      return ''
    },

    // === Lib ===

    renderLibTopline(report) {
      const t = report.topline
      return `lib - ${renderFilesList(t.files)}`
    },

    renderLibSummary(report) {
      const s = report.summary
      return s.purpose || ''
    },

    renderLibDetail(report) {
      const d = report.detail
      if (!d.files) return ''

      const lines = []
      for (const [fileName, info] of Object.entries(d.files)) {
        const exports = info.exports || []
        lines.push(`${fileName}: ${exports.join(', ')}`)
      }
      return lines.join('\n')
    },

    // === Reqs ===

    renderReqsTopline(report) {
      const t = report.topline
      return `reqs - ${renderFilesList(t.files)}`
    },

    renderReqsSummary(report) {
      const s = report.summary
      return s.purpose || ''
    },

    renderReqsDetail(report) {
      return ''
    }
  }
}
