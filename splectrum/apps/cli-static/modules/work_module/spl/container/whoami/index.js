// spl/container/whoami - Container introspection
// Instantiates: spl/method

export default async function(module) {
  const lib = await module.require('lib/spl/container/whoami')
  const input = module.input()

  // Handle --usage: rewrite to schemas/input facet
  if (input.usage) {
    input.facet = 'schemas/input'
    input.meta = input.meta || 'detail'
  }

  // 1. Process flags
  const metaLevel = module.getMetaLevel()
  const reportLevel = module.getReportLevel()
  const detailLevel = module.getDetailLevel()
  const facets = lib.parseFacets(input.facet)
  const levelsArg = input.levels

  // 2. Build type stack
  const { stack, instanceLevel } = lib.buildTypeStack()
  const containerPath = stack[0]  // First element is the container itself
  const levelsInfo = `${containerPath} [levels: ${stack.map((t, i) => `${i + 1} ${t}`).join(', ')}, instanceLevel: ${instanceLevel}]`

  // 3. Handle --levels flag alone (show available levels only)
  if (levelsArg === true || levelsArg === '') {
    return module.output(levelsInfo)
  }

  // 4. Determine which levels to show
  let selectedLevels

  if (!levelsArg) {
    // No --levels flag: just show current container (first in stack)
    selectedLevels = [stack[0]]
  } else if (levelsArg === 'all') {
    // --levels=all: show all levels
    selectedLevels = stack
  } else {
    // --levels=spl/container,spl/api: show specific levels
    const requested = levelsArg.split(',').map(l => l.trim())
    selectedLevels = stack.filter(l => requested.includes(l))
  }

  // 5. Build containers for selected levels
  const levelResults = []
  for (let i = 0; i < selectedLevels.length; i++) {
    const levelName = selectedLevels[i]
    const levelIdx = stack.indexOf(levelName) + 1
    const container = await lib.buildContainerAtLevel(levelName, detailLevel, facets)
    if (container) {
      // Always add level info to topline
      container.topline = `${container.topline} [${levelIdx}/${stack.length}]`
      levelResults.push(container)
    }
  }

  // 6. Render output
  if (levelResults.length === 0) {
    return module.output('No levels found')
  }

  // Wrap in container with levels
  const report = {
    topline: levelsInfo,
    levels: levelResults
  }

  if (metaLevel === 'report') {
    return module.output(JSON.stringify(report, null, 2), reportLevel ? report : null)
  }

  // Render freetext - freetext renderer will handle the levels array
  const output = await lib.renderFreetext(report, metaLevel)
  module.output(output, reportLevel ? report : null)
}
