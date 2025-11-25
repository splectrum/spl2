// install.js - Copy module bundles from modules/ to implementation/
//
// This prepares modules for deployment to dev environment instances.
// Also sets up lib resolution (symlinks and node_modules re-exports).

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const V0_DIR = path.join(__dirname, '..')

/**
 * Install - copy modules to implementation and set up lib resolution
 */
export default async function install() {
  console.log('=== Install - Prepare Implementation ===')
  console.log('')

  const modulesDir = path.join(V0_DIR, 'modules')
  const implDir = path.join(V0_DIR, 'implementation')

  // Clear and recreate implementation/
  if (fs.existsSync(implDir)) {
    fs.rmSync(implDir, { recursive: true })
  }
  fs.mkdirSync(implDir, { recursive: true })

  // Copy work_module
  const workModuleSrc = path.join(modulesDir, 'work_module')
  if (fs.existsSync(workModuleSrc)) {
    fs.cpSync(workModuleSrc, path.join(implDir, 'work_module'), { recursive: true })
    console.log('✓ Copied work_module/')
  }

  // Copy types
  const typesSrc = path.join(modulesDir, 'types')
  if (fs.existsSync(typesSrc)) {
    fs.cpSync(typesSrc, path.join(implDir, 'types'), { recursive: true })
    console.log('✓ Copied types/')
  }

  // Set up lib/ symlinks
  const libDir = path.join(implDir, 'lib')
  fs.mkdirSync(libDir, { recursive: true })

  const libSourceDir = path.join(implDir, 'work_module/_lib')
  if (fs.existsSync(libSourceDir)) {
    const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
    for (const file of libFiles) {
      const target = path.join(libDir, file)
      const source = path.relative(path.dirname(target), path.join(libSourceDir, file))
      fs.symlinkSync(source, target)
    }
    console.log(`✓ Created ${libFiles.length} lib symlink(s)`)
  }

  // Set up node_modules/lib re-exports
  const nodeModulesLib = path.join(implDir, 'node_modules/lib')
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
    console.log('✓ Created node_modules/lib/ re-exports')
  }

  console.log('')
  console.log('✓ Install complete - implementation/ ready')

  return implDir
}

// Run if executed directly
if (process.argv[1] === __filename) {
  install().catch(console.error)
}
