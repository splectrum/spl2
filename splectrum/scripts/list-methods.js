// scripts/list-methods.js - List available methods in current node
//
// Usage: spl list-methods [--package=spl]

const libPath = path.join(runtime.splectrumDir, 'lib')

if (!fs.existsSync(libPath)) {
  console.log('No lib/ directory found in splectrum/')
  return
}

console.log(`Methods in: ${runtime.splectrumDir}`)
console.log('')

const packageFilter = args.package

const walkMethods = (dir, prefix = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      walkMethods(path.join(dir, entry.name), prefix + entry.name + '/')
    } else if (entry.name === 'method.js') {
      const methodPath = prefix.slice(0, -1)  // Remove trailing /

      // Apply package filter if specified
      if (packageFilter) {
        if (!methodPath.startsWith(packageFilter + '/')) {
          continue
        }
      }

      // Try to read selfeval for description
      const selfevalPath = path.join(dir, 'selfeval.js')
      let description = ''
      if (fs.existsSync(selfevalPath)) {
        const content = fs.readFileSync(selfevalPath, 'utf-8')
        const match = content.match(/description:\s*['"]([^'"]+)['"]/)
        if (match) {
          description = ` - ${match[1]}`
        }
      }

      console.log(`  ${methodPath}${description}`)
    }
  }
}

walkMethods(libPath)
