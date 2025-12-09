// freetext.js - Render four-level structure to natural language
//
// Transforms four-level structure into natural language text.
// Each function renders ONE level of ONE facet.
// No composition - caller decides how to combine.
//
// Exports per facet type:
//   renderIdentityTopline(report)   - identity topline
//   renderIdentitySummary(report)   - identity summary
//   renderHandlerTopline(report)    - handler topline
//   etc.

export function create(module) {

  // Render files list (abbreviated if long)
  const renderFilesList = (files, maxItems = 3) => {
    if (!files || files.length === 0) return 'empty'
    if (files.length <= maxItems) return files.join(', ')
    return `${files.length} files`
  }

  return {
    // === Identity (includes container-level info) ===

    renderIdentityTopline(report) {
      const t = report.topline
      // Container line: name - type (methods)
      let containerLine
      if (t.type === 'API' && t.methodCount > 0) {
        containerLine = `${t.containerName} - ${t.type} (${t.methodCount} methods)`
      } else {
        containerLine = `${t.containerName} - ${t.type}`
      }

      // Identity line: extends, apiFacets
      const parts = []
      if (t.extends) parts.push(`extends ${t.extends}`)
      if (t.apiFacets && t.apiFacets.length > 0) {
        parts.push(`${t.apiFacets.length} apiFacet${t.apiFacets.length > 1 ? 's' : ''}`)
      }
      const rollup = parts.length > 0 ? parts.join(', ') : 'base'
      const identityLine = `identity - ${rollup}`

      return { containerLine, facetLine: identityLine }
    },

    renderIdentitySummary(report) {
      const s = report.summary
      return s.purpose || ''
    },

    renderIdentityDetail(report) {
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
      return ''
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
