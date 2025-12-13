**Type:** plain req
**Version:** 1.0.0
**Implements:** spl_api_type_v1.0.0

# spl_http

## Spec

HTTP client API for making web requests. Wraps native fetch with spl interface.

**Purpose:**
Provide HTTP request capabilities within splectrum. Foundation for REST API integrations.

**API:**

| Facet | Methods | Purpose |
|-------|---------|---------|
| request | get, post | HTTP request methods |

**Methods:**

### spl/http/get

Perform HTTP GET request.

**Input:**
- `url` (string, required) - Target URL
- `headers` (object, optional) - Request headers
- `timeout` (number, optional) - Timeout in ms (default: 30000)

**Output:**
- `status` (number) - HTTP status code
- `statusText` (string) - HTTP status message
- `headers` (object) - Response headers
- `body` (string) - Response body as text
- `json` (object|null) - Parsed JSON if content-type is application/json

### spl/http/post

Perform HTTP POST request.

**Input:**
- `url` (string, required) - Target URL
- `body` (string|object, optional) - Request body (object auto-serialized to JSON)
- `headers` (object, optional) - Request headers
- `contentType` (string, optional) - Content-Type header (default: application/json for object body)
- `timeout` (number, optional) - Timeout in ms (default: 30000)

**Output:**
Same as get.

## Design Notes

**Simple start, vision-compatible:**
- Current: direct input → execute → output
- Future: state-building methods (url, header, body setters)
- Future: batch/pipeline support
- Future: additional HTTP methods (put, patch, delete, head, options)

**Platform compatibility:**
- Uses native fetch (available in Node 18+ and Bare)
- Falls back to http module if fetch unavailable

**Error handling:**
- Network errors return `{ ok: false, error: "message" }`
- HTTP errors (4xx, 5xx) return normally with status code

## Self-eval

- [ ] Conforms to spl_api_type structural requirements
- [ ] Methods get, post present and functional
- [ ] Works on both Node and Bare runtimes
- [ ] Handles JSON content-type automatically
- [ ] Timeout enforced
- [ ] Returns structured response with status, headers, body

## Comments

Starting with get/post covers most use cases. Additional HTTP methods can be added following the same pattern. The response structure is designed to support future extraction methods (status, headers, json as separate calls).
