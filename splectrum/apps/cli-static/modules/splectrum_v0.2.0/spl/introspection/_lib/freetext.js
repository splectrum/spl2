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
    renderWithLevels(report, level = 'detail') {
      if (!report) return ''

      const lines = []

      // Report topline always shown
      if (report.topline) lines.push(report.topline)

      if (level === 'topline') {
        return lines.join('\n')
      }

      // Summary level: compact grouped format
      if (report.levels) {
        const fail = []
        const pass = []
        const skip = []

        for (const levelResult of report.levels) {
          const name = levelResult.topline?.split(' | ')[0] || 'unknown'
          const status = levelResult.topline?.split(' | ')[1]?.split(' ')[0] || ''

          if (status === 'FAIL') {
            // Include failed runner names
            const failedRunners = (levelResult.runners || [])
              .filter(r => !r.pass)
              .map(r => r.topline?.split(' | ')[0])
              .join(', ')
            fail.push(failedRunners ? `${name} - ${failedRunners}` : name)
          } else if (status === 'PASS') {
            const runnerCount = levelResult.summary || ''
            pass.push(runnerCount ? `${name} (${runnerCount.split(' ')[0]})` : name)
          } else {
            skip.push(name)
          }
        }

        // FAIL first, then PASS, then SKIP - omit empty
        if (fail.length > 0) lines.push(`  FAIL: ${fail.join(', ')}`)
        if (pass.length > 0) lines.push(`  PASS: ${pass.join(', ')}`)
        if (skip.length > 0) lines.push(`  SKIP: ${skip.join(', ')}`)
      }

      if (level === 'summary') {
        return lines.join('\n')
      }

      // Detail level: show runner detail for FAIL only
      // Enriched level: show runner detail for all
      if (report.levels) {
        for (const levelResult of report.levels) {
          if (!levelResult.runners || levelResult.runners.length === 0) continue

          // Sort runners: FAIL first
          const sortedRunners = [...levelResult.runners].sort((a, b) => {
            if (!a.pass && b.pass) return -1
            if (a.pass && !b.pass) return 1
            return 0
          })

          const levelName = levelResult.topline?.split(' | ')[0] || ''
          let hasOutput = false

          for (const runner of sortedRunners) {
            // Detail: FAIL only; Enriched: all
            if (level === 'detail' && runner.pass) continue

            if (!hasOutput) {
              lines.push(`  ${levelName}`)
              hasOutput = true
            }

            const status = runner.topline?.split(' | ')[1] || ''
            const name = runner.topline?.split(' | ')[0] || ''
            lines.push(`    ${name} | ${status} - ${runner.summary || ''}`)

            // Show detail (e.g., failed test lines) if present
            if (runner.detail) {
              for (const line of runner.detail.split('\n')) {
                lines.push(`      ${line}`)
              }
            }

            // Show file-level details if present (e.g., lib, schemas runners)
            if (runner.files) {
              for (const file of runner.files) {
                if (level === 'detail' && file.pass) continue
                if (file.detail) {
                  lines.push(`      ${file.name}: ${file.detail}`)
                }
                if (level === 'enriched' && file.enriched) {
                  for (const line of file.enriched.split('\n')) {
                    lines.push(`        ${line}`)
                  }
                }
              }
            }

            // Show check-level details if present (e.g., container, handler runners)
            if (runner.checks) {
              for (const check of runner.checks) {
                if (level === 'detail' && check.pass) continue
                if (check.detail) {
                  lines.push(`      ${check.name}: ${check.detail}`)
                }
                if (level === 'enriched' && check.enriched) {
                  for (const line of check.enriched.split('\n')) {
                    lines.push(`        ${line}`)
                  }
                }
              }
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
