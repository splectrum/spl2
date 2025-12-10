// spl/container/whoami - Container introspection
// Instantiates: spl/method

export default async function(module) {
  const lib = await module.require('lib/spl/container/whoami')
  const input = module.input()

  // 1. Process flags
  const metaLevel = module.getMetaLevel()
  const reportLevel = module.getReportLevel()
  const detailLevel = module.getDetailLevel()
  const facets = lib.parseFacets(input.facet)
  const depthLevel = input.levels || 0

  // 2. Build container with facets
  const container = await lib.buildContainer(detailLevel, facets)

  // 3. Handle depth level (--levels)
  if (depthLevel > 0 || depthLevel === 'full') {
    container.chain = await lib.buildChain(depthLevel, detailLevel, facets)
  }

  // 4. Render freetext
  const freetext = metaLevel === 'report'
    ? JSON.stringify(container, null, 2)
    : await lib.renderFreetext(container, metaLevel)

  // 5. Output
  module.output(freetext, reportLevel ? container : null)
}
