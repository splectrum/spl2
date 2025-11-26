// spl/ops/upgrade - Deploy candidate module to root node
//
// Copies a candidate module (from a dev bundle's implementation/) to
// the root node's versions/ directory and updates the symlink.
//
// Input:
//   candidate: path to candidate module (e.g., projects/.../bm_spl-1234567)
//   keep: number of versions to keep (default: 5)

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

const MAX_VERSIONS = 5

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.ops.upgrade || {}
  const runtime = spl.headers.spl.runtime

  // Sidecar bundle is at splectrum/ops/, root node is at splectrum/
  const bundleRoot = path.dirname(runtime.splectrumDir)
  const rootNodeDir = path.dirname(bundleRoot)

  const modulesDir = path.join(rootNodeDir, 'modules')
  const versionsDir = path.join(modulesDir, 'versions')
  const packagePath = path.join(rootNodeDir, 'package.json')

  const keepVersions = input.keep ? parseInt(input.keep, 10) : MAX_VERSIONS

  // Check if parent node exists
  if (!fs.existsSync(rootNodeDir) || !fs.existsSync(packagePath)) {
    spl.error('Root node not found at ' + rootNodeDir)
    return
  }

  // Candidate path is required
  if (!input.candidate) {
    spl.error('candidate path required (e.g., --candidate=path/to/bm_spl-1234567)')
    return
  }

  // Resolve candidate path relative to invokedFrom (where user ran command)
  const candidatePath = path.resolve(runtime.invokedFrom, input.candidate)

  if (!fs.existsSync(candidatePath)) {
    spl.error(`Candidate not found: ${candidatePath}`)
    return
  }

  // Read package.json for current state
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

  // Extract base name and version from candidate
  // e.g., bm_spl-1764165137146 -> baseName: bm_spl, versionedName: bm_spl-1764165137146
  const candidateName = path.basename(candidatePath)
  const baseName = candidateName.includes('-')
    ? candidateName.substring(0, candidateName.lastIndexOf('-'))
    : candidateName

  // Verify it matches the root node's active module
  if (baseName !== pkg.activeModule) {
    spl.error(`Module mismatch: candidate is ${baseName}, root node expects ${pkg.activeModule}`)
    return
  }

  // Generate new versioned name with current timestamp
  const timestamp = Date.now()
  const versionedName = `${baseName}-${timestamp}`

  // Ensure versions directory exists
  fs.mkdirSync(versionsDir, { recursive: true })

  // Copy candidate to versions/
  const versionedDest = path.join(versionsDir, versionedName)
  fs.cpSync(candidatePath, versionedDest, { recursive: true })

  const previousActive = pkg.activeVersion

  // Update symlink
  const symlinkPath = path.join(modulesDir, baseName)
  if (fs.existsSync(symlinkPath) || fs.lstatSync(symlinkPath, { throwIfNoEntry: false })) {
    const stat = fs.lstatSync(symlinkPath, { throwIfNoEntry: false })
    if (stat) {
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(symlinkPath)
      } else {
        fs.rmSync(symlinkPath, { recursive: true })
      }
    }
  }
  fs.symlinkSync(`versions/${versionedName}`, symlinkPath)

  // Update lib/ symlinks
  const libDir = path.join(rootNodeDir, 'lib')
  if (fs.existsSync(libDir)) {
    fs.rmSync(libDir, { recursive: true })
  }
  fs.mkdirSync(libDir, { recursive: true })

  const libSourceDir = path.join(symlinkPath, '_lib')
  let libCount = 0
  if (fs.existsSync(libSourceDir)) {
    const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
    for (const file of libFiles) {
      const target = path.join(libDir, file)
      const source = path.join('..', 'modules', baseName, '_lib', file)
      fs.symlinkSync(source, target)
      libCount++
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

  // Prune old versions
  const allVersions = fs.readdirSync(versionsDir)
    .filter(v => v.startsWith(baseName + '-'))
    .sort()

  const pruned = []
  while (allVersions.length > keepVersions) {
    const oldVersion = allVersions.shift()
    const oldPath = path.join(versionsDir, oldVersion)
    fs.rmSync(oldPath, { recursive: true })
    pruned.push(oldVersion)
  }

  // Update package.json
  pkg.activeVersion = versionedName
  pkg.previousVersion = previousActive
  pkg.installedAt = new Date().toISOString()
  delete pkg.rolledBackFrom  // Clear rollback marker on fresh upgrade
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n')

  spl.headers.spl.ops.upgrade.output = {
    rootNode: rootNodeDir,
    candidateSource: candidatePath,
    activeVersion: versionedName,
    previousVersion: previousActive,
    libSymlinks: libCount,
    versionsKept: allVersions.length,
    versionsPruned: pruned.length
  }

  spl.complete()
}
