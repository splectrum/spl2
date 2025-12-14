// spl/container/lift - Lift resources from overlay into work_module
//
// Materializes resources from overlay, making them editable.
// Uses overlay to find the correct resource instance through type chain.
//
// Invocation: spl spl/container/test/lift --resource=index.js
//
// Flags:
//   --resource  Single resource to lift (e.g., index.js, _lib/foo.js)
//   --all       Lift all resources (not yet implemented)
//   --dryRun    Show what would be lifted without doing it

export default async function(module) {
  const fs = await module.require('fs')
  const path = await module.require('path')

  const input = module.input()
  const resource = input.resource
  const all = input.all || false
  const dryRun = input.dryRun || false

  // Get the method path - this tells us what container to lift to
  // e.g., "spl/container/test/lift" → lift to "spl/container/test"
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  // Remove "lift" from the end to get target container path
  if (segments[segments.length - 1] !== 'lift') {
    module.output('Invalid invocation: method must end with /lift', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // --all not yet implemented
  if (all) {
    module.output('--all flag not yet implemented', { error: 'not_implemented', flag: 'all' })
    return
  }

  // --resource is required (until --all is implemented)
  if (!resource) {
    module.output('--resource flag required. Usage: spl <container>/lift --resource=<name>', { error: 'missing_resource' })
    return
  }

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
      `Container not found in work_module: ${targetPath}. Call create first.`,
      { error: 'container_not_found', targetPath }
    )
    return
  }

  // Resolve resource through overlay
  const sourcePath = module.resolve(targetPath, resource)
  if (!sourcePath) {
    module.output(
      `Resource not found in overlay: ${resource}`,
      { error: 'resource_not_found', resource, targetPath }
    )
    return
  }

  // Determine target path for resource
  const resourceTargetPath = path.join(targetFsPath, resource)

  // Check if already exists locally
  if (fs.existsSync(resourceTargetPath)) {
    module.output(
      `Resource already exists locally: ${resource}`,
      { status: 'exists', resource, targetPath: resourceTargetPath }
    )
    return
  }

  // dryRun mode
  if (dryRun) {
    module.output(
      `Would lift: ${resource}\n  from: ${sourcePath}\n  to: ${resourceTargetPath}`,
      { status: 'dry_run', resource, sourcePath, targetPath: resourceTargetPath }
    )
    return
  }

  // Ensure parent directories exist
  const resourceDir = path.dirname(resourceTargetPath)
  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true })
  }

  // Copy resource
  fs.copyFileSync(sourcePath, resourceTargetPath)

  module.output(
    `Lifted: ${resource}`,
    { status: 'lifted', resource, sourcePath, targetPath: resourceTargetPath }
  )
}
