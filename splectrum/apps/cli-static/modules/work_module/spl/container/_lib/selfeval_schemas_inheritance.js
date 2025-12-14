// selfeval_schemas_inheritance.js - Selfeval runner for schema inheritance validation
//
// Checks that schema files include all inherited fields from parent types.
// On drift: reports fail with "run update to fix" message.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')
      const avsc = await module.require('lib/spl/container/avsc.js')

      // Read container identity to get type info
      let identity
      try {
        identity = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'schemas inheritance | SKIP',
          summary: 'No index.json'
        }
      }

      // Build type stack
      const containerPath = identity.name
      const { stack } = module.buildTypeStack(containerPath)

      // No inheritance to check if only one level
      if (stack.length <= 1) {
        return {
          pass: true,
          topline: 'schemas inheritance | PASS',
          summary: 'No parent types'
        }
      }

      // Collect schema files across all levels
      // Map: filename -> base level index (last/deepest level where it appears)
      const schemaBaseLevel = {}
      const schemasByLevel = {}

      for (let i = 0; i < stack.length; i++) {
        const typePath = stack[i]
        const typeFsPath = await getContainerFsPath(typePath)
        if (!typeFsPath) continue

        const schemasPath = path.join(typeFsPath, '_schemas')
        let manifest
        try {
          manifest = JSON.parse(fs.readFileSync(path.join(schemasPath, 'index.json'), 'utf8'))
        } catch (e) {
          continue
        }

        // Handle both array (legacy) and map (current) formats
        const filesField = manifest.files || {}
        const files = Array.isArray(filesField) ? filesField : Object.keys(filesField)
        schemasByLevel[i] = {}

        for (const fileName of files) {
          // Track base level (last/deepest level where this file appears)
          schemaBaseLevel[fileName] = i

          // Load schema content
          try {
            const content = JSON.parse(fs.readFileSync(path.join(schemasPath, fileName), 'utf8'))
            schemasByLevel[i][fileName] = content
          } catch (e) {
            // Skip if can't read
          }
        }
      }

      // Check inheritance for each schema file
      const driftedFiles = []

      for (const [fileName, baseLevel] of Object.entries(schemaBaseLevel)) {
        const parentSchema = schemasByLevel[baseLevel]?.[fileName]
        if (!parentSchema) continue

        // Check each level above baseLevel (more derived levels)
        for (let i = 0; i < baseLevel; i++) {
          const childSchema = schemasByLevel[i]?.[fileName]
          if (!childSchema) continue

          const result = avsc.compareSchemas(parentSchema, childSchema)
          if (!result.compatible) {
            driftedFiles.push(fileName)
            break
          }
        }
      }

      if (driftedFiles.length === 0) {
        return {
          pass: true,
          topline: 'schemas inheritance | PASS',
          summary: `${Object.keys(schemaBaseLevel).length} files checked`
        }
      }

      return {
        pass: false,
        topline: 'schemas inheritance | FAIL',
        summary: 'drift detected - run update to fix',
        driftedFiles
      }

      // Helper to get fs path for a container
      async function getContainerFsPath(containerPath) {
        const indexJsonPath = module.resolve(containerPath, 'index.json')
        if (indexJsonPath) {
          return path.dirname(indexJsonPath)
        }
        return null
      }
    }
  }
}
