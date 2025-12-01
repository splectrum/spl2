// spl/dev/deploy - Create dev environment instance from implementation/

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

// Count files, folders, and total size recursively
function countStats(dir) {
  let files = 0, folders = 0, size = 0

  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(d, entry.name)
      if (entry.isDirectory()) {
        folders++
        walk(fullPath)
      } else {
        files++
        size += fs.statSync(fullPath).size
      }
    }
  }

  if (fs.existsSync(dir)) walk(dir)
  return { files, folders, size }
}

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.dev.deploy || {}
  const runtime = spl.headers.spl.runtime

  // Resolve paths relative to runtime.cwd (bundle root)
  const bundleRoot = runtime.cwd
  const implDir = path.join(bundleRoot, 'implementation')
  const envsDir = path.join(bundleRoot, 'environments')

  // Check implementation exists
  if (!fs.existsSync(implDir)) {
    spl.error('implementation/ directory not found')
    return
  }

  // Find work module (wm_* pattern)
  const implEntries = fs.readdirSync(implDir)
  const workModuleName = implEntries.find(e => e.startsWith('wm_'))
  if (!workModuleName) {
    spl.error('No work module (wm_*) found in implementation/')
    return
  }

  // Generate environment name
  const envName = input.name || `env-${Date.now()}`
  const envPath = path.join(envsDir, envName)

  // Check if already exists
  if (fs.existsSync(envPath)) {
    spl.error(`Environment already exists: ${envName}`)
    return
  }

  // Create environment directory
  fs.mkdirSync(envPath, { recursive: true })

  // Create modules/ directory
  const modulesDir = path.join(envPath, 'modules')
  fs.mkdirSync(modulesDir, { recursive: true })

  // Copy types
  const typesSrc = path.join(implDir, 'types')
  if (fs.existsSync(typesSrc)) {
    fs.cpSync(typesSrc, path.join(modulesDir, 'types'), { recursive: true })
  }

  // Copy work module
  const workModuleSrc = path.join(implDir, workModuleName)
  const workModuleDest = path.join(modulesDir, workModuleName)
  fs.cpSync(workModuleSrc, workModuleDest, { recursive: true })

  // Set up lib/ symlinks (pointing to modules/wm_*/_lib/)
  const libDir = path.join(envPath, 'lib')
  fs.mkdirSync(libDir, { recursive: true })

  const libSourceDir = path.join(workModuleDest, '_lib')
  if (fs.existsSync(libSourceDir)) {
    const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
    for (const file of libFiles) {
      const target = path.join(libDir, file)
      const source = path.relative(path.dirname(target), path.join(libSourceDir, file))
      fs.symlinkSync(source, target)
    }
  }

  // Set up node_modules/lib re-exports
  const nodeModulesLib = path.join(envPath, 'node_modules/lib')
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

  // Create events/requests/ directory
  fs.mkdirSync(path.join(envPath, 'events/requests'), { recursive: true })

  // Create package.json for environment
  const envPackage = {
    name: envName,
    version: '1.0.0',
    type: 'module'
  }
  fs.writeFileSync(path.join(envPath, 'package.json'), JSON.stringify(envPackage, null, 2))

  // Copy handler and submit to environment
  const handlerSrc = path.join(bundleRoot, 'handler.js')
  const submitSrc = path.join(bundleRoot, 'submit.js')
  if (fs.existsSync(handlerSrc)) {
    fs.copyFileSync(handlerSrc, path.join(envPath, 'handler.js'))
  }
  if (fs.existsSync(submitSrc)) {
    fs.copyFileSync(submitSrc, path.join(envPath, 'submit.js'))
  }

  // Count stats for verification
  const stats = countStats(envPath)

  // Set output
  spl.headers.spl.dev.deploy.output = {
    created: envPath,
    name: envName,
    stats: stats
  }

  spl.complete()
}
