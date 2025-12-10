// spl/container/selfeval - Validate container against requirements
// Instantiates: spl/method
//
// Runs selfeval runners to check container implementation.
// Flags: --meta, --report, --runner, --dry-run, --fail-fast, --levels

export default async function(module) {
  const input = module.input()
  const selfeval = await module.require('lib/spl/container/selfeval.js')
  const freetext = await module.require('lib/spl/container/freetext.js')

  // 1. Process flags
  const metaLevel = module.getMetaLevel()
  const reportLevel = module.getReportLevel()
  const levels = input.levels || '1'  // Reserved for chain traversal

  // Get container path
  const containerPath = module.getMethod().split('/').slice(0, -1).join('/')
  const fs = await module.require('fs')
  const path = await module.require('path')
  const indexJsonPath = module.resolve(containerPath, 'index.json')
  if (!indexJsonPath) {
    return module.output(`No container found: ${containerPath}`)
  }
  const containerFsPath = path.dirname(indexJsonPath)

  // 2. Load registry
  const registry = await selfeval.loadRegistry(containerFsPath)
  const runnerKeys = Object.keys(registry.runners || {})
  if (runnerKeys.length === 0) {
    return module.output(`No selfeval runners for: ${containerPath}`)
  }

  // 3. Filter runners based on --runner flag
  const selectedRunnerNames = input.runner
    ? input.runner.split(',').map(r => r.trim())
    : runnerKeys

  // Load selected runners
  const runners = []
  for (const name of selectedRunnerNames) {
    const meta = registry.runners[name]
    if (meta) {
      const fn = await selfeval.loadRunner(meta, containerFsPath)
      if (fn) runners.push({ meta, fn })
    }
  }

  if (runners.length === 0) {
    return module.output(`No runners loaded for: ${containerPath}`)
  }

  // 4. Dry run: show what would run
  if (input.dryRun) {
    const dryRunResult = {
      topline: `${containerPath} | dry-run`,
      summary: `${runners.length} runners: ${runners.map(r => r.meta.name).join(', ')}`,
      runners: runners.map(r => ({
        topline: r.meta.name,
        summary: r.meta.description
      }))
    }
    const dryFreetext = metaLevel === 'report'
      ? JSON.stringify(dryRunResult, null, 2)
      : freetext.render(dryRunResult, metaLevel)
    return module.output(dryFreetext, reportLevel ? dryRunResult : null)
  }

  // 5. Run selfeval
  const results = await selfeval.runAll(containerFsPath, containerPath, runners, { failFast: input.failFast })

  // 6. Render freetext
  const output = metaLevel === 'report'
    ? JSON.stringify(results, null, 2)
    : freetext.render(results, metaLevel)

  // 7. Output
  module.output(output, reportLevel ? results : null)
}
