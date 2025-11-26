// spl/ops/status - Show root node status
//
// Reports current version, previous version, and available versions
// for the parent Splectrum node.
//
// The sidecar operates on the root node: splectrum/ops/ manages splectrum/

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)
  const runtime = spl.headers.spl.runtime

  // Sidecar bundle is at splectrum/ops/, root node is at splectrum/
  // splectrumDir is splectrum/ops/splectrum/, bundleRoot is splectrum/ops/
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
  let versions = []
  if (fs.existsSync(versionsDir)) {
    versions = fs.readdirSync(versionsDir)
      .filter(v => v.startsWith(pkg.activeModule + '-'))
      .sort()
  }

  // Check symlink status
  const symlinkPath = path.join(modulesDir, pkg.activeModule)
  let symlinkTarget = null
  let symlinkValid = false

  if (fs.existsSync(symlinkPath)) {
    try {
      symlinkTarget = fs.readlinkSync(symlinkPath)
      const resolvedPath = path.resolve(modulesDir, symlinkTarget)
      symlinkValid = fs.existsSync(resolvedPath)
    } catch (e) {
      // Not a symlink or error reading
    }
  }

  spl.headers.spl.ops.status.output = {
    rootNode: rootNodeDir,
    activeModule: pkg.activeModule,
    activeVersion: pkg.activeVersion,
    previousVersion: pkg.previousVersion,
    installedAt: pkg.installedAt,
    versionsAvailable: versions.length,
    versions: versions,
    symlink: {
      path: symlinkPath,
      target: symlinkTarget,
      valid: symlinkValid
    }
  }

  spl.complete()
}
