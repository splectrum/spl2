**Type:** plain req
**Version:** 1.0.0
**Implements:** spl_method_type_v1.0.0

# spl_http_get

## Spec

Perform HTTP GET request.

**Input schema:** input.avsc
**Output schema:** output.avsc

### Behavior

1. Validate input (url required)
2. Build fetch request with headers and timeout
3. Execute GET request
4. Return response with status, headers, body
5. On network error, return ok=false with error message

### Examples

```bash
spl spl/http/get --url=https://api.example.com/users
spl spl/http/get --url=https://api.example.com/users --headers='{"Authorization":"Bearer xxx"}'
spl spl/http/get --url=https://api.example.com/users --timeout=5000
```

## Self-eval

- [ ] Conforms to spl_method_type structural requirements
- [ ] Input validated against input.avsc
- [ ] Output conforms to output.avsc
- [ ] Handles network errors gracefully
- [ ] Respects timeout setting
- [ ] Works on both Node and Bare runtimes

## Comments

Simple GET wrapper. Foundation for more complex HTTP operations.
