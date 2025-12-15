**Type:** plain req
**Version:** 1.0.0
**Implements:** spl_method_type_v1.0.0

# spl_http_post

## Spec

Perform HTTP POST request.

**Input schema:** input.avsc
**Output schema:** output.avsc

### Behavior

1. Validate input (url required)
2. Build fetch request with headers, body, and timeout
3. Set Content-Type header (default: application/json if not specified)
4. Execute POST request
5. Return response with status, headers, body
6. On network error, return ok=false with error message

### Examples

```bash
spl spl/http/post --url=https://api.example.com/users --body='{"name":"test"}'
spl spl/http/post --url=https://api.example.com/users --body='{"name":"test"}' --headers='{"Authorization":"Bearer xxx"}'
spl spl/http/post --url=https://api.example.com/form --body='name=test' --contentType='application/x-www-form-urlencoded'
```

## Self-eval

- [ ] Conforms to spl_method_type structural requirements
- [ ] Input validated against input.avsc
- [ ] Output conforms to output.avsc
- [ ] Handles network errors gracefully
- [ ] Sets default Content-Type for JSON bodies
- [ ] Respects timeout setting
- [ ] Works on both Node and Bare runtimes

## Comments

POST wrapper with automatic JSON Content-Type. Body can be JSON string or form-encoded.
