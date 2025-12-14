// selfeval_container.js - Selfeval runner for container facet validation
//
// Validates index.json against container.avsc schema.
// Required/optional fields derived from schema (fields with defaults are optional).
// No extra fields allowed.
// instantiates must match parent's instanceChildren.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const checks = []

      // Load container schema to get required/optional fields
      const schemaPath = module.resolve('spl/container', '_schemas/container.avsc')
      if (!schemaPath) {
        return {
          pass: false,
          topline: 'container | FAIL',
          summary: 'Cannot find container.avsc schema',
          checks: []
        }
      }

      let schema
      try {
        schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
      } catch (e) {
        return {
          pass: false,
          topline: 'container | FAIL',
          summary: 'Cannot parse container.avsc schema',
          checks: []
        }
      }

      // Extract required/optional fields from schema
      // Fields with 'default' are optional, others are required
      const requiredFields = []
      const optionalFields = []
      for (const field of schema.fields) {
        if ('default' in field) {
          optionalFields.push(field.name)
        } else {
          requiredFields.push(field.name)
        }
      }

      // Read container's index.json
      let identity
      try {
        identity = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: false,
          topline: 'container | FAIL',
          summary: 'Cannot read index.json',
          checks: []
        }
      }

      // Check required fields present
      const presentFields = Object.keys(identity)
      const missingFields = requiredFields.filter(f => !(f in identity))
      const allowedFields = [...requiredFields, ...optionalFields]
      const extraFields = presentFields.filter(f => !allowedFields.includes(f))

      if (missingFields.length > 0) {
        checks.push({
          name: 'required',
          pass: false,
          topline: 'required | FAIL',
          detail: `missing: ${missingFields.join(', ')}`
        })
      } else {
        checks.push({
          name: 'required',
          pass: true,
          topline: 'required | PASS',
          detail: `${requiredFields.length} fields present`
        })
      }

      // Check no extra fields
      if (extraFields.length > 0) {
        checks.push({
          name: 'extra',
          pass: false,
          topline: 'extra | FAIL',
          detail: `unexpected: ${extraFields.join(', ')}`
        })
      } else {
        checks.push({
          name: 'extra',
          pass: true,
          topline: 'extra | PASS',
          detail: 'no extra fields'
        })
      }

      // Validate instantiates against parent's instanceChildren
      const containerName = identity.name
      const segments = containerName.split('/')

      if (segments.length <= 1) {
        // Root container - skip instantiates validation
        checks.push({
          name: 'instantiates',
          pass: true,
          topline: 'instantiates | SKIP',
          detail: 'root container'
        })
      } else {
        // Get parent path
        const parentPath = segments.slice(0, -1).join('/')

        // Resolve parent's index.json
        const parentIndexPath = module.resolve(parentPath, 'index.json')
        if (!parentIndexPath) {
          checks.push({
            name: 'instantiates',
            pass: false,
            topline: 'instantiates | FAIL',
            detail: `parent not found: ${parentPath}`
          })
        } else {
          try {
            const parentIndex = JSON.parse(fs.readFileSync(parentIndexPath, 'utf8'))
            const parentInstanceType = parentIndex.instantiates

            if (!parentInstanceType) {
              checks.push({
                name: 'instantiates',
                pass: false,
                topline: 'instantiates | FAIL',
                detail: `parent has no instantiates`
              })
            } else {
              // Resolve parent's instance type to get instanceChildren
              const instanceTypeIndexPath = module.resolve(parentInstanceType, 'index.json')
              if (!instanceTypeIndexPath) {
                checks.push({
                  name: 'instantiates',
                  pass: false,
                  topline: 'instantiates | FAIL',
                  detail: `parent instance type not found: ${parentInstanceType}`
                })
              } else {
                const instanceTypeIndex = JSON.parse(fs.readFileSync(instanceTypeIndexPath, 'utf8'))
                const expectedInstanceType = instanceTypeIndex.instanceChildren

                if (!expectedInstanceType) {
                  checks.push({
                    name: 'instantiates',
                    pass: false,
                    topline: 'instantiates | FAIL',
                    detail: `${parentInstanceType} has no instanceChildren`
                  })
                } else if (identity.instantiates === expectedInstanceType) {
                  checks.push({
                    name: 'instantiates',
                    pass: true,
                    topline: 'instantiates | PASS',
                    detail: `matches parent: ${expectedInstanceType}`
                  })
                } else {
                  checks.push({
                    name: 'instantiates',
                    pass: false,
                    topline: 'instantiates | FAIL',
                    detail: `expected ${expectedInstanceType}, got ${identity.instantiates}`
                  })
                }
              }
            }
          } catch (e) {
            checks.push({
              name: 'instantiates',
              pass: false,
              topline: 'instantiates | FAIL',
              detail: `error reading parent: ${e.message}`
            })
          }
        }
      }

      const allPass = checks.every(c => c.pass)
      const passCount = checks.filter(c => c.pass).length
      const failedChecks = checks.filter(c => !c.pass)

      // Build summary with failure details
      let summary = `${passCount}/${checks.length} checks`
      if (failedChecks.length > 0) {
        const failureDetails = failedChecks.map(c => c.detail).join('; ')
        summary += ` - ${failureDetails}`
      }

      return {
        pass: allPass,
        topline: `container | ${allPass ? 'PASS' : 'FAIL'}`,
        summary,
        checks
      }
    }
  }
}
