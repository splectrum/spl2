// spl/introspection/whoami - Container introspection
// Instantiates: spl/method

export default async function(module) {
  const lib = await module.require("lib/spl/introspection/whoami")
  const input = module.input()

  // Handle --usage: build instantiates stack to find input.avsc through instance chain
  if (input.usage) {
    const { stack, instanceLevel } = await lib.buildTypeStack("instantiates")
    const containerPath = stack[0]

    // Build all levels with schemas/input facet
    const levelResults = []
    for (let i = 0; i < stack.length; i++) {
      const level = stack[i]
      const container = await lib.buildContainerAtLevel(level, "detail", ["schemas/input"])
      if (container) {
        const parts = container.topline.split(" | ")
        const rest = parts.slice(1).join(" | ")
        container.topline = rest ? parts[0] + " [" + (i + 1) + "] | " + rest : parts[0] + " [" + (i + 1) + "]"
        levelResults.push(container)
      }
    }

    // Find first level with input.avsc
    const levelWithSchema = levelResults.find(c => {
      const schemasFacet = c.facets?.find(f => f.name === "schemas")
      return schemasFacet?.topline?.includes("input.avsc")
    })

    if (!levelWithSchema) {
      return module.output("No input schema found")
    }

    // Build report with just that level
    const report = {
      topline: containerPath + " [levels: " + stack.map((t, i) => (i + 1) + " " + t).join(", ") + ", instanceLevel: " + instanceLevel + "]",
      levels: [levelWithSchema]
    }

    // Render with hide
    const options = { hide: input.hide || "topline,summary" }
    const output = await lib.renderFreetext(report, "detail", options)
    return module.output(output)
  }

  // 1. Process flags
  const metaLevel = module.getMetaLevel()
  const reportLevel = module.getReportLevel()
  const detailLevel = module.getDetailLevel()
  const facets = lib.parseFacets(input.facet)
  const levelsArg = input.levels

  // 2. Build type stack
  const { stack, instanceLevel } = await lib.buildTypeStack()
  const containerPath = stack[0]  // First element is the container itself
  const levelsInfo = containerPath + " [levels: " + stack.map((t, i) => (i + 1) + " " + t).join(", ") + ", instanceLevel: " + instanceLevel + "]"

  // 3. Handle --levels flag alone (show available levels only)
  if (levelsArg === true || levelsArg === "") {
    return module.output(levelsInfo)
  }

  // 4. Determine which levels to show
  let selectedLevels

  if (!levelsArg || levelsArg === "all") {
    // Default: show all levels in type stack
    selectedLevels = stack
  } else {
    // --levels=spl/container,spl/api: show specific levels
    const requested = levelsArg.split(",").map(l => l.trim())
    selectedLevels = stack.filter(l => requested.includes(l))
  }

  // 5. Build containers for selected levels
  const levelResults = []
  for (let i = 0; i < selectedLevels.length; i++) {
    const levelName = selectedLevels[i]
    const levelIdx = stack.indexOf(levelName) + 1
    const container = await lib.buildContainerAtLevel(levelName, detailLevel, facets)
    if (container) {
      // Insert level after name: "name | lineage" -> "name [level] | lineage"
      const parts = container.topline.split(" | ")
      const rest = parts.slice(1).join(" | ")
      container.topline = rest ? parts[0] + " [" + levelIdx + "] | " + rest : parts[0] + " [" + levelIdx + "]"
      levelResults.push(container)
    }
  }

  // 6. Render output
  if (levelResults.length === 0) {
    return module.output("No levels found")
  }

  // Wrap in container with levels
  const report = {
    topline: levelsInfo,
    levels: levelResults
  }

  if (metaLevel === "report") {
    return module.output(JSON.stringify(report, null, 2), reportLevel ? report : null)
  }

  // Render freetext - freetext renderer will handle the levels array
  const options = input.hide ? { hide: input.hide } : {}
  const output = await lib.renderFreetext(report, metaLevel, options)
  module.output(output, reportLevel ? report : null)
}
