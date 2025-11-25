# Practical Patterns - Dev Environment

**Context:** Working patterns discovered during v0 model dev env creation
**Status:** Active how-to patterns (not yet centrally registered)

---

## Req File Naming & Versioning

### Pattern: Dual Naming Strategy

**External (project root, stepping stones register):**
- **Filename format:** `term name_v1.0.0.md` (with version)
- **Example:** `dev modules_v1.0.0.md`, `modules_v1.0.0.md`
- **Purpose:** Versioned immutables for traceability
- **Location:** Project root, referenced in glossaries

**Internal (bundled documentation like v0/docs/):**
- **Filename format:** `term name.md` (no version)
- **Example:** `dev modules.md`, `modules.md`
- **Purpose:** Stable references, no link breakage on version updates
- **Location:** Bundle folders (v0/docs/, etc.)

### Version Post-Amble

**All req files we touch going forward include version internally:**

```markdown
# term name

## Spec
...

## Self-eval
...

## Comments
...

---

**Version:** 1.0.0
```

**Benefits:**
- Version traceable even with generic filename
- Files self-document their version
- No need to parse filename for version info

**When to add:**
- All new req files created
- Any req file we touch/update
- No mass upgrade of existing files (only when touched)

---

## Bundle Documentation Pattern

### Pattern: Self-Contained Bundle

**For portable packages (like v0 model dev env):**

```
v0/
├── README.md           # Entry point
├── docs/               # Complete documentation bundle
│   ├── modules.md      # Generic filename, version in post-amble
│   ├── dev modules.md  # Generic filename, version in post-amble
│   └── ...             # All referenced docs included
└── ... (implementation files)
```

**Characteristics:**
- **Generic filenames** in bundle (no version in filename)
- **Version in post-amble** for traceability
- **Stable references** from README/code
- **Self-contained** - everything needed is included
- **Portable** - can move bundle without breaking links

**Reference pattern in README:**
```markdown
See `docs/modules.md` for layer management details.
See `docs/dev modules.md` for dev-specific overlay system.
```

Links don't break when versions update because filenames stay the same.

---

## Stepping Stone Glossary References

### Pattern: Versioned References in Glossary

**Glossary entries always reference versioned files:**

```markdown
| dev modules | **Extends modules** - Description... | projects/09-.../dev modules_v1.0.0.md |
```

**Why:**
- Glossary points to immutable versioned source
- Clear what version is registered
- Traceability to specific version

**But bundle uses generic:**
- Bundle copies as `dev modules.md` (no version in name)
- Version tracked in post-amble
- References stable

---

## V0 Model Dev Env Bundle Pattern

### Pattern: Always-Current Portable Template

**V0 structure:**
```
projects/{current-project}/dev/v0/    # Model dev env (always current)
├── README.md                         # Entry point with all context
├── docs/                             # Complete doc bundle
│   ├── modules.md                    # Base pattern
│   ├── dev modules.md                # Dev-specific extension
│   ├── PRACTICAL_PATTERNS.md         # This file
│   └── ...                           # Design docs as needed
├── modules/                          # Dev modules structure
│   ├── types/                        # Layer 0 - Node types (built-in)
│   ├── {base-module}/                # Layer 1+ - Named base modules
│   └── _index.json                   # Layer ordering
├── implementation/                   # Work module template
├── install/                          # Deploy assets
├── package.json
├── deploy.js, test.js, extract.js, destroy.js, clone.js
└── ... (other scripts)
```

**Key principles:**
1. **Always current** - Update v0 as patterns evolve
2. **Self-contained** - All docs/types/patterns included
3. **Portable** - Clone and use anywhere
4. **One-stop shop** - Everything needed to understand and use
5. **Lives with current project** - Latest patterns always in latest project

**Location tracking:**
- Note in `status/CURRENT.md` where model dev env lives
- Clear visibility for new session starts
- Points to: `projects/{current-project}/dev/v0/`

---

## Incremental Version Addition

### Pattern: Touch-Based Version Addition

**Don't mass upgrade:**
- Leave existing req files as-is
- Only add version post-amble when we touch/update them
- Gradual evolution, not big-bang

**Why:**
- Pragmatic - focus on what we're working on
- Low friction - no unnecessary work
- Natural evolution - files get updated as needed

**When to add version post-amble:**
- Creating new req file
- Updating existing req file
- Copying to bundle (add if not present)

---

## Glossary Term Syntax

### Pattern: Space-Separated Terms

**Stepping stones glossary uses spaces:**
- `dev modules` ✓ (not `dev-modules`)
- `api method` ✓ (not `api-method`)
- `base module` ✓ (not `base_module`)

**Consistency:**
- Filename: `dev modules_v1.0.0.md`
- Heading: `# dev modules`
- Reference: "see **dev modules** for details"

**Why spaces:**
- Natural language readability
- Consistent with established glossary pattern
- Clear separation of words

---

## Documentation Categories (Future)

### Pattern: How-To vs Stepping Stone

**Current observation:**
- Practical patterns (like this file) are **how-to** style
- Navigational concepts are **stepping stones**
- Not yet centrally registered as separate category

**Potential structure:**
```
glossary/
├── STEPPING_STONES_GLOSSARY.md    # Navigational concepts
├── HOWTO_GLOSSARY.md              # Practical patterns (future)
├── DSL_GLOSSARY.md                # Language vocabulary
└── SPOTS_GLOSSARY.md              # Structure terms
```

**This file captures:** Practical how-to patterns emerging from v0 work
**Future:** May become entries in HOWTO_GLOSSARY.md when formalized

---

## Status Visibility

### Pattern: Clear Session Entry Point Notification

**For significant infrastructure like model dev env:**

Update `status/CURRENT.md` with highly visible note:

```markdown
## Model Dev Environment

**Location:** `projects/09-console-v5-stream-native/dev/v0/`

The always-current, portable, self-contained development environment template.
All latest patterns, types, and documentation included.

**Use this as base for new iterations.**
```

**Why:**
- New sessions immediately see where current model is
- Clear entry point for understanding dev env
- Prevents confusion about which iteration to reference

---

## Summary

**File Naming:**
- External: versioned (`term_v1.0.0.md`)
- Bundle: generic (`term.md`)
- Version tracked in post-amble

**Documentation:**
- Self-contained bundles
- Stable references
- Portable packages

**Evolution:**
- Touch-based version addition
- Incremental, not mass upgrade
- Always-current model in latest project

**Visibility:**
- Status notes for key infrastructure
- Clear session entry points
- One-stop shop documentation

---

**Version:** 1.0.0
