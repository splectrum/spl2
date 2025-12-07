// spl/container/selfeval - Run structural validation checks
// Instantiates: spl/container
//
// Validates container against declared constraints in _selfevals/.
// Flags: --facet=<name>, --dry-run, --report, --verbose

export default async function(module) {
  const selfeval = await module.require('lib/spl/container/selfeval')
  const containerPath = module.getMethod().split('/').slice(0, -1).join('/')

  // Load manifest from container's _selfevals/
  const manifest = await selfeval.loadManifest(containerPath)
  if (manifest.error) return selfeval.output(`No selfevals: ${containerPath}`, manifest)

  // Select facets based on --facet flag
  const facets = selfeval.selectFacets(manifest)
  if (!facets.length) return selfeval.output(`No matching facets`, { error: 'no_facets' })

  // Run selected facets and collect results
  const results = await selfeval.runFacets(containerPath, manifest.absPath, facets)

  // Output based on --report/--verbose flags
  selfeval.output(results.text, results.data)
}
