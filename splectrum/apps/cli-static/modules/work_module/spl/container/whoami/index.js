// spl/container/whoami - Container introspection
// Instantiates: spl/method
//
// Returns structured information about a container at configurable depth.
// Flags: --facet=<name>, --levels=<n>, --silent, --verbose, --debug, --report

export default async function(module) {
  const whoami = await module.require('lib/spl/container/whoami')
  const input = module.input()

  // Get container path
  const containerPath = whoami.getContainerPath()

  // Filter to specific facet if requested
  const facet = input.facet || 'all'

  // For now, only schemas facet is implemented
  if (facet === 'all' || facet === 'schemas') {
    const schemas = await whoami.loadSchemasFacet(containerPath)
    await whoami.outputSchemasFacet(schemas)
  }

  // Not available
  if (facet !== 'all' && facet !== 'schemas') {
    const msg = `${facet} - not available`
    module.gradedOutput({ topline: msg, summary: msg, detail: msg, debug: msg })
  }
}
