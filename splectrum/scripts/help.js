/*
 * scripts/help.js - Show help for spl or a specific method
 * Usage: spl help [method-path]
 * Examples:
 *   spl help              - Show general help
 *   spl help spl/dev/cycle - Show help for specific method
 */
const fs = await module.require('fs')
const path = await module.require('path')
const input = module.input()

const nodeRoot = module.getNodeRoot()
const methodPath = input["0"]  // first positional arg

if (!methodPath) {
  // General help
  console.log('=== SPL - Splectrum Command Line ===')
  console.log('')
  console.log('Usage:')
  console.log('  spl package/api/method [--arg=value]   Single command')
  console.log('  spl script-name [--arg=value]          Script from library')
  console.log('  spl ./path/to/script.js [--arg=value]  File script')
  console.log('  spl "/* */ javascript code"            Inline script (requires /* preamble)')
  console.log('')
  console.log('Built-in scripts:')
  console.log('  spl status [--verbose]  Show node status')
  console.log('  spl help [method]       Show this help or method help')
  console.log('')
  console.log('Examples:')
  console.log('  spl spl/dev/deploy --name=env-123')
  console.log('  spl spl/dev/cycle --name=env-123')
  console.log('  spl "/* */ spl.output({ hello: true })"')
  console.log('')
  console.log(`Current node: ${nodeRoot}`)
  module.output({ status: 'ok' })
} else {
  // Method-specific help
  const parts = methodPath.split('/')
  if (parts.length < 3) {
    console.log('Method path must be in format: package/api/method')
    console.log(`Got: ${methodPath}`)
    module.output({ status: 'error', message: 'invalid method path' })
  } else {
    // Look in modules/ for the method
    const modulesDir = path.join(nodeRoot, 'modules')
    const activeModule = fs.readdirSync(modulesDir).find(m => !m.startsWith('.') && m !== 'versions')

    if (!activeModule) {
      console.log('No active module found')
      module.output({ status: 'error', message: 'no active module' })
    } else {
      const methodDir = path.join(modulesDir, activeModule, ...parts)

      if (!fs.existsSync(methodDir)) {
        console.log(`Method not found: ${methodPath}`)
        console.log(`Looked in: ${methodDir}`)
        module.output({ status: 'error', message: 'method not found' })
      } else {
        console.log(`=== ${methodPath} ===`)
        console.log('')

        // Check for README.json
        const readmePath = path.join(methodDir, 'README.json')
        if (fs.existsSync(readmePath)) {
          const readme = JSON.parse(fs.readFileSync(readmePath, 'utf-8'))
          if (readme.description) {
            console.log(`Description: ${readme.description}`)
            console.log('')
          }
        }

        // Check what files exist
        console.log('Files:')
        const files = fs.readdirSync(methodDir).filter(f => !f.startsWith('.'))
        for (const file of files) {
          console.log(`  ${file}`)
        }

        module.output({ status: 'ok', method: methodPath })
      }
    }
  }
}
