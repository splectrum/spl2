// spl/crud/lift - Lift resources from overlay into work_module
//
// Materializes resources from overlay, making them editable.
// Uses overlay to find the correct resource instance through type chain.
//
// Invocation: spl spl/container/test/lift --resource=index.js
//
// Flags:
//   --resource  Single resource to lift (e.g., index.js, _lib/foo.js)
//   --modules   Lift entire container from lower module layer (bm_spl → work_module)
//   --all       Lift all resources (not yet implemented)
//   --dryRun    Show what would be lifted without doing it

export default async function(module) {
  const crud = await module.require('lib/spl/crud')
  const liftLib = await module.require('lib/spl/crud/lift')

  const input = module.input()
  const resource = input.resource
  const modules = input.modules || false
  const recursive = input.recursive || false
  const all = input.all || false
  const dryRun = input.dryRun || false

  // Get the method path - this tells us what container to lift to
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  if (segments[segments.length - 1] !== 'lift') {
    module.output('Invalid invocation: method must end with /lift', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // --modules mode: lift container from lower module layer
  if (modules) {
    const result = await liftLib.liftModules(targetPath, dryRun, recursive)
    if (result.error === 'no_work_module') {
      module.output('No work module found in hierarchy.json', result)
    } else if (result.error === 'not_found') {
      module.output(`No files found for: ${targetPath}`, result)
    } else if (result.status === 'dry_run') {
      const lines = [`Would lift to work_module/${targetPath}:`]
      if (result.toCopy.length > 0) {
        lines.push(`\nFiles to copy (${result.toCopy.length}):`)
        for (const f of result.toCopy) lines.push(`  + ${f}`)
      }
      if (result.skipped.length > 0) {
        lines.push(`\nSkipped (already exist) (${result.skipped.length}):`)
        for (const s of result.skipped) lines.push(`  - ${s}`)
      }
      module.output(lines.join('\n'), result)
    } else {
      const lines = [`Lifted to work_module/${targetPath}`]
      if (result.copied.length > 0) lines.push(`Copied: ${result.copied.length} files`)
      if (result.skipped.length > 0) lines.push(`Skipped: ${result.skipped.length} files (already exist)`)
      module.output(lines.join('\n'), result)
    }
    return
  }

  // --all not yet implemented
  if (all) {
    module.output('--all flag not yet implemented', { error: 'not_implemented', flag: 'all' })
    return
  }

  // --resource is required (until --all is implemented)
  if (!resource) {
    module.output('--resource or --modules flag required. Usage: spl <container>/lift --resource=<name>', { error: 'missing_resource' })
    return
  }

  // Determine work module path
  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  // Check if container exists in work_module
  if (!liftLib.containerExists(workModulePath, targetPath)) {
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

  // Check if already exists locally
  if (liftLib.resourceExistsLocally(workModulePath, targetPath, resource)) {
    module.output(
      `Resource already exists locally: ${resource}`,
      { status: 'exists', resource, targetPath: workModulePath + '/' + targetPath + '/' + resource }
    )
    return
  }

  // Lift the resource
  const result = liftLib.liftResource(sourcePath, workModulePath, targetPath, resource, dryRun)
  if (result.status === 'dry_run') {
    module.output(
      `Would lift: ${resource}\n  from: ${sourcePath}\n  to: ${result.targetPath}`,
      result
    )
  } else {
    module.output(`Lifted: ${resource}`, result)
  }
}
