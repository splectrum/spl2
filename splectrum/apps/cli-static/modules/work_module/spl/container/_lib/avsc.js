// avsc.js - Avro schema parsing and validation
//
// Exports:
//   parseSchema(schemaPath)  - load and validate Avro schema file
//   validate(type, value)    - validate value against parsed schema

export function create(module) {
  let _avsc = null
  let _fs = null

  return {
    // Parse schema file, return type or error
    async parseSchema(schemaPath) {
      try {
        if (!_avsc) _avsc = await module.require('avsc')
        if (!_fs) _fs = await module.require('fs')

        const content = _fs.readFileSync(schemaPath, 'utf8')
        const schema = JSON.parse(content)
        const type = _avsc.Type.forSchema(schema)
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
    }
  }
}
