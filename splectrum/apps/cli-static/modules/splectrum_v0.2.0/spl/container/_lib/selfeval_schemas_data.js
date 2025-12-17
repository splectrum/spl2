// selfeval_schemas_data.js - Selfeval runner for schema data validation
//
// Validates facet data files against their .avsc schemas.
// Uses 'validates' field in _schemas/index.json to find data files.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')
      const avsc = await module.require('lib/spl/container/avsc.js')

      const schemasPath = path.join(containerFsPath, '_schemas')
      const manifestPath = path.join(schemasPath, 'index.json')

      // Read schemas manifest
      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'schemas_data | SKIP',
          summary: 'no schemas',
          files: []
        }
      }

      const files = manifest.files || {}
      const results = []

      // Process each schema with a validates field
      for (const [schemaFile, meta] of Object.entries(files)) {
        if (!meta.validates) continue

        const schemaPath = path.join(schemasPath, schemaFile)
        const dataPath = path.join(containerFsPath, meta.validates)

        // Check if data file exists
        if (!fs.existsSync(dataPath)) {
          // Data file doesn't exist - not an error, facet may not be present
          continue
        }

        // Parse schema
        const schemaResult = await avsc.parseSchema(schemaPath)
        if (!schemaResult.ok) {
          results.push({
            name: schemaFile,
            pass: false,
            topline: `${schemaFile} | FAIL`,
            detail: `schema error: ${schemaResult.error}`
          })
          continue
        }

        // Read and validate data
        let data
        try {
          data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
        } catch (e) {
          results.push({
            name: schemaFile,
            pass: false,
            topline: `${schemaFile} | FAIL`,
            detail: `data error: ${e.message}`
          })
          continue
        }

        const errors = avsc.validate(schemaResult.type, data)
        if (errors) {
          results.push({
            name: schemaFile,
            pass: false,
            topline: `${schemaFile} | FAIL`,
            detail: `validation failed`,
            errors
          })
        } else {
          results.push({
            name: schemaFile,
            pass: true,
            topline: `${schemaFile} | PASS`,
            detail: `validates ${meta.validates}`
          })
        }
      }

      if (results.length === 0) {
        return {
          pass: true,
          topline: 'schemas_data | SKIP',
          summary: 'no data to validate',
          files: []
        }
      }

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `schemas data | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} validated`,
        files: results
      }
    }
  }
}
