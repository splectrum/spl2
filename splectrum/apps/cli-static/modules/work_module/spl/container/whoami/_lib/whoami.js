// whoami.js - Container introspection implementation
//
// Returns structured information about a container at configurable depth.
//
// Flags:
//   --facet=<name>  filter to specific facet (schemas, reqs, lib, methods, etc.)
//   --levels=<n>    type chain traversal depth (0=this only, full=all)
//   --silent        topline output
//   --verbose       detail output
//   --debug         debug output (includes DSL glossary)
//   --report[=lvl]  include data output at level
//
// Exports:
//   getContainerPath()     - resolve parent container from method path
//   loadSchemasFacet()     - load _schemas folder info
//   outputSchemasFacet()   - output schemas at graded levels

export function create(module) {
  let _fs = null
  let _dslGlossary = null

  const getFs = async () => {
    if (!_fs) _fs = await module.require('fs')
    return _fs
  }

  const getDslGlossary = async () => {
    if (!_dslGlossary) {
      const fs = await getFs()
      const path = await module.require('path')
      const nodeRoot = module.getNodeRoot()
      const glossaryPath = path.join(nodeRoot, '..', 'glossary', 'dsl.json')
      try {
        _dslGlossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'))
      } catch (e) {
        _dslGlossary = { terms: {} }
      }
    }
    return _dslGlossary
  }

  const lookupDsl = async (term) => {
    const glossary = await getDslGlossary()
    const entry = glossary.terms[term]
    if (entry) {
      return `${entry.type}: ${entry.description}`
    }
    return null
  }

  const input = module.input()

  return {
    // Get parent container path from method path
    getContainerPath() {
      const methodPath = module.getMethod()
      return methodPath.split('/').slice(0, -1).join('/')
    },

    // Load schemas facet data
    async loadSchemasFacet(containerPath) {
      const fs = await getFs()
      const schemasJsonPath = module.resolve(containerPath, '_schemas/schemas.json')

      if (!schemasJsonPath) {
        return { exists: false }
      }

      try {
        const manifest = JSON.parse(fs.readFileSync(schemasJsonPath, 'utf8'))
        const entries = manifest.entries || []

        // Load field details for each schema if needed
        const requiredLevel = module.requiredLevel()
        const needFields = ['detail', 'debug'].includes(requiredLevel)

        if (needFields) {
          for (const entry of entries) {
            const schemaPath = module.resolve(containerPath, `_schemas/${entry.name}`)
            if (schemaPath) {
              try {
                const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
                entry.fields = schema.fields || []
              } catch (e) {
                entry.fields = []
                entry.parseError = e.message
              }
            }
          }
        }

        return {
          exists: true,
          description: manifest.description,
          entries
        }
      } catch (err) {
        return { exists: false, error: err.message }
      }
    },

    // Output schemas facet at graded levels
    async outputSchemasFacet(data) {
      if (!data.exists) {
        module.gradedOutput({
          topline: 'schemas - not found',
          summary: 'schemas - not found',
          detail: 'schemas - not found',
          debug: 'schemas - not found'
        })
        return
      }

      const entries = data.entries || []
      const names = entries.map(e => e.name).join(', ')

      // Topline: facet + filenames
      const topline = `schemas - ${names || 'empty'}`

      // Summary: entries with descriptions
      let summary = 'schemas:'
      for (const entry of entries) {
        summary += `\n  ${entry.name} - ${entry.description || '(no description)'}`
      }

      // Detail: + field details
      let detail = 'schemas:'
      for (const entry of entries) {
        detail += `\n  ${entry.name} - ${entry.description || '(no description)'}`
        if (entry.fields && entry.fields.length > 0) {
          for (const field of entry.fields) {
            const typeStr = typeof field.type === 'object' ? JSON.stringify(field.type) : field.type
            detail += `\n    ${field.name} (${typeStr})${field.doc ? ' - ' + field.doc : ''}`
          }
        }
      }

      // Debug: + DSL glossary
      let debug = 'schemas:'
      for (const entry of entries) {
        debug += `\n  ${entry.name} - ${entry.description || '(no description)'}`
        if (entry.fields && entry.fields.length > 0) {
          for (const field of entry.fields) {
            const typeStr = typeof field.type === 'object' ? JSON.stringify(field.type) : field.type
            debug += `\n    ${field.name} (${typeStr})`
            if (field.doc) debug += `\n      Doc: ${field.doc}`
            const dsl = await lookupDsl(field.name)
            if (dsl) {
              debug += `\n      DSL: ${dsl}`
            }
          }
        }
      }

      module.gradedOutput({ topline, summary, detail, debug })
    }
  }
}
