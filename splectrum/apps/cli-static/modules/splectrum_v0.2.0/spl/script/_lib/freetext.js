// freetext.js - Generic doc-style JSON renderer
//
// Renders structured JSON (title, description, sections, commands, etc.) to freetext.
// For use with scripts like get-started.
//
// Usage:
//   const ft = await module.require("lib/spl/script/freetext.js")
//   console.log(ft.render(data))

export function create(module) {
  return {
    /**
     * Render doc-style JSON to freetext
     * @param {Object} data - Structured data
     * @returns {string} - Rendered text
     */
    render(data) {
      if (!data) return ''
      const lines = []
      renderNode(data, lines, 0)
      return lines.join('\n')
    }
  }
}

function renderNode(node, lines, indent) {
  const pad = '  '.repeat(indent)

  // Title with underline
  if (node.title) {
    lines.push(pad + node.title)
    lines.push(pad + '='.repeat(node.title.length))
  }

  // Description
  if (node.description) {
    lines.push(pad + node.description)
  }

  // Add blank line after title block
  if (node.title || node.description) {
    lines.push('')
  }

  // Topics list (intro format)
  if (node.topics) {
    lines.push(pad + 'Topics:')
    for (const t of node.topics) {
      lines.push(pad + `  ${t.name} - ${t.description}`)
    }
    lines.push('')
  }

  // Examples list
  if (node.examples) {
    lines.push(pad + 'Examples:')
    for (const e of node.examples) {
      lines.push(pad + `  ${e.command}`)
      lines.push(pad + `    ${e.description}`)
    }
    lines.push('')
  }

  // Sections (topic format)
  if (node.sections) {
    for (const section of node.sections) {
      // Section header
      lines.push(pad + section.name)
      lines.push(pad + '-'.repeat(section.name.length))
      if (section.description) {
        lines.push(pad + section.description)
      }

      // Commands
      if (section.commands) {
        for (const c of section.commands) {
          lines.push(pad + `  ${c.command}`)
          lines.push(pad + `    ${c.description}`)
        }
      }

      // Options
      if (section.options) {
        for (const o of section.options) {
          lines.push(pad + `  ${o.flag} - ${o.description}`)
        }
      }

      // Runners
      if (section.runners) {
        for (const r of section.runners) {
          lines.push(pad + `  ${r.name} - ${r.description}`)
        }
      }

      // Functions
      if (section.functions) {
        for (const f of section.functions) {
          lines.push(pad + `  ${f.name}`)
          lines.push(pad + `    ${f.description}`)
        }
      }

      lines.push('')
    }
  }
}
