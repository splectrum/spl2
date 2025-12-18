// selfeval_handler.js - Selfeval runner for handler facet
//
// Checks index.js exists (via overlay) and exports a function.

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    async run(containerFsPath) {

      // Get container path from filesystem path
      const indexJson = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
      const containerPath = indexJson.name

      // Resolve index.js through overlay (inherits from parent types)
      const handlerPath = module.resolve(containerPath, 'index.js')

      // Check file exists
      let content
      if (!handlerPath) {
        return {
          pass: false,
          topline: 'handler | FAIL',
          summary: 'No index.js',
          checks: []
        }
      }

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
