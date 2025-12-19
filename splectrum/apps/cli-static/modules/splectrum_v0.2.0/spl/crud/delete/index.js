// spl/crud/delete - Delete a container or resource
//
// Container deletion:
// - Removes all files/folders EXCEPT _reqs/ (immutables preserved)
// - If folder becomes empty, removes folder too
// - If _reqs/ exists, folder stays with just reqs
//
// Resource deletion (--resource flag):
// - Removes a single resource file from work_module
// - Removes empty parent directories
//
// Invocation: spl spl/container/test/delete
//             spl spl/crud/delete --resource=_reqs/old_file.md
//
// Flags:
//   --resource  Delete a single resource file
//   --dryRun    Show what would be deleted without doing it

export default async function(module) {
  const crud = await module.require('lib/spl/crud')
  const deleteLib = await module.require('lib/spl/crud/delete')

  const input = module.input()
  const resource = input.resource || null
  const dryRun = input.dryRun || false

  // Get the method path
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  // Remove "delete" from the end to get target container path
  if (segments[segments.length - 1] !== 'delete') {
    module.output('Invalid invocation: method must end with /delete', { error: 'invalid_invocation' })
    return
  }

  const containerPath = segments.slice(0, -1).join('/')

  // Determine work module path
  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  // Resource deletion mode
  if (resource) {
    const containerFsPath = deleteLib.joinPath(workModulePath, containerPath)
    const resourceFsPath = deleteLib.joinPath(containerFsPath, resource)

    // Check if resource exists
    if (!deleteLib.exists(resourceFsPath)) {
      module.output(`Resource not found: ${resource}`, { status: 'not_found', resource, containerPath })
      return
    }

    // dryRun mode
    if (dryRun) {
      module.output(`Would delete: ${containerPath}/${resource}`, { status: 'dry_run', resource, containerPath, resourceFsPath })
      return
    }

    // Delete the resource
    deleteLib.deleteFile(resourceFsPath)

    // Remove empty parent directories (but not the container itself)
    const resourceDir = deleteLib.getDirPath(resourceFsPath)
    deleteLib.cleanupEmptyDir(resourceDir, containerFsPath)

    module.output(`Deleted: ${containerPath}/${resource}`, { status: 'deleted', resource, containerPath })
    return
  }

  // Container deletion mode
  const targetPath = containerPath
  const targetFsPath = deleteLib.joinPath(workModulePath, targetPath)
  const indexJsonPath = deleteLib.joinPath(targetFsPath, 'index.json')

  // Check if container exists in work_module
  if (!deleteLib.exists(indexJsonPath)) {
    module.output(
      `Container not found in work_module: ${targetPath}`,
      { status: 'not_found', targetPath, targetFsPath }
    )
    return
  }

  // Collect what will be deleted
  const toDelete = []
  const toPreserve = []

  if (deleteLib.exists(targetFsPath)) {
    const entries = deleteLib.readDir(targetFsPath)

    for (const entry of entries) {
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
    const entryPath = deleteLib.joinPath(targetFsPath, name)

    if (deleteLib.isDir(entryPath)) {
      deleteLib.deleteDir(entryPath, true)
    } else {
      deleteLib.deleteFile(entryPath)
    }
  }

  // Remove folder if empty (no _reqs)
  const folderRemoved = toPreserve.length === 0
  if (folderRemoved) {
    deleteLib.deleteDir(targetFsPath)
  }

  module.output(
    `Deleted: ${targetPath}`,
    { status: 'deleted', targetPath, targetFsPath, removed: toDelete, preserved: toPreserve, folderRemoved }
  )
}
