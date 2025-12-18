**Type:** plain req
**Version:** 1.0.0

# doc_lib

## Spec

Generic doc-style JSON renderer. Converts structured JSON (title, description, sections, commands) to freetext output.

**Purpose:**
- Render structured documentation JSON to human-readable text
- Complement to ai.js - doc.js for output, ai.js for exploration
- Used by scripts like get-started for --human output

**Usage:**
```javascript
const doc = await module.require("lib/spl/script/doc.js")
console.log(doc.render(data))
```

**Supported structure:**
```json
{
  "title": "Section Title",
  "description": "Section description",
  "topics": [{ "name": "topic", "description": "desc" }],
  "examples": [{ "command": "cmd", "description": "desc" }],
  "sections": [{
    "name": "Section",
    "description": "desc",
    "commands": [{ "command": "cmd", "description": "desc" }],
    "options": [{ "flag": "--flag", "description": "desc" }],
    "functions": [{ "name": "fn", "description": "desc" }]
  }]
}
```

**Output format:**
```
Title
=====
Description

Topics:
  topic - desc

Examples:
  cmd
    desc

Section
-------
desc
  cmd
    desc
```

**Design:**
- Generic renderer - no domain knowledge required
- Walks JSON structure recursively
- Handles title, description, topics, examples, sections
- Sections can contain commands, options, functions

## Self-eval

- [ ] `doc.render(data)` returns freetext string
- [ ] Title rendered with `=` underline
- [ ] Section names rendered with `-` underline
- [ ] Commands/options/functions indented with descriptions

## Comments

Companion to ai.js. Together they provide:
- ai.js: exploration helpers (stack, methods, readJson, etc.)
- doc.js: output rendering (structured JSON to text)
