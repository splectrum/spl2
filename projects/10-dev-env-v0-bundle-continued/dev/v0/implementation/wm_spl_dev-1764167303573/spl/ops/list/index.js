// spl/ops/list - List available versions of root node module
//
// Shows all versions in the versions/ directory with timestamps
// and indicates which is currently active.

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)
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

  // Get available versions with details
  let versions = []
  if (fs.existsSync(versionsDir)) {
    const entries = fs.readdirSync(versionsDir)
      .filter(v => v.startsWith(pkg.activeModule + '-'))
      .sort()

    for (const entry of entries) {
      const versionPath = path.join(versionsDir, entry)
      const stat = fs.statSync(versionPath)

      // Extract timestamp from name (e.g., bm_spl-1764165335779 -> 1764165335779)
      const timestampStr = entry.substring(entry.lastIndexOf('-') + 1)
      const timestamp = parseInt(timestampStr, 10)

      versions.push({
        name: entry,
        timestamp: timestamp,
        created: new Date(timestamp).toISOString(),
        isActive: entry === pkg.activeVersion,
        isPrevious: entry === pkg.previousVersion
      })
    }
  }

  spl.headers.spl.ops.list.output = {
    rootNode: rootNodeDir,
    activeModule: pkg.activeModule,
    count: versions.length,
    versions: versions
  }

  spl.complete()
}
