// selfeval_reqs.js - Selfeval runner for reqs facet
//
// Checks files declared in _reqs/index.json exist,
// and req files are declared in manifest.

export default async function(containerFsPath, module) {
  const fs = await module.require('fs')
  const path = await module.require('path')

  const reqsPath = path.join(containerFsPath, '_reqs')

  // Read reqs manifest
  let manifest
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(reqsPath, 'index.json'), 'utf8'))
  } catch (e) {
    return {
      pass: true,
      topline: 'reqs | SKIP',
      summary: 'No _reqs/index.json',
      files: []
    }
  }

  const declaredFiles = new Set(manifest.files || [])
  const results = []

  // Check manifest → reality (declared files exist)
  for (const fileName of declaredFiles) {
    let exists = false
    try {
      fs.statSync(path.join(reqsPath, fileName))
      exists = true
    } catch (e) {}

    results.push({
      name: fileName,
      pass: exists,
      topline: `${fileName} | ${exists ? 'PASS' : 'FAIL'}`,
      detail: exists ? 'file exists' : 'file missing'
    })
  }

  // Check reality → manifest (actual files are declared)
  try {
    const actualFiles = fs.readdirSync(reqsPath)
      .filter(f => f.endsWith('.md'))

    for (const fileName of actualFiles) {
      if (!declaredFiles.has(fileName)) {
        results.push({
          name: fileName,
          pass: false,
          topline: `${fileName} | FAIL`,
          detail: 'unregistered file'
        })
      }
    }
  } catch (e) {}

  const allPass = results.every(r => r.pass)
  const passCount = results.filter(r => r.pass).length

  return {
    pass: allPass,
    topline: `reqs | ${allPass ? 'PASS' : 'FAIL'}`,
    summary: `${passCount}/${results.length} files`,
    files: results
  }
}
