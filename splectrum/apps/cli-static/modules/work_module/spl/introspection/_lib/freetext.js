// freetext.js - Generic freetext renderer
//
// Renders structured JSON with topline/summary/detail/enriched levels to text.
// Walks any JSON structure - no domain knowledge required.
//
// Exports:
//   render(json, level) - render JSON to freetext at level

const LEVEL_KEYS = ['topline', 'summary', 'detail', 'enriched']

export function create(module) {
  return {
    /**
     * Render structured JSON to freetext
     * @param {Object} json - Structured data with level keys
     * @param {string} level - Max level: 'topline'|'summary'|'detail'|'enriched'
     * @param {Object} options - { hide: 'topline,summary' } to exclude levels
     * @returns {string} - Freetext rendering
     */
    render(json, level = 'summary', options = {}) {
      if (!json) return ''

      const levelIdx = LEVEL_KEYS.indexOf(level)
      let include = levelIdx >= 0 ? LEVEL_KEYS.slice(0, levelIdx + 1) : ['summary']

      // Apply hide filter
      if (options.hide) {
        const hideSet = new Set(options.hide.split(',').map(s => s.trim()))
        include = include.filter(l => !hideSet.has(l))
      }

      const lines = []
      renderNode(json, 0, include, lines)
      return lines.join('\n')
    },

    /**
     * Render selfeval results with levels structure
     * @param {Object} report - { topline, summary, levels: [...] }
     * @param {string} level - Max level: 'topline'|'summary'|'detail'|'enriched'
     * @returns {string} - Freetext rendering
     */
    renderWithLevels(report, level = 'summary') {
      if (!report) return ''

      const levelIdx = LEVEL_KEYS.indexOf(level)
      const include = levelIdx >= 0 ? LEVEL_KEYS.slice(0, levelIdx + 1) : ['summary']

      const lines = []

      // Report topline and summary
      if (report.topline) lines.push(report.topline)
      if (include.includes('summary') && report.summary) lines.push(`  ${report.summary}`)

      // Each level
      if (report.levels) {
        for (const levelResult of report.levels) {
          if (levelResult.topline) lines.push(`  ${levelResult.topline}`)
          if (include.includes('summary') && levelResult.summary) {
            lines.push(`    ${levelResult.summary}`)
          }

          // Runners within each level (detail level and above)
          if (include.includes('detail') && levelResult.runners) {
            for (const runner of levelResult.runners) {
              if (runner.topline) lines.push(`      ${runner.topline}`)
              if (runner.summary) lines.push(`        ${runner.summary}`)
            }
          }
        }
      }

      return lines.join('\n')
    }
  }
}

// Walk JSON structure, render level keys
function renderNode(node, indent, include, lines) {
  if (!node || typeof node !== 'object') return

  const pad = '  '.repeat(indent)

  // Render level keys present in node AND in inclusion list
  for (const level of include) {
    if (node[level] !== undefined) {
      const text = valueToText(node[level])
      if (text) {
        // Handle multi-line values - indent each line
        for (const line of text.split('\n')) {
          lines.push(pad + line)
        }
      }
    }
  }

  // Recurse into non-level keys (arrays and objects)
  for (const [key, val] of Object.entries(node)) {
    if (LEVEL_KEYS.includes(key)) continue
    if (key === 'name') continue

    if (Array.isArray(val)) {
      for (const item of val) {
        renderNode(item, indent + 1, include, lines)
      }
    } else if (typeof val === 'object' && val !== null) {
      renderNode(val, indent + 1, include, lines)
    }
  }
}

// Convert value to text
function valueToText(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object' && value !== null) {
    return objectToText(value)
  }
  return ''
}

// Convert object to single line text
function objectToText(obj) {
  const parts = []
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue
    if (Array.isArray(val) && val.length > 0) {
      parts.push(`${key}: ${val.join(', ')}`)
    } else if (typeof val === 'string' && val) {
      parts.push(val)
    } else if (typeof val === 'number') {
      parts.push(`${key}: ${val}`)
    } else if (typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) {
        if (Array.isArray(v) && v.length > 0) {
          parts.push(`${k}: ${v.join(', ')}`)
        }
      }
    }
  }
  return parts.join(' | ')
}
