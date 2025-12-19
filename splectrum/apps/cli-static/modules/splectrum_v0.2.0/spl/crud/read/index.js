// spl/crud/read - Read resource from work_module
//
// Reads a resource from the work_module physical folder only.
// Supports wildcards for version-agnostic reads.
//
// Invocation: spl spl/container/test/read --resource=index.js
//             spl spl/crud/read --resource=_reqs/spl_crud_instance_v*.md
//
// Flags:
//   --resource  Resource path to read, supports wildcards

export default async function(module) {
  const crud = await module.require('lib/spl/crud')
  const readLib = await module.require('lib/spl/crud/read')

  const input = module.input()
  const resource = input.resource

  // --resource is required
  if (!resource) {
    module.output('--resource flag required. Usage: spl <container>/read --resource=<name>', { error: 'missing_resource' })
    return
  }

  // Get the method path - this tells us what container to read from
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  // Remove "read" from the end to get target container path
  if (segments[segments.length - 1] !== 'read') {
    module.output('Invalid invocation: method must end with /read', { error: 'invalid_invocation' })
    return
  }

  const containerPath = segments.slice(0, -1).join('/')

  // Determine work module path
  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  const containerFsPath = readLib.getContainerFsPath(workModulePath, containerPath)

  // Check if container exists in work_module
  if (!readLib.containerExists(containerFsPath)) {
    module.output(`Container not found in work_module: ${containerPath}`, { error: 'container_not_found', containerPath })
    return
  }

  // Handle wildcards
  if (resource.includes('*')) {
    const result = readLib.findMatchingFiles(containerFsPath, resource)

    if (!result.found || result.files.length === 0) {
      module.output(`Resource not found: ${resource}`, { status: 'not_found', resource, containerPath })
      return
    }

    if (result.files.length > 1) {
      module.output(`Multiple matches for: ${resource}`, { status: 'multiple', files: result.files, containerPath })
      return
    }

    // Single match - read it
    const matchedFile = result.files[0]
    const fileResult = readLib.readFile(containerFsPath, matchedFile)

    module.output(fileResult.contents, { status: 'ok', file: matchedFile, containerPath })
    return
  }

  // No wildcards - direct read
  const fileResult = readLib.readFile(containerFsPath, resource)

  if (!fileResult.exists) {
    module.output(`Resource not found: ${resource}`, { status: 'not_found', resource, containerPath })
    return
  }

  module.output(fileResult.contents, { status: 'ok', file: resource, containerPath })
}
