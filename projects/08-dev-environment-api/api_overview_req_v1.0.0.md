**Type:** plain req

# api overview req

## Spec

Requirements pattern for API overview documentation. Inventory and top-level interface for an API.

**Purpose:** Provide user entry point - what the API is, what it consists of, how to use it.

**Required sections:**

1. **API identification**
   - Name and path (e.g., spl/dev)
   - Purpose (one paragraph)
   - Scope (what it covers)

2. **Methods inventory**
   - All public methods listed
   - Signatures: `method({ input }) → { output }`
   - One-liner purpose per method
   - Optional parameters marked with ?

3. **Usage patterns**
   - API-level invocation (if applicable)
   - Common workflows
   - Key concepts
   - Examples

4. **Structure**
   - What the API consists of (methods, tools, docs, tests, etc.)
   - Supporting infrastructure
   - Related resources

**Self-eval requirements:**
- Verify all listed methods exist (files present)
- Verify signatures match implementations (schema files)
- Verify all claimed components exist
- Everything listed in spec → checked in self-eval

**Level:** Top-level view, immediately usable
- User can call methods from overview alone
- No implementation details
- No deep dive into internals

**Example structure:**
```markdown
**Type:** plain req

# spl/example API

## Spec

[Purpose paragraph]

**Methods:**

1. **`method1({ arg1, arg2? })`** → `{ result, status }`
   - What method1 does

2. **`method2({ input })`** → `{ output }`
   - What method2 does

**Usage patterns:**
[Common workflows, API-level invocation]

**Structure:**
[What's included beyond methods]

## Self-eval

- [ ] All methods listed with signatures
- [ ] Signatures match implementations
- [ ] [Other claimed components exist]

## Comments

[API-specific notes]
```

Scope: API documentation pattern.

Purpose: Define what an API overview must contain to be complete and usable.

## Self-eval

- [ ] Specifies required sections (identification, methods, usage, structure)
- [ ] Defines method listing format (signature + purpose)
- [ ] Requires self-eval verification
- [ ] Level is clear (top-level, usable, not implementation)
- [ ] Example structure provided
- [ ] Twin structure (spec claims → self-eval verifies)

## Comments

Overview is **inventory + quick reference** - table of contents for the API.

Self-eval at overview level is **structural verification** (does it exist, are signatures correct), not behavioral testing (that's method-level self-eval).

Whatever the overview claims exists, the self-eval must verify exists. Spec and self-eval evolve together.
