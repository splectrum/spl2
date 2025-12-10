// selfeval_handler.js - Selfeval runner for handler facet
//
// Checks index.js exists and exports a function.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const handlerPath = path.join(containerFsPath, 'index.js')

      // Check file exists
      let content
      try {
        content = fs.readFileSync(handlerPath, 'utf8')
      } catch (e) {
        return {
          pass: false,
          topline: 'handler | FAIL',
          summary: 'No index.js',
          checks: []
        }
      }

      const checks = []

      // Check exports a function (default export or module.exports)
      const hasDefaultExport = /export\s+default\s+(async\s+)?function/.test(content)
      const hasModuleExports = /module\.exports\s*=\s*(async\s+)?function/.test(content)
      const hasExport = hasDefaultExport || hasModuleExports

      checks.push({
        name: 'export',
        pass: hasExport,
        topline: `export | ${hasExport ? 'PASS' : 'FAIL'}`,
        detail: hasExport ? 'exports function' : 'no function export found'
      })

      const allPass = checks.every(c => c.pass)
      const passCount = checks.filter(c => c.pass).length

      return {
        pass: allPass,
        topline: `handler | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${checks.length} checks`,
        checks: checks
      }
    }
  }
}
