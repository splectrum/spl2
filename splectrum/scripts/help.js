// scripts/help.js - Show help for spl or a specific method
//
// Usage: spl help [method-path]
// Examples:
//   spl help              - Show general help
//   spl help spl/dev/cycle - Show help for specific method

const methodPath = args._positional?.[0]

if (!methodPath) {
  // General help
  console.log('=== SPL - Splectrum Command Line ===')
  console.log('')
  console.log('Usage:')
  console.log('  spl package/api/method [--arg=value]   Single command (default)')
  console.log('  spl script-name [--arg=value]          Script from library')
  console.log('  spl ./path/to/script.js [--arg=value]  File script')
  console.log('  spl "/* */ javascript code"            Inline script (requires /* preamble)')
  console.log('')
  console.log('Built-in scripts:')
  console.log('  spl status          Show node status')
  console.log('  spl list-methods    List available methods')
  console.log('  spl help [method]   Show this help or method help')
  console.log('')
  console.log('Examples:')
  console.log('  spl spl/dev/deploy --name=env-123')
  console.log('  spl spl/dev/cycle --name=env-123')
  console.log('  spl "/* */ console.log(runtime.nodeRoot)"')
  console.log('')
  console.log(`Current node: ${runtime.nodeRoot}`)
} else {
  // Method-specific help
  const parts = methodPath.split('/')
  if (parts.length !== 3) {
    console.log('Method path must be in format: package/api/method')
    console.log(`Got: ${methodPath}`)
    return
  }

  const methodDir = path.join(runtime.splectrumDir, 'lib', ...parts)

  if (!fs.existsSync(methodDir)) {
    console.log(`Method not found: ${methodPath}`)
    console.log(`Looked in: ${methodDir}`)
    return
  }

  console.log(`=== ${methodPath} ===`)
  console.log('')

  // Check for selfeval with description
  const selfevalPath = path.join(methodDir, 'selfeval.js')
  if (fs.existsSync(selfevalPath)) {
    const content = fs.readFileSync(selfevalPath, 'utf-8')

    const descMatch = content.match(/description:\s*['"]([^'"]+)['"]/)
    if (descMatch) {
      console.log(`Description: ${descMatch[1]}`)
      console.log('')
    }

    // Look for input schema or examples in selfeval
    const inputMatch = content.match(/input:\s*(\{[^}]+\})/s)
    if (inputMatch) {
      console.log('Example input:')
      console.log(`  ${inputMatch[1]}`)
      console.log('')
    }
  }

  // Check what files exist
  console.log('Files:')
  const files = fs.readdirSync(methodDir)
  for (const file of files) {
    console.log(`  ${file}`)
  }
}
