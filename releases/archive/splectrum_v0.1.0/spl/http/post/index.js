// spl/http/post - HTTP POST request
//
// Input:
//   --url         Target URL (required)
//   --body        Request body (string or JSON)
//   --headers     Request headers as JSON object
//   --contentType Content-Type header (default: application/json)
//   --timeout     Timeout in ms (default: 30000)
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
  const contentType = input.contentType || 'application/json'

  // Build headers
  const headers = {
    'Content-Type': contentType,
    ...(input.headers || {})
  }

  // Handle body - if object passed via JSON, it's already parsed
  let body = input.body
  if (body && typeof body === 'object') {
    body = JSON.stringify(body)
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // Convert headers to plain object
    const responseHeaders = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Read body as text
    const responseBody = await response.text()

    const result = {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody
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
