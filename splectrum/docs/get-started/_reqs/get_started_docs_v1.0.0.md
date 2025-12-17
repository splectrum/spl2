**Type:** plain req
**Version:** 1.0.0

# get_started_docs

## Spec

Data folder for the splectrum node get-started script.

**Ownership:**
- Owner: `scripts/get-started.js`
- Location: `docs/get-started/`

**Purpose:**
- AI-first command reference documentation
- Structured JSON topics rendered by get-started script
- Data-driven: add topics without script changes

**Contents:**
- `intro.json` - Default topic, lists available topics
- `<topic>.json` - Topic-specific documentation
- `_reqs/` - Requirements for this folder

**Invocation:**
```bash
spl get-started [topic] [--human]
```

**Flow:**
```
User invokes get-started
  → Script reads docs/get-started/<topic>.json
  → Returns JSON (default) or renders freetext (--human)
```

## Self-eval

- [ ] Folder exists at docs/get-started/
- [ ] Contains intro.json with topics list
- [ ] Script reads from this location
- [ ] Topics listed in intro.json have corresponding .json files

## Comments

Data/code separation - script logic in scripts/, data in docs/. Enables topic updates without touching script.
