// spl/introspection/info - Quick introspection queries
//
// CLI equivalent of ai.js helpers: stack(), methods(), etc.
// Simpler than whoami - focused on quick queries.
//
// Flags:
//   --stack              Show type stack (extends chain)
//   --stack=instantiates Show instance chain
//   --methods            List available methods
//   --schemas            List schema files
//   --children           Show allowed children
//
// Examples:
//   spl spl/container/info --stack
//   spl spl/container/info --methods
//   spl spl/container/info --stack=instantiates --methods

export default async function(module) {
  const fs = await module.require('fs')
  const input = module.input()

  // Get target container from method path
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  if (segments[segments.length - 1] !== 'info') {
    module.output('Invalid invocation: method must end with /info', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // Collect results
  const results = {}
  const output = []

  // --stack: show type stack
  if (input.stack !== undefined) {
    const mode = input.stack === true || input.stack === '' ? 'full' : input.stack
    const { stack, instanceLevel } = module.buildTypeStack(targetPath, mode)
    results.stack = { mode, levels: stack, instanceLevel }

    output.push(`stack (${mode}):`)
    stack.forEach((level, i) => {
      const marker = i === instanceLevel ? ' <- instance' : ''
      output.push(`  ${i + 1}. ${level}${marker}`)
    })
  }

  // --methods: list available methods
  if (input.methods) {
    const { stack } = module.buildTypeStack(targetPath, 'instantiates')
    const methods = []
    const seen = new Set()

    for (const typePath of stack) {
      const indexPath = module.resolve(typePath, 'index.json')
      if (!indexPath) continue

      try {
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
        const childList = index.instance?.children?.list || []
        for (const name of childList) {
          if (!seen.has(name)) {
            seen.add(name)
            methods.push({ name, definedAt: typePath })
          }
        }
      } catch (e) {
        // skip invalid json
      }
    }

    results.methods = methods

    if (output.length > 0) output.push('')
    output.push('methods:')
    if (methods.length === 0) {
      output.push('  (none)')
    } else {
      methods.forEach(m => {
        output.push(`  ${m.name} (${m.definedAt})`)
      })
    }
  }

  // --schemas: list schema files
  if (input.schemas) {
    const schemasIndexPath = module.resolve(targetPath, '_schemas/index.json')
    let schemas = null

    if (schemasIndexPath) {
      try {
        const schemasIndex = JSON.parse(fs.readFileSync(schemasIndexPath, 'utf8'))
        schemas = Object.keys(schemasIndex.files || {})
      } catch (e) {
        // skip
      }
    }

    results.schemas = schemas

    if (output.length > 0) output.push('')
    output.push('schemas:')
    if (!schemas || schemas.length === 0) {
      output.push('  (none)')
    } else {
      schemas.forEach(s => output.push(`  ${s}`))
    }
  }

  // --children: show allowed children
  if (input.children) {
    const indexPath = module.resolve(targetPath, 'index.json')
    let children = null

    if (indexPath) {
      try {
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
        children = index.instance?.children || null
      } catch (e) {
        // skip
      }
    }

    results.children = children

    if (output.length > 0) output.push('')
    output.push('children:')
    if (!children) {
      output.push('  (none)')
    } else {
      output.push(`  type: ${children.type}`)
      output.push(`  list: ${children.list?.join(', ') || '(empty)'}`)
    }
  }

  // No flags - show usage
  if (output.length === 0) {
    module.output(
      `Usage: spl ${targetPath}/info <flags>\n\n` +
      'Flags:\n' +
      '  --stack              Type stack (extends chain)\n' +
      '  --stack=instantiates Instance chain\n' +
      '  --methods            Available methods\n' +
      '  --schemas            Schema files\n' +
      '  --children           Allowed children\n\n' +
      'Examples:\n' +
      `  spl ${targetPath}/info --stack --methods\n` +
      `  spl ${targetPath}/info --stack=instantiates`,
      { container: targetPath }
    )
    return
  }

  module.output(output.join('\n'), results)
}
