// spl/container/update - Update container to fix drift
//
// Operations:
// 1. Container facet fix - Fix index.json to match container.avsc schema
// 2. Schema inheritance merge - Propagate parent schema fields to derived schemas
//
// Invocation: spl spl/container/test/update
//
// Flags:
//   --dryRun    Show what would be changed without doing it

export default async function(module) {
  const updateLib = await module.require('lib/spl/crud/update')

  const input = module.input()
  const dryRun = input.dryRun || false

  // Get the method path - this tells us what container to update
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  if (segments[segments.length - 1] !== 'update') {
    module.output('Invalid invocation: method must end with /update', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // Resolve target container's index.json
  const targetIndexPath = module.resolve(targetPath, 'index.json')
  if (!targetIndexPath) {
    module.output(`Container not found: ${targetPath}`, { error: 'container_not_found', targetPath })
    return
  }

  const changes = []
  const indexResult = updateLib.readJson(targetIndexPath)
  if (!indexResult.ok) {
    module.output(`Cannot read index.json: ${indexResult.error}`, { error: 'read_error' })
    return
  }
  const targetIndex = indexResult.data

  // --- Operation 1: Container facet fix ---
  const containerChanges = await updateLib.fixContainerFacet(targetPath, targetIndex, targetIndexPath, dryRun)
  changes.push(...containerChanges)

  // --- Operation 2: Schema inheritance merge ---
  const schemaChanges = await updateLib.mergeSchemaInheritance(targetPath, dryRun)
  changes.push(...schemaChanges)

  // Output results
  if (changes.length === 0) {
    module.output(`${targetPath} | up to date`, { status: 'up_to_date', targetPath })
  } else {
    const applied = dryRun ? 'would apply' : 'applied'
    module.output(
      `${targetPath} | ${changes.length} changes ${applied}\n${changes.map(c => `  ${c}`).join('\n')}`,
      { status: dryRun ? 'dry_run' : 'updated', targetPath, changes }
    )
  }
}
