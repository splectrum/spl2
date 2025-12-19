**Type:** plain req
**Version:** 1.0.0

# execute_lib

## Spec

CLI Static execute helpers. Provides inbox/outbox execution pattern and user interaction.

**File:** `_lib/execute.js`

**Pattern:** `create(module)` returns object with methods.

### Exports

| Function | Signature | Description |
|----------|-----------|-------------|
| `executeAndWait` | `(inboxDir, outboxDir)` | FAF to inbox, watch outbox, return response |
| `promptConfirm` | `(message)` | Prompt user for y/n confirmation |
| `buildPaths` | `(nodeRoot, sessionConfig)` | Build inbox/outbox paths from config |

### executeAndWait(inboxDir, outboxDir)

Core execution pattern for CLI Static app:

1. Start watching outbox for new .json files
2. FAF current record to inbox (sync mode)
3. Wait for response in outbox
4. Read, parse, and consume (delete) response file
5. Return parsed record

**Behavior:**
- Uses `fs.watch` for outbox monitoring
- Filters for 'rename' events on .json files
- Consumes (deletes) response after reading
- Returns Promise resolving to response record

### promptConfirm(message)

Interactive user confirmation prompt.

- Displays message to stdout
- Reads single line from stdin
- Returns `true` for 'y' or 'yes' (case insensitive)
- Returns `false` for any other input

### buildPaths(nodeRoot, sessionConfig)

Builds inbox/outbox directory paths from session configuration.

**Input:**
- `nodeRoot` - Filesystem root path
- `sessionConfig` - Object with `root` property (session folder)

**Returns:**
```javascript
{
  inboxDir: path.join(nodeRoot, sessionConfig.root, 'inbox'),
  outboxDir: path.join(nodeRoot, sessionConfig.root, 'outbox')
}
```

## Self-eval

- [ ] File exists at `_lib/execute.js`
- [ ] Exports `create(module)` function
- [ ] executeAndWait FAFs to inbox and waits for outbox response
- [ ] executeAndWait consumes (deletes) response file
- [ ] promptConfirm returns boolean based on user input
- [ ] buildPaths correctly joins paths with session root

## Comments

This lib encapsulates the CLI Static app's inbox/outbox execution pattern. The handler remains a clean orchestrator while the lib handles filesystem operations and user interaction.

Used by spl/cli-static/execute for both direct execution and PAC (preview-approve-commit) flows.
