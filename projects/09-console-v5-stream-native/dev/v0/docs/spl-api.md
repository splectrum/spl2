# SPL API (createSpl)

The `createSpl` wrapper provides a clean interface to the event record.

## Import

```javascript
import { createSpl } from 'lib/core.js'
```

## Usage

```javascript
export function handle(record) {
  const spl = createSpl(record)

  // Access headers
  const message = spl.headers.pr09.console.hello.message

  // Mark complete
  spl.complete()
}
```

## Properties

### spl.headers

Direct access to `record.headers`. Namespaced by API path.

```javascript
// Structure
spl.headers = {
  spl: {
    runtime: { /* cross-cutting state */ },
    request: { guid, completed, ttl, uri }
  },
  pr09: {
    console: {
      hello: { /* method input */ }
    }
  }
}
```

### spl.value

Direct access to `record.value`. The data payload (if any).

```javascript
// For methods that receive data
const data = spl.value
```

## Methods

### spl.complete()

Mark the request as completed (happy path).

```javascript
spl.complete()
// Sets: record.headers.spl.request.completed = true
```

### spl.error(message)

Mark the request as failed with error.

```javascript
spl.error('Something went wrong')
// Sets error state on record
```

## Extending for Methods

Method-level libs extend the base:

```javascript
// lib/pr09/console/hello.js
import { createSpl } from 'lib/core.js'

export function createHello(record) {
  const spl = createSpl(record)
  const input = spl.headers.pr09.console.hello

  return {
    ...spl,
    greet() {
      console.log(input.message)
    }
  }
}
```

Usage in method:

```javascript
import { createHello } from 'lib/pr09/console/hello.js'

export function handle(record) {
  const hello = createHello(record)
  hello.greet()
  hello.complete()
}
```

## Pattern Benefits

- **index.js stays clean** - Pure flow/intent
- **Libs hide implementation** - Details in _lib/
- **Method vocabulary emerges** - Function names become the method's API
- **Composition** - Method libs build on core

---

**Version:** 1.0.0
