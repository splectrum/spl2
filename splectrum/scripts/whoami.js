// whoami prototype script
// Usage: spl ./splectrum/scripts/whoami.js --container=spl/container

const input = spl.input()
const container = input.container || 'spl/container'
const nodeRoot = record.headers.spl.runtime.nodeRoot
const modulePath = `${nodeRoot}/apps/cli-static/modules/work_module/${container}/README.json`

const fs = requireNonSpl('fs')

let text = ''

try {
  const content = fs.readFileSync(modulePath, 'utf8')
  const readme = JSON.parse(content)

  // Derive type from key (api, method, package, etc.)
  const typeKeys = ['api', 'method', 'package', 'module', 'modules']
  const type = typeKeys.find(k => k in readme) || 'unknown'

  text += `Container: ${container}\n`
  text += `Type: ${type}\n`
  text += `Purpose: ${readme.purpose || '(none)'}\n`

  // If API with facets, show them
  if (type === 'api' && readme.api && Object.keys(readme.api).length > 0) {
    text += `\nAPI Facets:\n`
    for (const [facet, methods] of Object.entries(readme.api)) {
      text += `  ${facet}: ${methods.join(', ')}\n`
    }
  }

} catch (err) {
  text = `Error: ${err.message}\n`
}

spl.output(text, null)
