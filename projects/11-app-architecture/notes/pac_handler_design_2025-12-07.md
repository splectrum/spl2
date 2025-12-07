# PAC Handler Design

**Date:** 2025-12-07
**Status:** Design proposal

## Background

In spl1, execution handling was internal - PAC logic embedded in methods. Through the free scripting discussion in spl2, we opened up the design: PAC becomes a handler-level concern, not a method concern.

## Universal Method Flags

Methods implement two flags:

### `--dry-run`
- Executes logic but suppresses actual action
- Returns preview of what would happen
- Method always produces narrative describing the action

### `--silent`
- Omits narrative from metaoutput
- Returns only data output
- Useful for scripting, automation, and resubmission after confirmation

Combinations:
| Flags | Behavior |
|-------|----------|
| (none) | Execute action, include narrative |
| `--dry-run` | Preview only, include narrative |
| `--silent` | Execute action, no narrative |
| `--dry-run --silent` | Preview only, no narrative (data check) |

## PAC at Handler Level

`--pac` is not a method flag - it's a signal to the handler layer.

### Flow

```
User: spl spl/container/create --name=foo --pac
                    ↓
App handler sees --pac
  → Runs method with --dry-run
                    ↓
Method returns preview (what would happen)
                    ↓
Result to outbox with --pac context
                    ↓
Outbox handler sees --pac, prompts for confirmation
  - CLI handler: terminal prompt [y/n]
  - Browser handler: dialog/modal
  - AI agent handler: agent decides within bounds
                    ↓
On confirm: handler re-submits with --silent (no --dry-run)
                    ↓
Method executes for real, returns data only
```

### Handler Responsibilities

The handler orchestrates:
1. Intercept `--pac` flag
2. Transform to `--dry-run` for first pass
3. Present preview to user (handler-specific UX)
4. Get confirmation (interactive, AI, auto-approve policy)
5. Re-submit with `--silent` on confirmation

### Handler Implementations

Different handlers can implement different PAC UX:

| Handler | Confirmation Method |
|---------|---------------------|
| CLI (terminal) | Interactive prompt |
| Browser | Dialog/modal UI |
| AI agent session | Agent autonomous decision |
| API/scripting | Auto-approve or policy-based |

## Design Benefits

1. **Methods stay pure**: Just implement `--dry-run` and `--silent`
2. **Handler is pluggable**: Same method works across all contexts
3. **Separation of concerns**: Action logic vs UX logic
4. **AI-ready**: Agent can run PAC-aware handler, confirm within bounds
5. **Scripting-friendly**: `--silent` gives clean data output

## spl1 vs spl2 Comparison

| Aspect | spl1 | spl2 |
|--------|------|------|
| PAC logic | Internal to methods | Handler-level |
| Confirmation | Embedded | Pluggable handlers |
| Execution | Single path | Handler orchestrates |
| Flexibility | Limited | Full separation |

## Implementation Notes

### Method Implementation

```js
export default async function(module) {
  const input = module.input()
  const dryRun = input.dryRun || false
  const silent = input.silent || false

  // Build action description
  const preview = `Would create container: ${input.name}`

  if (!dryRun) {
    // Actually perform the action
    await createContainer(input.name)
  }

  if (silent) {
    module.output(null, { created: !dryRun, name: input.name })
  } else {
    module.output(preview, { created: !dryRun, name: input.name })
  }
}
```

### Handler Implementation (CLI)

```js
// In outbox handler
if (result.pac) {
  console.log(result.metaoutput)  // Preview
  const confirmed = await prompt('Proceed? [y/n]')
  if (confirmed) {
    // Re-submit without --dry-run, with --silent
    submitToInbox({
      ...originalRequest,
      input: { ...input, dryRun: false, silent: true }
    })
  }
}
```

## Open Questions

1. Where does `--pac` flag live in record? `request.pac` or `input.pac`?
2. How does outbox handler know original request for re-submission?
3. Should there be a timeout on confirmation prompts?
4. Can PAC be nested (confirm within confirm)?
