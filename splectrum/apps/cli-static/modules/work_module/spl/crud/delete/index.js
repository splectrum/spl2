// spl/container/delete - Delete a container
//
// Dematerializes a container from work_module:
// - Removes all files/folders EXCEPT _reqs/ (immutables preserved)
// - If folder becomes empty, removes folder too
// - If _reqs/ exists, folder stays with just reqs
//
// Invocation: spl spl/container/test/delete
//
// Flags:
//   --dryRun    Show what would be deleted without doing it

export default async function(module) {
  const fs = await module.require('fs')
  const path = await module.require('path')

  const input = module.input()
  const dryRun = input.dryRun || false

  // Get the method path - this tells us what container to delete
  // e.g., "spl/container/test/delete" → delete "spl/container/test"
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  // Remove "delete" from the end to get target container path
  if (segments[segments.length - 1] !== 'delete') {
    module.output('Invalid invocation: method must end with /delete', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // Determine work_module path for target
  const nodeRoot = module.getNodeRoot()
  const appAPI = module.getAppAPI()
  const appName = appAPI?.replace('spl/', '')

  const workModulePath = appName
    ? path.join(nodeRoot, 'apps', appName, 'modules', 'work_module')
    : path.join(nodeRoot, 'modules', 'work_module')

  const targetFsPath = path.join(workModulePath, targetPath)
  const indexJsonPath = path.join(targetFsPath, 'index.json')

  // Check if container exists in work_module
  if (!fs.existsSync(indexJsonPath)) {
    module.output(
      `Container not found in work_module: ${targetPath}`,
      { status: 'not_found', targetPath, targetFsPath }
    )
    return
  }

  // Collect what will be deleted
  const toDelete = []
  const toPreserve = []

  if (fs.existsSync(targetFsPath)) {
    const entries = fs.readdirSync(targetFsPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(targetFsPath, entry.name)

      if (entry.name === '_reqs') {
        // Preserve _reqs
        toPreserve.push(entry.name)
      } else {
        toDelete.push(entry.name)
      }
    }
  }

  // dryRun mode
  if (dryRun) {
    const willRemoveFolder = toPreserve.length === 0
    module.output(
      `Would delete: ${targetPath}\n  remove: ${toDelete.join(', ') || '(none)'}\n  preserve: ${toPreserve.join(', ') || '(none)'}\n  folder: ${willRemoveFolder ? 'remove' : 'keep'}`,
      { status: 'dry_run', targetPath, targetFsPath, toDelete, toPreserve, willRemoveFolder }
    )
    return
  }

  // Delete everything except _reqs
  for (const name of toDelete) {
    const entryPath = path.join(targetFsPath, name)
    const stat = fs.statSync(entryPath)

    if (stat.isDirectory()) {
      fs.rmSync(entryPath, { recursive: true })
    } else {
      fs.unlinkSync(entryPath)
    }
  }

  // Remove folder if empty (no _reqs)
  const folderRemoved = toPreserve.length === 0
  if (folderRemoved) {
    fs.rmdirSync(targetFsPath)
  }

  module.output(
    `Deleted: ${targetPath}`,
    { status: 'deleted', targetPath, targetFsPath, removed: toDelete, preserved: toPreserve, folderRemoved }
  )
}
