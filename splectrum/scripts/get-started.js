/*
 * scripts/get-started.js - Quick reference for SPL commands
 * Usage: spl get-started [topic] [--raw]
 *
 * AI-first: reads from docs/get-started/*.json
 * --raw returns JSON directly, default renders for humans
 */
const fs = await module.require('fs')
const path = await module.require('path')

const input = module.input()
const topic = input['0'] || 'intro'
const raw = input.raw === true

const nodeRoot = module.getNodeRoot()
const docsPath = path.join(nodeRoot, 'docs', 'get-started')

// List available topics
function listTopics() {
  try {
    return fs.readdirSync(docsPath)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
      .filter(t => t !== 'intro')
  } catch (e) {
    return []
  }
}

// Render JSON for humans
function render(data) {
  const lines = []

  lines.push(data.title)
  lines.push('='.repeat(data.title.length))
  if (data.description) lines.push(data.description)
  lines.push('')

  // Intro format
  if (data.topics) {
    lines.push('Topics:')
    for (const t of data.topics) {
      lines.push(`  ${t.name} - ${t.description}`)
    }
    lines.push('')
  }

  if (data.examples) {
    lines.push('Examples:')
    for (const e of data.examples) {
      lines.push(`  ${e.command}`)
      lines.push(`    ${e.description}`)
    }
    lines.push('')
  }

  // Section format
  if (data.sections) {
    for (const section of data.sections) {
      lines.push(section.name)
      lines.push('-'.repeat(section.name.length))
      if (section.description) lines.push(section.description)

      if (section.commands) {
        for (const c of section.commands) {
          lines.push(`  ${c.command}`)
          lines.push(`    ${c.description}`)
        }
      }

      if (section.options) {
        for (const o of section.options) {
          lines.push(`  ${o.flag} - ${o.description}`)
        }
      }

      if (section.runners) {
        for (const r of section.runners) {
          lines.push(`  ${r.name} - ${r.description}`)
        }
      }

      if (section.functions) {
        for (const f of section.functions) {
          lines.push(`  ${f.name}`)
          lines.push(`    ${f.description}`)
        }
      }

      lines.push('')
    }
  }

  return lines.join('\n')
}

// Load topic file
const topicFile = path.join(docsPath, `${topic}.json`)

if (!fs.existsSync(topicFile)) {
  const topics = listTopics()
  console.log(`Unknown topic: ${topic}`)
  console.log(`\nAvailable topics: ${topics.join(', ')}`)
  module.output({ status: 'error', message: `Unknown topic: ${topic}`, topics })
  return
}

const data = JSON.parse(fs.readFileSync(topicFile, 'utf8'))

if (raw) {
  console.log(JSON.stringify(data, null, 2))
} else {
  console.log(render(data))
}

module.output(data)
