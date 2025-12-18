// avsc.js - Avro schema parsing and validation
//
// Exports:
//   parseSchema(schemaPath)  - load and validate Avro schema file
//   validate(type, value)    - validate value against parsed schema

import avsc from 'avsc'
import fs from 'fs'

export function create(module) {
  return {
    // Parse schema file, return type or error
    async parseSchema(schemaPath) {
      try {
        const content = fs.readFileSync(schemaPath, 'utf8')
        const schema = JSON.parse(content)
        const type = avsc.Type.forSchema(schema)
        return { ok: true, type }
      } catch (error) {
        return { ok: false, error: error.message }
      }
    },

    // Validate value against type, return null or errors
    validate(type, value) {
      const errors = []

      const valid = type.isValid(value, {
        errorHook: (path, val, type) => {
          errors.push({
            path: path.join('.'),
            value: val,
            expected: type.toString()
          })
        }
      })

      return valid ? null : errors
    },

    // Compare schemas for inheritance validation (field-by-field)
    compareSchemas(parentSchema, childSchema) {
      const parentFields = parentSchema.fields || []
      const childFields = childSchema.fields || []

      const childFieldMap = {}
      for (const field of childFields) {
        childFieldMap[field.name] = field
      }

      const missing = []
      const typeMismatch = []
      const metadataDrift = []

      for (const parentField of parentFields) {
        const childField = childFieldMap[parentField.name]

        if (!childField) {
          missing.push(parentField.name)
          continue
        }

        // Compare types (stringify for comparison)
        const parentType = JSON.stringify(parentField.type)
        const childType = JSON.stringify(childField.type)
        if (parentType !== childType) {
          typeMismatch.push({
            field: parentField.name,
            parent: parentField.type,
            child: childField.type
          })
        }

        // Compare defaults
        if (JSON.stringify(parentField.default) !== JSON.stringify(childField.default)) {
          metadataDrift.push({
            field: parentField.name,
            key: 'default',
            parent: parentField.default,
            child: childField.default
          })
        }

        // Compare docs
        if (parentField.doc !== childField.doc) {
          metadataDrift.push({
            field: parentField.name,
            key: 'doc',
            parent: parentField.doc,
            child: childField.doc
          })
        }
      }

      if (missing.length === 0 && typeMismatch.length === 0 && metadataDrift.length === 0) {
        return { compatible: true }
      }

      return {
        compatible: false,
        missing: missing.length > 0 ? missing : undefined,
        typeMismatch: typeMismatch.length > 0 ? typeMismatch : undefined,
        metadataDrift: metadataDrift.length > 0 ? metadataDrift : undefined
      }
    }
  }
}
