// spl/container/whoami - Returns type and description of a container
// Implements: spl/method

export default async function(record, requireSpl) {
  const spl = await requireSpl('lib/spl')

  const input = spl.input()
  const path = input?.path

  // Resolve container path (default to current context)
  const containerPath = path || spl.context()?.path

  // Read README.json from container
  const readme = await spl.readJson(`${containerPath}/README.json`)

  if (!readme) {
    spl.output({
      type: 'unknown',
      purpose: null
    })
    return spl.complete()
  }

  // Derive type from key (api, method, package, etc.)
  const typeKeys = ['api', 'method', 'package', 'module', 'modules', 'container']
  const type = typeKeys.find(k => k in readme) || 'container'

  spl.output({
    type,
    purpose: readme.purpose || null
  })

  return spl.complete()
}
