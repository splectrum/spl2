// spl/ops/rollback - Revert root node to previous version
//
// Updates the symlink to point to the previous version.
// If no previous version exists, reports error.
//
// Input:
//   version: specific version to rollback to (optional, defaults to previous)

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.ops.rollback || {}
  const runtime = spl.headers.spl.runtime

  // Sidecar bundle is at splectrum/ops/, root node is at splectrum/
  const bundleRoot = path.dirname(runtime.splectrumDir)
  const rootNodeDir = path.dirname(bundleRoot)

  const modulesDir = path.join(rootNodeDir, 'modules')
  const versionsDir = path.join(modulesDir, 'versions')
  const packagePath = path.join(rootNodeDir, 'package.json')

  // Check if parent node exists
  if (!fs.existsSync(rootNodeDir) || !fs.existsSync(packagePath)) {
    spl.error('Root node not found at ' + rootNodeDir)
    return
  }

  // Read package.json for current state
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

  // Get available versions
  const versions = fs.readdirSync(versionsDir)
    .filter(v => v.startsWith(pkg.activeModule + '-'))
    .sort()

  // Find target version
  let targetVersion
  if (input.version) {
    // Specific version requested
    if (!versions.includes(input.version)) {
      spl.error(`Version not found: ${input.version}`)
      return
    }
    targetVersion = input.version
  } else {
    // Default: previous version
    if (!pkg.previousVersion) {
      spl.error('No previous version available for rollback')
      return
    }
    if (!versions.includes(pkg.previousVersion)) {
      spl.error(`Previous version not found in versions/: ${pkg.previousVersion}`)
      return
    }
    targetVersion = pkg.previousVersion
  }

  // Don't rollback to current
  if (targetVersion === pkg.activeVersion) {
    spl.error(`Already at version: ${targetVersion}`)
    return
  }

  const previousActive = pkg.activeVersion

  // Update symlink
  const symlinkPath = path.join(modulesDir, pkg.activeModule)
  if (fs.existsSync(symlinkPath)) {
    fs.unlinkSync(symlinkPath)
  }
  fs.symlinkSync(`versions/${targetVersion}`, symlinkPath)

  // Update lib/ symlinks to point through main symlink
  const libDir = path.join(rootNodeDir, 'lib')
  if (fs.existsSync(libDir)) {
    fs.rmSync(libDir, { recursive: true })
  }
  fs.mkdirSync(libDir, { recursive: true })

  const libSourceDir = path.join(symlinkPath, '_lib')
  if (fs.existsSync(libSourceDir)) {
    const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
    for (const file of libFiles) {
      const target = path.join(libDir, file)
      const source = path.join('..', 'modules', pkg.activeModule, '_lib', file)
      fs.symlinkSync(source, target)
    }
  }

  // Update node_modules/lib re-exports
  const nodeModulesLib = path.join(rootNodeDir, 'node_modules/lib')
  if (fs.existsSync(nodeModulesLib)) {
    fs.rmSync(nodeModulesLib, { recursive: true })
  }
  fs.mkdirSync(nodeModulesLib, { recursive: true })
  fs.writeFileSync(
    path.join(nodeModulesLib, 'package.json'),
    JSON.stringify({ name: 'lib', type: 'module' }, null, 2)
  )

  if (fs.existsSync(libSourceDir)) {
    const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
    for (const file of libFiles) {
      const content = `// Re-export from lib/
export * from '../../lib/${file}'
export { default } from '../../lib/${file}'
`
      fs.writeFileSync(path.join(nodeModulesLib, file), content)
    }
  }

  // Find the new previous (version before target in sorted list)
  const targetIndex = versions.indexOf(targetVersion)
  const newPrevious = targetIndex > 0 ? versions[targetIndex - 1] : null

  // Update package.json
  pkg.activeVersion = targetVersion
  pkg.previousVersion = newPrevious
  pkg.installedAt = new Date().toISOString()
  pkg.rolledBackFrom = previousActive
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n')

  spl.headers.spl.ops.rollback.output = {
    rootNode: rootNodeDir,
    rolledBackFrom: previousActive,
    rolledBackTo: targetVersion,
    newPrevious: newPrevious
  }

  spl.complete()
}
