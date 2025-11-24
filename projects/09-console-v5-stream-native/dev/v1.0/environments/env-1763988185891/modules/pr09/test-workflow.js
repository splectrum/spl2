#!/usr/bin/env node
// Test the complete workflow: install → invoke → uninstall

const { invoke } = require('./invoke-v2.js')

async function main() {
  console.log('=== Testing Complete Workflow ===\n')

  const testCases = [
    '3 + 5 - 2',
    '10 + 20 + 30',
    '100 - 50 - 25',
    '7 + 3 + 1 + 9'
  ]

  console.log('Submitting test requests...\n')

  for (const expr of testCases) {
    try {
      const result = await invoke(expr, { timeout: 10000 })
      console.log(`✅ "${expr}" = ${result.value}\n`)
    } catch (err) {
      console.error(`❌ "${expr}" failed:`, err.message, '\n')
    }
  }

  console.log('=== All tests complete ===')
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('Test failed:', err)
    process.exit(1)
  })
}

module.exports = { main }
