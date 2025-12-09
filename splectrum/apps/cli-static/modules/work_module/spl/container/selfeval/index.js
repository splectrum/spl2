// spl/container/selfeval - Validate container against requirements
// Instantiates: spl/container
//
// Runs selfeval runners to check container implementation.
// Flags: --runner, --dry-run, --fail-fast, --report, --verbose

export default async function(module) {
  const input = module.input()
  const fs = await module.require('fs')
  const path = await module.require('path')

  // Get container path and fs path
  const containerPath = module.getMethod().split('/').slice(0, -1).join('/')
  const indexJsonPath = module.resolve(containerPath, 'index.json')
  if (!indexJsonPath) {
    return module.output(`No container found: ${containerPath}`)
  }
  const containerFsPath = path.dirname(indexJsonPath)

  // Load libs
  const reportLib = await module.require('lib/spl/container/report.js')
  const selfeval = await module.require('lib/spl/container/selfeval.js')

  // Load registry
  const registry = await selfeval.loadRegistry(containerFsPath)
  if (!registry.runners || Object.keys(registry.runners).length === 0) {
    return module.output(`No selfeval runners for: ${containerPath}`)
  }

  // Select runners (--runner flag or all)
  const selectedRunnerNames = input.runner
    ? [input.runner]
    : Object.keys(registry.runners)

  // Load selected runners
  const runners = []
  for (const name of selectedRunnerNames) {
    const runner = await selfeval.loadRunner(containerFsPath, name, registry)
    if (runner) runners.push(runner)
  }

  if (runners.length === 0) {
    return module.output(`No runners loaded for: ${containerPath}`)
  }

  // dryRun: show what would run without executing
  if (input.dryRun) {
    const dryRunReport = {
      container: containerPath,
      runners: runners.map(r => ({ name: r.name, description: r.description }))
    }
    module.gradedOutput({
      topline: `selfeval: ${runners.length} runners`,
      summary: `Would run: ${runners.map(r => r.name).join(', ')}`,
      detail: runners.map(r => `${r.name}: ${r.description}`).join('\n')
    })
    return dryRunReport
  }

  // Build container report (need lib facet with detail level)
  const identity = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
  const containerReport = reportLib.buildContainer(identity)

  // Build lib facet with file contents for detail level
  const libManifest = JSON.parse(fs.readFileSync(path.join(containerFsPath, '_lib', 'index.json'), 'utf8'))
  const libFileContents = {}
  for (const fileName of Object.keys(libManifest.files || {})) {
    try {
      libFileContents[fileName] = fs.readFileSync(path.join(containerFsPath, '_lib', fileName), 'utf8')
    } catch (e) {}
  }
  containerReport.facets.push(reportLib.buildLib(libManifest, libFileContents))

  // Run selfeval (with failFast option)
  const results = await selfeval.runAll(containerReport, runners, { failFast: input.failFast })

  // Build graded freetext output
  module.gradedOutput({
    topline: results.pass ? 'PASS' : 'FAIL',
    summary: selfeval.renderFreetext(results, containerPath, 'summary'),
    detail: selfeval.renderFreetext(results, containerPath, 'detail')
  })

  // Return report as data output (shown with --report flag)
  return results
}
