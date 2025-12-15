// spl/crud/create - Create a new container
//
// Creates a container in work_module by establishing its identity (index.json only).
// The overlay provides everything else (handler, libs, schemas inherit from type).
//
// Invocation: spl spl/container/test/create
// - Called on the virtual container path (what you want to exist)
// - Parent must expect this child (in instance.children.list)
// - Type determined via parent's type → type.children.type
//
// Flags:
//   --dryRun    Show what would be created without doing it

export default async function(module) {
  const fs = await module.require('fs')
  const path = await module.require('path')
  const crud = await module.require('lib/spl/crud')

  const input = module.input()
  const dryRun = input.dryRun || false

  // Get the method path - this tells us what container to create
  // e.g., "spl/container/test/create" → create "spl/container/test"
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  // Remove "create" from the end to get target container path
  if (segments[segments.length - 1] !== 'create') {
    module.output('Invalid invocation: method must end with /create', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')
  const targetSegments = targetPath.split('/')
  const childName = targetSegments[targetSegments.length - 1]
  const parentPath = targetSegments.slice(0, -1).join('/')

  // Resolve parent's index.json
  const parentIndexPath = module.resolve(parentPath, 'index.json')
  if (!parentIndexPath) {
    module.output(`Parent container not found: ${parentPath}`, { error: 'parent_not_found', parentPath })
    return
  }

  const parentIndex = JSON.parse(fs.readFileSync(parentIndexPath, 'utf8'))

  // Validate child is expected by parent (from instance.children.list)
  const expectedChildren = parentIndex.instance?.children?.list || []

  if (!expectedChildren.includes(childName)) {
    const setCommand = `spl ${parentPath}/set container.instance.children.list+="${childName}"`
    module.output(
      `Child "${childName}" not expected by parent "${parentPath}". Expected: ${expectedChildren.join(', ') || '(none)'}\n\nRun: ${setCommand}`,
      { error: 'child_not_expected', childName, parentPath, expectedChildren, fix: setCommand }
    )
    return
  }

  // Get parent's instance type to find type.children.type
  const parentInstanceType = parentIndex.instantiates
  if (!parentInstanceType) {
    module.output(`Parent "${parentPath}" has no instantiates field`, { error: 'no_instance_type', parentPath })
    return
  }

  // Resolve instance type's index.json to get type.children.type
  const instanceTypeIndexPath = module.resolve(parentInstanceType, 'index.json')
  if (!instanceTypeIndexPath) {
    module.output(`Instance type not found: ${parentInstanceType}`, { error: 'instance_type_not_found', parentInstanceType })
    return
  }

  const instanceTypeIndex = JSON.parse(fs.readFileSync(instanceTypeIndexPath, 'utf8'))
  const childInstanceType = instanceTypeIndex.type?.children?.type

  if (!childInstanceType) {
    module.output(`Instance type "${parentInstanceType}" has no type.children.type field`, { error: 'no_type_children', parentInstanceType })
    return
  }

  // Determine work module path for target
  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  const targetFsPath = path.join(workModulePath, targetPath)
  const indexJsonPath = path.join(targetFsPath, 'index.json')

  // Check if already exists
  if (fs.existsSync(indexJsonPath)) {
    const existingIndex = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'))
    module.output(
      `Container already exists: ${targetPath}`,
      { status: 'exists', targetPath, existing: existingIndex }
    )
    return
  }

  // Build the index.json content
  const indexContent = {
    name: targetPath,
    instantiates: childInstanceType,
    extends: null
  }

  // dryRun mode - show what would be created
  if (dryRun) {
    module.output(
      `Would create: ${targetPath}\n  folder: ${targetFsPath}\n  index.json: ${JSON.stringify(indexContent, null, 2)}`,
      { status: 'dry_run', targetPath, targetFsPath, indexContent }
    )
    return
  }

  // Create the container
  fs.mkdirSync(targetFsPath, { recursive: true })
  fs.writeFileSync(indexJsonPath, JSON.stringify(indexContent, null, 2) + '\n', 'utf8')

  module.output(
    `Created: ${targetPath}`,
    { status: 'created', targetPath, targetFsPath, indexContent }
  )
}
