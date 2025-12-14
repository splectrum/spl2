// spl/container/update - Update container to fix drift
//
// Operations:
// 1. Container facet fix - Fix index.json to match container.avsc schema
// 2. Schema inheritance merge - Propagate parent schema fields to derived schemas
//
// Invocation: spl spl/container/test/update
//
// Flags:
//   --dryRun    Show what would be changed without doing it

export default async function(module) {
  const fs = await module.require('fs')
  const path = await module.require('path')

  const input = module.input()
  const dryRun = input.dryRun || false

  // Get the method path - this tells us what container to update
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  if (segments[segments.length - 1] !== 'update') {
    module.output('Invalid invocation: method must end with /update', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // Resolve target container's index.json
  const targetIndexPath = module.resolve(targetPath, 'index.json')
  if (!targetIndexPath) {
    module.output(`Container not found: ${targetPath}`, { error: 'container_not_found', targetPath })
    return
  }

  const changes = []
  let targetIndex
  try {
    targetIndex = JSON.parse(fs.readFileSync(targetIndexPath, 'utf8'))
  } catch (e) {
    module.output(`Cannot read index.json: ${e.message}`, { error: 'read_error' })
    return
  }

  // --- Operation 1: Container facet fix ---
  const containerChanges = await fixContainerFacet(module, fs, targetPath, targetIndex, targetIndexPath, dryRun)
  changes.push(...containerChanges)

  // --- Operation 2: Schema inheritance merge ---
  const schemaChanges = await mergeSchemaInheritance(module, fs, path, targetPath, dryRun)
  changes.push(...schemaChanges)

  // Output results
  if (changes.length === 0) {
    module.output(`${targetPath} | up to date`, { status: 'up_to_date', targetPath })
  } else {
    const applied = dryRun ? 'would apply' : 'applied'
    module.output(
      `${targetPath} | ${changes.length} changes ${applied}\n${changes.map(c => `  ${c}`).join('\n')}`,
      { status: dryRun ? 'dry_run' : 'updated', targetPath, changes }
    )
  }
}

// Fix index.json to match container.avsc schema
async function fixContainerFacet(module, fs, targetPath, targetIndex, targetIndexPath, dryRun) {
  const changes = []

  // Load container schema
  const schemaPath = module.resolve('spl/container', '_schemas/container.avsc')
  if (!schemaPath) {
    return ['container: cannot find container.avsc schema']
  }

  let schema
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
  } catch (e) {
    return ['container: cannot parse container.avsc schema']
  }

  // Build allowed fields and defaults from schema
  const allowedFields = []
  const defaults = {}
  for (const field of schema.fields) {
    allowedFields.push(field.name)
    if ('default' in field) {
      defaults[field.name] = field.default
    }
  }

  // Find extra fields to remove
  const presentFields = Object.keys(targetIndex)
  const extraFields = presentFields.filter(f => !allowedFields.includes(f))

  // Find missing required fields (no default in schema)
  const missingFields = allowedFields.filter(f => !(f in targetIndex) && !(f in defaults))

  // Build new index
  const newIndex = {}
  for (const field of allowedFields) {
    if (field in targetIndex) {
      newIndex[field] = targetIndex[field]
    } else if (field in defaults) {
      newIndex[field] = defaults[field]
    }
  }

  // Check if anything changed
  const oldJson = JSON.stringify(targetIndex, null, 2)
  const newJson = JSON.stringify(newIndex, null, 2)

  if (oldJson === newJson) {
    return []
  }

  // Record changes
  if (extraFields.length > 0) {
    changes.push(`container: removed fields: ${extraFields.join(', ')}`)
  }
  if (missingFields.length > 0) {
    changes.push(`container: added required fields: ${missingFields.join(', ')}`)
  }

  // Apply changes
  if (!dryRun) {
    fs.writeFileSync(targetIndexPath, newJson + '\n', 'utf8')
  }

  return changes
}

// Merge parent schema fields into child schemas
async function mergeSchemaInheritance(module, fs, path, targetPath, dryRun) {
  const changes = []

  // Get target's schemas directory
  const targetSchemasPath = module.resolve(targetPath, '_schemas/index.json')
  if (!targetSchemasPath) {
    return [] // No schemas to merge
  }

  const targetSchemasDir = path.dirname(targetSchemasPath)
  let schemasIndex
  try {
    schemasIndex = JSON.parse(fs.readFileSync(targetSchemasPath, 'utf8'))
  } catch (e) {
    return []
  }

  // Build type stack (same as whoami/selfeval use)
  const typeStack = module.buildTypeStack(targetPath)
  if (!typeStack || typeStack.stack.length <= 1) {
    return [] // No parent types in stack
  }

  // Get parent type from stack (skip first element which is self)
  const parentPath = typeStack.stack[1]

  // Process each schema file
  const filesField = schemasIndex.files || {}
  const schemaFiles = Array.isArray(filesField) ? filesField : Object.keys(filesField)
  for (const schemaFile of schemaFiles) {
    // Find parent schema with same name
    const parentSchemaPath = module.resolve(parentPath, `_schemas/${schemaFile}`)
    if (!parentSchemaPath) {
      continue // No parent schema to inherit from
    }

    const childSchemaPath = path.join(targetSchemasDir, schemaFile)
    if (!fs.existsSync(childSchemaPath)) {
      continue
    }

    let parentSchema, childSchema
    try {
      parentSchema = JSON.parse(fs.readFileSync(parentSchemaPath, 'utf8'))
      childSchema = JSON.parse(fs.readFileSync(childSchemaPath, 'utf8'))
    } catch (e) {
      continue
    }

    // Merge parent fields into child
    const mergeResult = mergeSchemaFields(parentSchema, childSchema)
    if (!mergeResult.changed) {
      continue
    }

    changes.push(`schemas: ${schemaFile} - ${mergeResult.description}`)

    if (!dryRun) {
      fs.writeFileSync(childSchemaPath, JSON.stringify(mergeResult.schema, null, 2) + '\n', 'utf8')
    }
  }

  return changes
}

// Merge parent fields into child schema
function mergeSchemaFields(parentSchema, childSchema) {
  const parentFields = parentSchema.fields || []
  const childFields = childSchema.fields || []

  // Build child field map
  const childFieldMap = {}
  for (const field of childFields) {
    childFieldMap[field.name] = field
  }

  // Track changes
  const added = []
  const updated = []

  // Process parent fields
  const newFields = []
  for (const parentField of parentFields) {
    const childField = childFieldMap[parentField.name]

    if (!childField) {
      // Add missing field
      newFields.push({ ...parentField })
      added.push(parentField.name)
    } else {
      // Check for drift and fix
      let fieldUpdated = false
      const mergedField = { ...childField }

      // Fix type if different
      if (JSON.stringify(parentField.type) !== JSON.stringify(childField.type)) {
        mergedField.type = parentField.type
        fieldUpdated = true
      }

      // Fix default if different
      if (JSON.stringify(parentField.default) !== JSON.stringify(childField.default)) {
        if ('default' in parentField) {
          mergedField.default = parentField.default
        } else {
          delete mergedField.default
        }
        fieldUpdated = true
      }

      // Fix doc if different
      if (parentField.doc !== childField.doc) {
        if (parentField.doc) {
          mergedField.doc = parentField.doc
        } else {
          delete mergedField.doc
        }
        fieldUpdated = true
      }

      newFields.push(mergedField)
      if (fieldUpdated) {
        updated.push(parentField.name)
      }

      delete childFieldMap[parentField.name]
    }
  }

  // Add remaining child-specific fields
  for (const childField of childFields) {
    if (childFieldMap[childField.name]) {
      newFields.push(childField)
    }
  }

  if (added.length === 0 && updated.length === 0) {
    return { changed: false }
  }

  const description = []
  if (added.length > 0) description.push(`added: ${added.join(', ')}`)
  if (updated.length > 0) description.push(`updated: ${updated.join(', ')}`)

  return {
    changed: true,
    description: description.join('; '),
    schema: {
      ...childSchema,
      fields: newFields
    }
  }
}
