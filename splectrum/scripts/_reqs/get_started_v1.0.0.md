**Type:** plain req
**Version:** 1.0.0

# get_started

## Spec

AI-first command reference for SPL. Quick lookup of commands, patterns, and usage.

**Invocation:**
```bash
spl get-started [topic] [--human]
```

**Behavior:**
- Default output: JSON (AI-first)
- `--human` flag: Rendered freetext for humans

**Topics:**
- `intro` (default) - Overview and topic list
- `introspection` - whoami, info commands
- `validation` - selfeval, selfeval-all commands
- `crud` - create, update, lift, delete commands
- `scripts` - Inline scripts, ai.js helpers

**Data source:**
Topic content in `docs/get-started/*.json`. Structured JSON with title, description, sections, commands.

**Rendering:**
Uses `lib/spl/script/freetext.js` helper for human-readable output.

**Design:**
- AI-first: JSON by default, humans opt-in with --human
- Structured data source enables both outputs from same content
- Topics extensible by adding JSON files

## Self-eval

- [ ] `spl get-started` returns JSON
- [ ] `spl get-started --human` returns freetext
- [ ] Topics: intro, introspection, validation, crud, scripts
- [ ] Unknown topic returns error with available topics

## Comments

Established fixture for command reference. Data lives in docs/get-started/*.json.
