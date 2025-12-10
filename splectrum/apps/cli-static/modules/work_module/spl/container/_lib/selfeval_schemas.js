// selfeval_schemas.js - Selfeval runner for schemas facet
//
// Checks files declared in _schemas/index.json exist,
// and schema files are declared in manifest.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const schemasPath = path.join(containerFsPath, '_schemas')

      // Read schemas manifest
      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(path.join(schemasPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'schemas | SKIP',
          summary: 'No _schemas/index.json',
          files: []
        }
      }

      const declaredFiles = new Set(manifest.files || [])
      const results = []

      // Check manifest → reality (declared files exist)
      for (const fileName of declaredFiles) {
        let exists = false
        try {
          fs.statSync(path.join(schemasPath, fileName))
          exists = true
        } catch (e) {}

        results.push({
          name: fileName,
          pass: exists,
          topline: `${fileName} | ${exists ? 'PASS' : 'FAIL'}`,
          detail: exists ? 'file exists' : 'file missing'
        })
      }

      // Check reality → manifest (actual files are declared)
      try {
        const actualFiles = fs.readdirSync(schemasPath)
          .filter(f => f.endsWith('.avsc') || f.endsWith('.json'))
          .filter(f => f !== 'index.json')

        for (const fileName of actualFiles) {
          if (!declaredFiles.has(fileName)) {
            results.push({
              name: fileName,
              pass: false,
              topline: `${fileName} | FAIL`,
              detail: 'unregistered file'
            })
          }
        }
      } catch (e) {}

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `schemas | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} files`,
        files: results
      }
    }
  }
}
