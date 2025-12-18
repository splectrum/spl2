// spl/introspection/selfeval - Validate container against requirements
// Instantiates: spl/method
//
// Runs selfeval runners to check container implementation.
// Flags: --meta, --report, --runner, --dry-run, --fail-fast, --levels

import path from 'path'

export default async function(module) {
  const input = module.input()
  const selfeval = await module.require('lib/spl/introspection/selfeval.js')
  const freetext = await module.require('lib/spl/introspection/freetext.js')

  // 1. Process flags
  const metaLevel = module.getMetaLevel()
  const reportLevel = module.getReportLevel()
  const levelsArg = input.levels

  // Get container path
  const containerPath = module.getMethod().split('/').slice(0, -1).join('/')
  const indexJsonPath = module.resolve(containerPath, 'index.json')
  if (!indexJsonPath) {
    return module.output(`No container found: ${containerPath}`)
  }
  const containerFsPath = path.dirname(indexJsonPath)

  // 2. Build type stack for levels support
  const { stack, instanceLevel } = selfeval.buildTypeStack(containerPath)
  const levelsInfo = `${containerPath} [levels: ${stack.map((t, i) => `${i + 1} ${t}`).join(', ')}, instanceLevel: ${instanceLevel}]`

  // 3. Handle --levels flag alone (show available levels only)
  if (levelsArg === true || levelsArg === '') {
    return module.output(levelsInfo)
  }

  // 4. Determine which levels to run
  let selectedLevels
  if (!levelsArg || levelsArg === 'all') {
    // Default: run all levels (comprehensive validation)
    selectedLevels = stack
  } else {
    // --levels=spl/container: run specific level(s)
    const requested = levelsArg.split(',').map(l => l.trim())
    selectedLevels = stack.filter(l => requested.includes(l))
  }

  // 5. Run selfeval for each selected level
  const levelResults = []
  let allPass = true

  for (let i = 0; i < selectedLevels.length; i++) {
    const levelName = selectedLevels[i]
    const levelIdx = stack.indexOf(levelName) + 1
    const isInstanceLevel = (levelIdx === instanceLevel)

    // Load registry from this level's _selfevals/index.json
    const registry = await selfeval.loadRegistryFromType(levelName)

    // Get runners: type runners always, plus instanceRunners at instance level (direct type)
    const runnerKeys = Object.keys(registry.runners || {})
    const instanceRunnerKeys = isInstanceLevel ? Object.keys(registry.instanceRunners || {}) : []
    const allRunnerKeys = [...runnerKeys, ...instanceRunnerKeys]

    if (allRunnerKeys.length === 0) {
      // No runners at this level - skip with info
      levelResults.push({
        pass: true,
        topline: `${levelName} | SKIP`,
        summary: 'no runners',
        runners: []
      })
      continue
    }

    // Filter runners based on --runner flag (applies within each level)
    const selectedRunnerNames = input.runner
      ? input.runner.split(',').map(r => r.trim())
      : allRunnerKeys

    // Load runners from this level's _lib
    const runners = []
    for (const name of selectedRunnerNames) {
      // Check both runners and instanceRunners
      const meta = registry.runners?.[name] || (isInstanceLevel ? registry.instanceRunners?.[name] : null)
      if (meta) {
        const fn = await selfeval.loadRunnerFromType(meta, levelName)
        if (fn) runners.push({ meta, fn })
      }
    }

    if (runners.length === 0) {
      levelResults.push({
        pass: true,
        topline: `${levelName} | SKIP`,
        summary: 'no runners loaded',
        runners: []
      })
      continue
    }

    // Dry run: show what would run
    if (input.dryRun) {
      levelResults.push({
        topline: `${levelName} | dry-run`,
        summary: `${runners.length} runners: ${runners.map(r => r.meta.name).join(', ')}`,
        runners: runners.map(r => ({
          topline: r.meta.name,
          summary: r.meta.description
        }))
      })
      continue
    }

    // Run selfeval for this level - test current container against this level's rules
    const results = await selfeval.runAll(containerFsPath, containerPath, runners, { failFast: input.failFast })
    results.topline = `${levelName} | ${results.pass ? 'PASS' : 'FAIL'}`
    levelResults.push(results)

    if (!results.pass) allPass = false
    if (input.failFast && !results.pass) break
  }

  // 6. Build combined report
  // Count runners across all levels
  let totalRunners = 0
  let passedRunners = 0
  const failedRunnerNames = []

  for (const level of levelResults) {
    if (level.runners) {
      for (const runner of level.runners) {
        totalRunners++
        if (runner.pass) {
          passedRunners++
        } else {
          failedRunnerNames.push(runner.topline.split(' | ')[0])
        }
      }
    }
  }

  // Build topline with counts and failure list
  let topline
  if (allPass) {
    topline = `${containerPath} | PASS (${passedRunners}/${totalRunners})`
  } else {
    topline = `${containerPath} | FAIL (${passedRunners}/${totalRunners}) - ${failedRunnerNames.join(', ')}`
  }

  // Build summary
  const levelPassCount = levelResults.filter(r => r.pass).length
  const summary = allPass
    ? `${levelPassCount} levels passed`
    : `failed: ${failedRunnerNames.join(', ')}`

  const report = {
    pass: allPass,
    topline,
    summary,
    levels: levelResults
  }

  // 7. Render freetext
  const output = metaLevel === 'report'
    ? JSON.stringify(report, null, 2)
    : freetext.renderWithLevels(report, metaLevel)

  // 8. Output
  module.output(output, reportLevel ? report : null)
}
