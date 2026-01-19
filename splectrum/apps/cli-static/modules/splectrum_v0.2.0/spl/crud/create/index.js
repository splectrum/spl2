// spl/crud/create - Create a new container or resource
//
// Creates a container in work_module by establishing its identity (index.json only).
// The overlay provides everything else (handler, libs, schemas inherit from type).
//
// Invocation: spl spl/container/test/create
// - Called on the virtual container path (what you want to exist)
// - Parent must expect this child (in instance.children.list)
// - Type: uses parent.instance.children.type if set, else parent's type.children.type
//
// Resource creation: spl spl/wrapper/create --resource=_lib/wrapper.js
// - Creates a resource file within an existing container
// - Resource path must start with _lib/, _schemas/, or _reqs/
//
// Flags:
//   --dryRun    Show what would be created without doing it
//   --resource  Create a resource file instead of a container

export default async function(module) {
  const crud = await module.require('lib/spl/crud')
  const createLib = await module.require('lib/spl/crud/create')

  const input = module.input()
  const dryRun = input.dryRun || false
  const resource = input.resource || null

  // Resource creation mode
  if (resource) {
    const validPrefixes = ['_lib/', '_schemas/', '_reqs/']
    if (!validPrefixes.some(p => resource.startsWith(p))) {
      module.output(
        `Invalid resource path: ${resource}. Must start with: ${validPrefixes.join(', ')}`,
        { error: 'invalid_resource_path', resource, validPrefixes }
      )
      return
    }

    const methodPath = module.getMethod()
    const containerPath = methodPath.replace(/\/create$/, '')

    const containerIndexPath = module.resolve(containerPath, 'index.json')
    if (!containerIndexPath) {
      module.output(`Container not found: ${containerPath}`, { error: 'container_not_found', containerPath })
      return
    }

    const workModulePath = await crud.getWorkModulePath()
    if (!workModulePath) {
      module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
      return
    }

    const existingPath = module.resolve(containerPath, resource)
    if (existingPath) {
      module.output(`Resource already exists: ${resource}`, { status: 'exists', containerPath, resource, existingPath })
      return
    }

    const result = createLib.createResource(containerPath, resource, workModulePath, dryRun)
    if (result.status === 'dry_run') {
      module.output(`Would create: ${containerPath}/${resource}`, result)
    } else {
      module.output(`Created: ${containerPath}/${resource}`, result)
    }
    return
  }

  // Container creation mode
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  if (segments[segments.length - 1] !== 'create') {
    module.output('Invalid invocation: method must end with /create', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')
  const targetSegments = targetPath.split('/')
  const childName = targetSegments[targetSegments.length - 1]
  const parentPath = targetSegments.slice(0, -1).join('/')

  const parentIndexPath = module.resolve(parentPath, 'index.json')
  if (!parentIndexPath) {
    module.output(`Parent container not found: ${parentPath}`, { error: 'parent_not_found', parentPath })
    return
  }

  const parentIndex = createLib.readIndex(parentIndexPath)
  const expectedChildren = parentIndex.instance?.children?.list || []

  if (!expectedChildren.includes(childName)) {
    const setCommand = `spl ${parentPath}/set container.instance.children.list+="${childName}"`
    module.output(
      `Child "${childName}" not expected by parent "${parentPath}". Expected: ${expectedChildren.join(', ') || '(none)'}\n\nRun: ${setCommand}`,
      { error: 'child_not_expected', childName, parentPath, expectedChildren, fix: setCommand }
    )
    return
  }

  // Check for instance-level override first (parent.instance.children.type)
  let childInstanceType = parentIndex.instance?.children?.type

  // If no override, get from the parent's instance type (type.children.type)
  if (!childInstanceType) {
    const parentInstanceType = parentIndex.instantiates
    if (!parentInstanceType) {
      module.output(`Parent "${parentPath}" has no instantiates field`, { error: 'no_instance_type', parentPath })
      return
    }

    const instanceTypeIndexPath = module.resolve(parentInstanceType, 'index.json')
    if (!instanceTypeIndexPath) {
      module.output(`Instance type not found: ${parentInstanceType}`, { error: 'instance_type_not_found', parentInstanceType })
      return
    }

    const instanceTypeIndex = createLib.readIndex(instanceTypeIndexPath)
    childInstanceType = instanceTypeIndex.type?.children?.type

    if (!childInstanceType) {
      module.output(`Instance type "${parentInstanceType}" has no type.children.type field`, { error: 'no_type_children', parentInstanceType })
      return
    }
  }

  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  const targetFsPath = createLib.getContainerFsPath(workModulePath, targetPath)
  const indexJsonPath = createLib.getIndexJsonPath(targetFsPath)

  if (createLib.containerExists(indexJsonPath)) {
    const existingIndex = createLib.readIndex(indexJsonPath)
    module.output(
      `Container already exists: ${targetPath}`,
      { status: 'exists', targetPath, existing: existingIndex }
    )
    return
  }

  const indexContent = {
    name: targetPath,
    instantiates: childInstanceType,
    extends: null
  }

  const result = createLib.createContainer(targetPath, targetFsPath, indexContent, dryRun)
  if (result.status === 'dry_run') {
    module.output(
      `Would create: ${targetPath}\n  folder: ${targetFsPath}\n  index.json: ` + JSON.stringify(indexContent, null, 2),
      result
    )
  } else {
    module.output(`Created: ${targetPath}`, result)
  }
}
