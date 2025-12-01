// spl/dev/clone - Clone dev environment iteration to new location
//
// Pattern: create(record, { requireSpl }) returns { invoke() }
//
// TODO: Replace direct fs/path imports with lib abstractions

import fs from 'fs'
import path from 'path'

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

// Explicit list of files and folders to copy
const FILES_TO_COPY = [
  'package.json',
  'deploy.js',
  'prepare.js',
  'test.js',
  'cycle.js',
  'publish.js',
  'destroy.js',
  'handler.js',
  'submit.js',
  'clone.js'
]

const FOLDERS_TO_COPY = [
  'implementation'
]

const FOLDERS_TO_CREATE_EMPTY = [
  'environments'
]

export async function create(record, { requireSpl }) {
  const spl = await requireSpl('lib/spl', record)

  return {
    async invoke() {
      const input = spl.input()

      // Get inputs
      const destination = input.path
      const customName = input.name || null
      const customDescription = input.description || null

      // Resolve paths using runtime.cwd (bundle root), not process.cwd()
      const runtime = record.headers.spl.runtime
      const sourcePath = runtime.cwd
      const destPath = path.resolve(sourcePath, destination)
      const destName = path.basename(destPath)

      // Error if destination exists
      if (fs.existsSync(destPath)) {
        spl.error(`Destination already exists: ${destPath}`)
        return
      }

      // Create destination
      fs.mkdirSync(destPath, { recursive: true })

      // Copy files
      for (const file of FILES_TO_COPY) {
        const srcFile = path.join(sourcePath, file)
        const destFile = path.join(destPath, file)
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, destFile)
        }
      }

      // Copy folders
      for (const folder of FOLDERS_TO_COPY) {
        const srcFolder = path.join(sourcePath, folder)
        const destFolder = path.join(destPath, folder)
        if (fs.existsSync(srcFolder)) {
          fs.cpSync(srcFolder, destFolder, { recursive: true })
        }
      }

      // Create empty folders
      for (const folder of FOLDERS_TO_CREATE_EMPTY) {
        const destFolder = path.join(destPath, folder)
        fs.mkdirSync(destFolder, { recursive: true })
      }

      // Update package.json
      const packageJsonPath = path.join(destPath, 'package.json')
      let packageResult = null

      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

        // Detect project number from path
        const projectMatch = sourcePath.match(/projects\/(\d+)-[^/]+\/dev\//)
        const projectNum = projectMatch ? projectMatch[1] : '00'

        // Determine name
        if (customName) {
          packageJson.name = customName
        } else {
          packageJson.name = `pr${projectNum}-${destName}`
        }

        // Determine version from destination folder name
        const versionMatch = destName.match(/^v(\d+)\.(\d+)$/)
        if (versionMatch) {
          const [, major, minor] = versionMatch
          packageJson.version = `${major}.${minor}.0`
        } else {
          packageJson.version = '0.0.0'
        }

        // Determine description
        if (customDescription) {
          packageJson.description = customDescription
        } else {
          packageJson.description = `Project ${projectNum} - Dev environment ${destName}`
        }

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

        packageResult = {
          name: packageJson.name,
          version: packageJson.version,
          description: packageJson.description
        }
      }

      // Count stats for verification
      const stats = countStats(destPath)

      // Set output
      spl.output({
        created: destPath,
        package: packageResult,
        stats: stats
      })

      spl.complete()
    }
  }
}
