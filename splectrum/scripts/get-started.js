/*
 * scripts/get-started.js - Quick reference for SPL commands
 * Usage: spl get-started [topic] [--human]
 *
 * AI-first: JSON output by default
 * --human renders for humans
 */
const fs = await import('fs')
const path = await import('path')
const ft = await module.require('lib/spl/script/freetext.js')

const input = module.input()
const topic = input['0'] || 'intro'
const human = input.human === true

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

// Load topic file
const topicFile = path.join(docsPath, `${topic}.json`)

if (!fs.existsSync(topicFile)) {
  const topics = listTopics()
  const msg = `Unknown topic: ${topic}\nAvailable topics: ${topics.join(', ')}`
  if (human) {
    console.log(msg)
  }
  module.output({ status: 'error', message: `Unknown topic: ${topic}`, topics })
  return
}

const data = JSON.parse(fs.readFileSync(topicFile, 'utf8'))

if (human) {
  console.log(ft.render(data))
} else {
  module.output(data)
}
