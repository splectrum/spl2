// spl/crud/write - Write resource to work_module
//
// Writes to an existing resource in the work_module physical folder.
// File must already exist (use create for new files).
//
// Invocation: spl spl/container/test/write --resource=index.js --content="..."
//
// Flags:
//   --resource  Resource path to write
//   --content   Content to write (entire file contents)

import fs from 'fs'
import path from 'path'

export default async function(module) {
  const crud = await module.require('lib/spl/crud')

  const input = module.input()
  const resource = input.resource
  const content = input.content

  // --resource is required
  if (!resource) {
    module.output('--resource flag required. Usage: spl <container>/write --resource=<name> --content="..."', { error: 'missing_resource' })
    return
  }

  // --content is required
  if (content === undefined || content === null) {
    module.output('--content flag required. Usage: spl <container>/write --resource=<name> --content="..."', { error: 'missing_content' })
    return
  }

  // Get the method path - this tells us what container to write to
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  // Remove "write" from the end to get target container path
  if (segments[segments.length - 1] !== 'write') {
    module.output('Invalid invocation: method must end with /write', { error: 'invalid_invocation' })
    return
  }

  const containerPath = segments.slice(0, -1).join('/')

  // Determine work module path
  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  const containerFsPath = path.join(workModulePath, containerPath)

  // Check if container exists in work_module
  if (!fs.existsSync(containerFsPath)) {
    module.output(`Container not found in work_module: ${containerPath}`, { error: 'container_not_found', containerPath })
    return
  }

  const filePath = path.join(containerFsPath, resource)

  // File must exist (use create for new files)
  if (!fs.existsSync(filePath)) {
    module.output(`Resource not found: ${resource}. Use create --resource to create new files.`, { status: 'not_found', resource, containerPath })
    return
  }

  // Write the content
  fs.writeFileSync(filePath, content, 'utf8')

  module.output(`Written: ${resource}`, { status: 'ok', file: resource, containerPath })
}
