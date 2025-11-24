// install.js - Custom install hook (example)
//
// This hook runs after environment creation but before npm install.
// Use it for custom setup logic:
// - Create additional directories
// - Generate configuration files
// - Set up data fixtures
// - etc.

/**
 * Install hook
 * @param {string} envPath - Path to environment (e.g., "environments/env-123456")
 * @param {string} envName - Environment name (e.g., "env-123456")
 */
export default async function install(envPath, envName) {
  console.log(`Custom install for: ${envName}`)

  // Example: Create additional directories
  // import fs from 'fs'
  // fs.mkdirSync(`${envPath}/data`, { recursive: true })
  // console.log('✓ Created data/ directory')

  // Example: Generate config file
  // const config = { envName, createdAt: new Date().toISOString() }
  // fs.writeFileSync(`${envPath}/config.json`, JSON.stringify(config, null, 2))
  // console.log('✓ Generated config.json')

  // For now, this is just a placeholder
  console.log('  (No custom actions defined)')
}
