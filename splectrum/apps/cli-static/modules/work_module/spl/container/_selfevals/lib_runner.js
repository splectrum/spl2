// lib_runner.js - Check lib exports match manifest
//
// Compares summary (from index.json) vs detail (from source)
// for each lib file.
//
// Exports:
//   create(module) -> { run(libFacet) }

export function create(module) {
  return {
    name: 'lib',
    description: 'Check lib exports match manifest',

    // Run the checks
    run(libFacet) {
      if (!libFacet) {
        return { pass: false, error: 'No lib facet', results: [] }
      }

      const summaryFiles = libFacet.summary?.files || {}
      const detailFiles = libFacet.detail?.files || {}
      const results = []

      for (const fileName of Object.keys(summaryFiles)) {
        const expected = summaryFiles[fileName]?.exports || []
        const actual = detailFiles[fileName]?.exports || []

        const missing = expected.filter(e => !actual.includes(e))
        const extra = actual.filter(a => !expected.includes(a))

        const pass = missing.length === 0 && extra.length === 0

        results.push({
          name: fileName,
          pass,
          expected: expected.length,
          actual: actual.length,
          missing,
          extra
        })
      }

      const allPass = results.every(r => r.pass)
      return { pass: allPass, results }
    }
  }
}
