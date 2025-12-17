**Type:** plain req
**Version:** 1.0.0

# topic_structure

## Spec

JSON structure for get-started topics. Adding or updating topics requires no script changes.

**Adding a topic:**
1. Create `docs/get-started/<topic>.json`
2. Add entry to `intro.json` topics array
3. Done - script auto-discovers

**Topic JSON structure:**

```json
{
  "title": "Topic Title",
  "description": "Brief description of the topic.",
  "sections": [
    {
      "name": "Section Name",
      "description": "Optional section description",
      "commands": [
        { "command": "spl example/command", "description": "What it does" }
      ],
      "options": [
        { "flag": "--flagName", "description": "What it controls" }
      ],
      "functions": [
        { "name": "functionName", "description": "What it does" }
      ]
    }
  ]
}
```

**Intro topic structure:**

```json
{
  "title": "SPL Quick Reference",
  "description": "Welcome message",
  "topics": [
    { "name": "topicname", "description": "Brief description" }
  ],
  "examples": [
    { "command": "spl example", "description": "What it shows" }
  ]
}
```

**Supported elements:**
- `title` - Topic title (rendered with = underline)
- `description` - Topic description
- `topics` - List of available topics (intro only)
- `examples` - Example commands
- `sections` - Named sections (rendered with - underline)
- `commands` - Command examples within sections
- `options` - Flag options within sections
- `functions` - Function references within sections

**Rendering:**
- JSON default (AI-first)
- `--human` flag renders via freetext.js helper

## Self-eval

- [ ] New .json file in docs/get-started/ is auto-discovered
- [ ] Topic listed in intro.json topics array appears in `spl get-started`
- [ ] All structure elements render correctly with --human

## Comments

Extensible by design. Add new section element types to freetext.js if needed, but current set covers most documentation patterns.
