/*
 * scripts/status.js - Show node status
 * Usage: spl status [--verbose]
 */
const fs = await module.require('fs')
const path = await module.require('path')
const input = module.input()

const nodeRoot = module.getNodeRoot()
const splectrumDir = nodeRoot

console.log('=== Splectrum Node Status ===')
console.log('')
console.log(`Node root:     ${nodeRoot}`)
console.log('')

// Directories inside splectrum/ (the node)
console.log('=== Node Directories ===')
const nodeDirs = [
  { name: 'scripts/', path: path.join(splectrumDir, 'scripts') },
  { name: 'docs/', path: path.join(splectrumDir, 'docs') },
  { name: '_reqs/', path: path.join(splectrumDir, '_reqs') },
  { name: 'modules/', path: path.join(splectrumDir, 'modules') },
]
for (const dir of nodeDirs) {
  const exists = fs.existsSync(dir.path)
  console.log(`${exists ? '[x]' : '[ ]'} ${dir.name}`)
}

// Directories at nodeRoot parent (for dev bundles)
const parentDir = path.dirname(nodeRoot)
const bundleDirs = [
  { name: 'implementation/', path: path.join(parentDir, 'implementation') },
  { name: 'environments/', path: path.join(parentDir, 'environments') },
]
const hasBundleDirs = bundleDirs.some(d => fs.existsSync(d.path))
if (hasBundleDirs) {
  console.log('')
  console.log('=== Bundle Directories ===')
  for (const dir of bundleDirs) {
    const exists = fs.existsSync(dir.path)
    console.log(`${exists ? '[x]' : '[ ]'} ${dir.name}`)
  }
}
console.log('')

// Check for package.json in splectrum/
const pkgPath = path.join(splectrumDir, 'package.json')
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  console.log('=== Node Package ===')
  console.log(`Name:    ${pkg.name}`)
  console.log(`Version: ${pkg.version || 'n/a'}`)
  if (pkg.description) {
    console.log(`Desc:    ${pkg.description}`)
  }
}

// Verbose: list available scripts and methods
if (input.verbose) {
  console.log('')
  console.log('=== Available Scripts ===')
  const scriptsPath = path.join(splectrumDir, 'scripts')
  if (fs.existsSync(scriptsPath)) {
    const scripts = fs.readdirSync(scriptsPath).filter(f => f.endsWith('.js'))
    for (const script of scripts) {
      console.log(`  ${script.replace('.js', '')}`)
    }
  } else {
    console.log('  (no scripts/ directory)')
  }

  console.log('')
  console.log('=== Available Methods ===')
  const modulesPath = path.join(splectrumDir, 'modules')
  if (fs.existsSync(modulesPath)) {
    const walkMethods = (dir, prefix = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('_') && entry.name !== 'versions') {
          walkMethods(path.join(dir, entry.name), prefix + entry.name + '/')
        } else if (entry.name === 'index.js' && prefix.split('/').length > 3) {
          console.log(`  ${prefix.slice(0, -1)}`)
        }
      }
    }
    const modules = fs.readdirSync(modulesPath).filter(m => !m.startsWith('.') && m !== 'versions')
    for (const mod of modules) {
      walkMethods(path.join(modulesPath, mod))
    }
  } else {
    console.log('  (no modules/ directory)')
  }
}

module.output({ status: 'ok' })
