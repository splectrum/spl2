/*
 * Test script - full interface
 * Available: record, spl, requireSpl, requireNonSpl
 */
const input = spl.input()
const fs = requireNonSpl('fs')
const path = requireNonSpl('path')

const nodeRoot = record.headers.spl.runtime.nodeRoot
const scriptsDir = path.join(nodeRoot, 'scripts')
const scriptCount = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js')).length

spl.output({
  message: 'Library script works!',
  receivedInput: input,
  nodeRoot,
  scriptCount
})
