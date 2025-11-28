# cli-static

**Status:** POC (Proof of Concept)

Default CLI app for terminal sessions without a specific terminal ID.

## Structure

```
cli-static/
├── index.js         # App entry point
├── scripts/         # POC implementation scripts
│   └── faf.js       # Fire and forget write
├── requests/        # Request/response records
├── config/          # App configuration
├── state/           # Persistent app state
├── session/         # Session context (TODO)
└── channel/         # External communication
```

## Routing

Requests routed here when:
- No terminal ID provided
- Terminal ID is explicitly `cli-static`

## Current Flow (POC)

1. Entry point builds request record
2. App receives request record (FAF boundary)
3. FAF writes request to `requests/<timestamp>.json`
4. Echo response (session processing TODO)

## Request Storage

- `<timestamp>.json` - request received
- `<timestamp>.response.json` - response sent (TODO)

Same timestamp = same request lifecycle.
