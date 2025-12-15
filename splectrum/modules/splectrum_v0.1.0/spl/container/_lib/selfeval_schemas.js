// selfeval_schemas.js - Selfeval runner for schemas facet
//
// Checks:
// 1. Files declared in _schemas/index.json exist
// 2. Schema files are declared in manifest
// 3. .avsc files are valid Avro schemas

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')
      const avsc = await module.require('lib/spl/container/avsc.js')

      const schemasPath = path.join(containerFsPath, '_schemas')

      // Read schemas manifest
      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(path.join(schemasPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'schemas | EMPTY',
          summary: 'No _schemas/index.json',
          files: []
        }
      }

      // Handle both array (legacy) and map (current) formats
      const filesField = manifest.files || {}
      const declaredFiles = new Set(
        Array.isArray(filesField) ? filesField : Object.keys(filesField)
      )
      const results = []

      // Check manifest → reality (declared files exist and validate .avsc)
      for (const fileName of declaredFiles) {
        const filePath = path.join(schemasPath, fileName)
        let exists = false
        try {
          fs.statSync(filePath)
          exists = true
        } catch (e) {}

        if (!exists) {
          results.push({
            name: fileName,
            pass: false,
            topline: `${fileName} | FAIL`,
            detail: 'file missing'
          })
          continue
        }

        // Validate .avsc files as valid Avro
        if (fileName.endsWith('.avsc')) {
          const parseResult = await avsc.parseSchema(filePath)
          if (parseResult.ok) {
            results.push({
              name: fileName,
              pass: true,
              topline: `${fileName} | PASS`,
              detail: `valid Avro: ${parseResult.type.name || 'anonymous'}`
            })
          } else {
            results.push({
              name: fileName,
              pass: false,
              topline: `${fileName} | FAIL`,
              detail: `invalid Avro: ${parseResult.error}`
            })
          }
        } else {
          results.push({
            name: fileName,
            pass: true,
            topline: `${fileName} | PASS`,
            detail: 'file exists'
          })
        }
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
