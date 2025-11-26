# spl/request API v1.0.0

Request lifecycle API tracking request completion state.

## Purpose

Tracks the lifecycle of a request through the system. Provides completion signaling and hop limiting.

## Properties (metastate)

### completed
- **Type:** boolean
- **Required:** yes
- **Default:** false
- **Description:** Whether the request has been completed. Set to true by calling spl.complete() or spl.error(). Once true, the request is considered finished.
- **Constraints:** Once set to true, must not be set back to false.

### ttl
- **Type:** int
- **Required:** yes
- **Default:** 10
- **Description:** Time-to-live counter. Remaining hops before the request expires. Decremented on each routing step. When ttl reaches 0, the request should not be forwarded further.
- **Constraints:** Must be >= 0. Must not be incremented (only decremented or unchanged).

## Initialization

Set by the runner before method invocation:
1. completed = false
2. ttl = 10 (default, configurable)

## Lifecycle

1. Request created with completed=false, ttl=N
2. On each routing hop, ttl decremented
3. If ttl reaches 0, request expires (not forwarded)
4. Method calls spl.complete() or spl.error() to set completed=true
5. Once completed=true, request is finished

## Usage

Methods signal completion via the spl wrapper:
```javascript
const spl = createSpl(record)

// On success
spl.complete()  // sets request.completed = true

// On error
spl.error('message')  // sets runtime.error and request.completed = true
```

## Design Notes

- completed is the authoritative signal that processing is done
- ttl prevents infinite routing loops
- Error details stored in spl.runtime.error (separate from request state)

## Selfevals

### SE-1: completed initialized to false
Verify that a new request has completed=false.

### SE-2: ttl initialized to positive value
Verify that a new request has ttl > 0.

### SE-3: spl.complete() sets completed to true
Verify that calling spl.complete() sets request.completed=true.

### SE-4: spl.error() sets completed to true
Verify that calling spl.error(message) sets request.completed=true.

### SE-5: completed is immutable once true
Verify that once completed=true, it cannot be changed back to false.

### SE-6: ttl only decrements
Verify that ttl can only be decremented or unchanged, never incremented.
