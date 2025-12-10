// selfeval_lib.js - Selfeval runner for lib facet
//
// Compares manifest exports vs actual exports for each lib file.
// Checks both directions: declared exist, and existing are declared.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const libPath = path.join(containerFsPath, '_lib')

      // Read lib manifest
      const manifestPath = path.join(libPath, 'index.json')
      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'lib | SKIP',
          summary: 'No _lib/index.json',
          files: []
        }
      }

      const manifestFiles = manifest.files || {}
      const results = []

      // Check manifest → reality (declared files/exports exist)
      for (const [fileName, fileMeta] of Object.entries(manifestFiles)) {
        const expected = fileMeta.exports || []

        // Read actual file
        let fileExists = true
        let content = ''
        try {
          content = fs.readFileSync(path.join(libPath, fileName), 'utf8')
        } catch (e) {
          fileExists = false
        }

        if (!fileExists) {
          results.push({
            name: fileName,
            pass: false,
            topline: `${fileName} | FAIL`,
            detail: 'file missing'
          })
          continue
        }

        // Skip export checking if no exports declared (single function files)
        if (expected.length === 0) {
          results.push({
            name: fileName,
            pass: true,
            topline: `${fileName} | PASS`,
            detail: 'file exists'
          })
          continue
        }

        // Check exports
        const actual = extractExports(content)
        const missing = expected.filter(e => !actual.includes(e))
        const extra = actual.filter(a => !expected.includes(a))
        const pass = missing.length === 0 && extra.length === 0

        const result = {
          name: fileName,
          pass,
          topline: `${fileName} | ${pass ? 'PASS' : 'FAIL'}`,
          detail: `${actual.length}/${expected.length} exports, missing(${missing.length}), extra(${extra.length})`
        }

        if (missing.length > 0 || extra.length > 0) {
          const parts = []
          if (missing.length > 0) parts.push(`missing: ${missing.join(', ')}`)
          if (extra.length > 0) parts.push(`extra: ${extra.join(', ')}`)
          result.enriched = parts.join('\n')
        }

        results.push(result)
      }

      // Check reality → manifest (actual files are declared)
      try {
        const actualFiles = fs.readdirSync(libPath)
          .filter(f => f.endsWith('.js'))

        for (const fileName of actualFiles) {
          if (!manifestFiles[fileName]) {
            results.push({
              name: fileName,
              pass: false,
              topline: `${fileName} | FAIL`,
              detail: 'unregistered file'
            })
          }
        }
      } catch (e) {
        // Can't read directory
      }

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `lib | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} files`,
        files: results
      }
    }
  }
}

// Extract exported function names from source
function extractExports(content) {
  const exports = []

  // Check for named exports in create() return object
  const shorthandMatches = content.matchAll(/^\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm)
  for (const match of shorthandMatches) {
    const name = match[1]
    if (!['create', 'if', 'for', 'while', 'switch', 'catch', 'function'].includes(name)) {
      exports.push(name)
    }
  }

  return [...new Set(exports)]
}
