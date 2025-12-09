// spl/container/whoami - Container introspection
// Instantiates: spl/method
//
// Report-first architecture: builds structured report, renders freetext from it.
// Reports actual state - feeds into selfeval for validation.

export default async function(module) {
  const whoami = await module.require('lib/spl/container/whoami')

  // Build structured report
  const report = await whoami.buildReport()

  // Output freetext at all levels
  module.gradedOutput({
    topline: await whoami.renderFreetext(report, 'topline'),
    summary: await whoami.renderFreetext(report, 'summary'),
    detail: await whoami.renderFreetext(report, 'detail'),
    enriched: await whoami.renderFreetext(report, 'enriched')
  })

  // Return report as data output
  return { report }
}
