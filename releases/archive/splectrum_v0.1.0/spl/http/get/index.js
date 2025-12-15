// spl/http/get - HTTP GET request
//
// Input:
//   --url      Target URL (required)
//   --headers  Request headers as JSON object
//   --timeout  Timeout in ms (default: 30000)
//
// Output:
//   ok, status, statusText, headers, body, error

export default async function(module) {
  const input = module.input()

  // Validate required url
  if (!input.url) {
    module.output('Missing required parameter: --url', {
      ok: false,
      error: 'Missing required parameter: url'
    })
    return
  }

  const url = input.url
  const timeout = input.timeout || 30000
  const headers = input.headers || {}

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // Convert headers to plain object
    const responseHeaders = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Read body as text
    const body = await response.text()

    const result = {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body
    }

    // Build freetext output
    const freetext = `${response.status} ${response.statusText} | ${url}`

    module.output(freetext, result)

  } catch (err) {
    const errorMsg = err.name === 'AbortError'
      ? `Request timeout after ${timeout}ms`
      : err.message

    module.output(`Error: ${errorMsg}`, {
      ok: false,
      error: errorMsg
    })
  }
}
