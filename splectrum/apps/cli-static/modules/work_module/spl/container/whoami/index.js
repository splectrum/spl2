// spl/container/whoami - Returns type and description of a container
// Instantiates: spl/method

import fs from 'fs'

export default async function(record, requireSpl, resolveSpl) {
  const spl = await requireSpl('lib/spl', record)

  // Get parent container path from method path
  const methodPath = record.headers.spl.request.method
  const containerPath = methodPath.split('/').slice(0, -1).join('/')

  // Resolve README.json through overlay
  const readmePath = resolveSpl(containerPath, 'README.json')

  if (!readmePath) {
    spl.output(`Container not found: ${containerPath}`, null)
    return
  }

  let text = ''

  try {
    const content = fs.readFileSync(readmePath, 'utf8')
    const readme = JSON.parse(content)

    // Derive type from key (api, method, package, module, modules)
    const typeKeys = ['api', 'method', 'package', 'module', 'modules']
    const type = typeKeys.find(k => k in readme) || 'unknown'

    text += `Container: ${containerPath}\n`
    text += `Type: ${type}\n`
    text += `Purpose: ${readme.purpose || '(none)'}\n`

    if (readme.instantiates) {
      text += `Instantiates: ${readme.instantiates}\n`
    }
    if (readme.extends) {
      text += `Extends: ${readme.extends}\n`
    }

    // If API with facets, show them
    if (type === 'api' && readme.api && Object.keys(readme.api).length > 0) {
      text += `\nAPI Facets:\n`
      for (const [facet, methods] of Object.entries(readme.api)) {
        text += `  ${facet}: ${methods.join(', ')}\n`
      }
    }

  } catch (err) {
    text = `Error reading ${containerPath}: ${err.message}\n`
  }

  spl.output(text, null)
}
