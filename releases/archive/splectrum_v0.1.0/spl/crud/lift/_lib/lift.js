// lift.js - Lift lib functions
//
// Contains implementation for lift modes.

// Container facet directories (part of container, not child containers)
const FACET_DIRS = ['_lib', '_schemas', '_reqs', '_tests', '_selfevals']

/**
 * Lift container from lower module layer to work_module
 * Copies files, skipping those that already exist in work_module.
 * Without --recursive, only lifts this container (files + facet dirs).
 * With --recursive, lifts full hive (all descendant containers).
 *
 * @param {Object} module - Module interface
 * @param {Object} fs - File system module
 * @param {Object} path - Path module
 * @param {string} targetPath - Container path (e.g., "spl/consumer")
 * @param {boolean} dryRun - If true, show what would be done without doing it
 * @param {boolean} recursive - If true, lift full hive
 */
export async function liftModules(module, fs, path, targetPath, dryRun, recursive = false) {
  const nodeRoot = module.getNodeRoot()
  const appAPI = module.getAppAPI()
  const appName = appAPI?.replace('spl/', '')

  // Determine work_module destination
  const appModulesDir = appName
    ? path.join(nodeRoot, 'apps', appName, 'modules')
    : null
  const splectrumModulesDir = path.join(nodeRoot, 'modules')

  const workModulePath = appModulesDir
    ? path.join(appModulesDir, 'work_module', targetPath)
    : path.join(splectrumModulesDir, 'work_module', targetPath)

  // Collect files from ALL lower layers (below work_module)
  // Files that don't exist in work_module get added to copy list
  const filesToCopy = []
  const skipped = []
  const seenFiles = new Set()
  const sourceLayers = []

  function walkDir(dir, relBase, layerName, location, isTopLevel = false) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const relPath = relBase ? path.join(relBase, entry.name) : entry.name
      const srcFullPath = path.join(dir, entry.name)
      const destFullPath = path.join(workModulePath, relPath)

      if (entry.isDirectory()) {
        // Without --recursive, only recurse into facet directories
        const isFacetDir = FACET_DIRS.includes(entry.name)
        if (recursive || isFacetDir) {
          walkDir(srcFullPath, relPath, layerName, location, false)
        }
      } else {
        // Skip if already seen from a higher layer
        if (seenFiles.has(relPath)) continue
        seenFiles.add(relPath)

        if (fs.existsSync(destFullPath)) {
          skipped.push(relPath)
        } else {
          filesToCopy.push({ relPath, srcFullPath, destFullPath, layerName, location })
        }
      }
    }
  }

  // Walk app modules (if app context exists)
  if (appModulesDir) {
    const appHierarchyPath = path.join(appModulesDir, 'hierarchy.json')
    if (fs.existsSync(appHierarchyPath)) {
      const hierarchy = JSON.parse(fs.readFileSync(appHierarchyPath, 'utf8'))

      for (const layer of hierarchy.layers) {
        if (layer.name === 'work_module') continue

        const candidatePath = path.join(appModulesDir, layer.name, targetPath)
        walkDir(candidatePath, '', layer.name, 'app')
        if (fs.existsSync(candidatePath)) {
          sourceLayers.push(`app/${layer.name}`)
        }
      }
    }
  }

  // Walk splectrum modules
  const splHierarchyPath = path.join(splectrumModulesDir, 'hierarchy.json')
  if (fs.existsSync(splHierarchyPath)) {
    const hierarchy = JSON.parse(fs.readFileSync(splHierarchyPath, 'utf8'))

    for (const layer of hierarchy.layers) {
      if (layer.name === 'work_module') continue

      const candidatePath = path.join(splectrumModulesDir, layer.name, targetPath)
      walkDir(candidatePath, '', layer.name, 'splectrum')
      if (fs.existsSync(candidatePath)) {
        sourceLayers.push(`splectrum/${layer.name}`)
      }
    }
  }

  if (filesToCopy.length === 0 && skipped.length === 0) {
    module.output(
      `No files found for: ${targetPath}`,
      { error: 'not_found', targetPath, searchedLayers: sourceLayers }
    )
    return
  }

  // dryRun mode
  if (dryRun) {
    const lines = [`Would lift to work_module/${targetPath}:`]
    if (filesToCopy.length > 0) {
      lines.push(`\nFiles to copy (${filesToCopy.length}):`)
      for (const f of filesToCopy) {
        lines.push(`  + ${f.relPath} (from ${f.location}/${f.layerName})`)
      }
    }
    if (skipped.length > 0) {
      lines.push(`\nSkipped (already exist) (${skipped.length}):`)
      for (const s of skipped) {
        lines.push(`  - ${s}`)
      }
    }
    module.output(lines.join('\n'), {
      status: 'dry_run',
      targetPath,
      sourceLayers,
      toCopy: filesToCopy.map(f => f.relPath),
      skipped
    })
    return
  }

  // Copy files
  for (const f of filesToCopy) {
    const destDir = path.dirname(f.destFullPath)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    fs.copyFileSync(f.srcFullPath, f.destFullPath)
  }

  const lines = [`Lifted to work_module/${targetPath}`]
  if (filesToCopy.length > 0) {
    lines.push(`Copied: ${filesToCopy.length} files`)
  }
  if (skipped.length > 0) {
    lines.push(`Skipped: ${skipped.length} files (already exist)`)
  }

  module.output(lines.join('\n'), {
    status: 'lifted',
    targetPath,
    sourceLayers,
    copied: filesToCopy.map(f => f.relPath),
    skipped
  })
}
