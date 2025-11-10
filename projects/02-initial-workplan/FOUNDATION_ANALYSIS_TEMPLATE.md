# Foundation Analysis Template

**Version:** 1.0.0 (Bootstrap - created during Project 02)
**Created:** 2025-11-10
**Status:** In Development (evolving as we apply it)

Template for analyzing and restructuring foundation documents. Created in parallel with actual foundation analysis (explorative project twin pair pattern).

---

## Pattern: Headline / Detail Separation

**Core principle:** Foundations contain headline information + references to versioned detail files living in project folders.

### Headline Foundations (in `foundations/`)

**Purpose:** Quick reference, high-level what/why, scannable

**Content:**
- Philosophy and core concepts
- What the foundation covers (not how)
- References to versioned detail files

**Example:**
```markdown
## Methodology: PRINCE2 + TDC

We use **PRINCE2 for our agile way of working** (instead of traditional
agile/sprint ceremonies) combined with **TDC for quality definition and validation**.

**PRINCE2** provides: Project structure, stages, products, decision points,
artifacts for visibility

**TDC** provides: How we define "done", how we validate, how we iterate

**Current implementation:** See `projects/01-preliminary-to-workplan/PRINCE2_operational_v1.0.0.md`
```

### Versioned Detail Files (in project folders)

**Purpose:** Complete implementation detail where it was created/evolved

**Naming convention:** `{topic}_v{major}.{minor}.{patch}.md`
- Major (x): Significant methodology/structural changes
- Minor (y): Additions/improvements
- Patch (z): Clarifications/corrections

**Location:** `projects/{project-code}/` where created or evolved

**Example:** `projects/01-preliminary-to-workplan/PRINCE2_operational_v1.0.0.md`

### Benefits

✅ **Complete but raw:** Detail stays where created (unprocessed, full context)
✅ **Traceability:** Know which project created/evolved which version
✅ **Minimal foundations:** Headlines stay scannable, not bloated
✅ **Living artifacts:** Versions evolve through projects
✅ **Full context preserved:** Project folder contains why decisions were made

---

## Foundation Analysis Process

### Step 1: Identify Foundation Components

For each foundation file, identify:
- What are the distinct components/sections?
- Which are headline (overview, philosophy, core concepts)?
- Which are detail (implementation, procedures, templates)?

### Step 2: Apply Headline/Detail Pattern

**For headline components:**
- Keep in foundation file
- Make concise (what/why, not how)
- Add reference to versioned detail

**For detail components:**
- Move to project folder where created
- Apply versioning: `{topic}_v{major}.{minor}.{patch}.md`
- Ensure detail file is complete and self-contained

### Step 3: Update References

**In headline foundation:**
- Add reference to detail file location
- Use relative path from repo root
- Example: `See projects/01-preliminary-to-workplan/PRINCE2_operational_v1.0.0.md`

**In detail file:**
- Add header noting version, creation date, project
- Include full implementation detail

### Step 4: Validate Structure

**Check headline foundation:**
- [ ] Scannable (can understand key concepts quickly)
- [ ] References to detail are clear
- [ ] No unnecessary duplication
- [ ] Maintains "minimal and complete" principle

**Check detail file:**
- [ ] Complete and self-contained
- [ ] Lives in correct project folder
- [ ] Properly versioned
- [ ] Full context preserved

---

## Versioning Guidelines

### When to increment version numbers

**Major version (x.0.0):**
- Significant structural changes to methodology
- Breaking changes to how it's applied
- Complete redesign or major overhaul

**Minor version (0.y.0):**
- New sections or capabilities added
- Enhancements to existing content
- Additional templates or artifacts
- Improvements that don't break existing usage

**Patch version (0.0.z):**
- Clarifications and corrections
- Typo fixes
- Formatting improvements
- Minor wording changes for clarity

### Creating new versions

**When project evolves a foundation detail:**
1. Create new versioned file in that project's folder
2. Apply new version number based on change type
3. Update headline foundation reference to new version
4. Preserve old version (traceability)

**Example evolution:**
- Project 01 creates: `PRINCE2_operational_v1.0.0.md`
- Project 02 improves: `projects/02-initial-workplan/PRINCE2_operational_v1.1.0.md`
- WOW.md updated to reference: `projects/02-initial-workplan/PRINCE2_operational_v1.1.0.md`

---

## Cross-Pollination Notes

*This section captures insights from applying the template to actual foundation analysis*

### 2025-11-10: PRINCE2 / WOW Analysis

**Applied pattern to:** WOW.md and PRINCE2_WOW.md

**Action taken:**
- Moved `foundations/PRINCE2_WOW.md` → `projects/01-preliminary-to-workplan/PRINCE2_operational_v1.0.0.md`
- Updated WOW.md to headline-only with reference

**What worked:**
- Clear separation of headline vs detail
- Reference path is simple and clear
- Versioning pattern makes sense

**Refinements to template:**
- None needed yet - pattern applied cleanly

---

### 2025-11-10: TDC / WOW Analysis

**Applied pattern to:** WOW.md and TDC_FRAMEWORK.md

**Action taken:**
- Moved `foundations/TDC_FRAMEWORK.md` → `projects/01-preliminary-to-workplan/TDC_framework_v1.0.0.md`
- Gave TDC its own headline section in WOW.md (separate from PRINCE2)
- Added explicit "Integration: PRINCE2 + TDC" section

**What worked:**
- Recognizing TDC deserves separate headline visibility (not bundled with PRINCE2)
- Two distinct methodologies, explicit integration section
- Clearer structure: PRINCE2 → TDC → Integration

**Insight:**
When multiple methodologies exist, clarify their relationship. TDC is universal (applies to everything), PRINCE2 uses TDC for quality. Don't create unnecessary "integration" sections - just mention the relationship where it naturally fits.

**Refinements to template:**
- If one methodology is universal and another uses it, note the usage in the specific methodology, not a separate section
- Avoid over-documenting integration - keep it simple

---

### 2025-11-10: Methodology Evolution / PRINCE2 Analysis

**Applied pattern to:** Methodology Evolution section in WOW.md

**Action taken:**
- Removed "Methodology Evolution" as separate section
- Added "Drives all deliverables: Features, documentation, infrastructure, and methodology itself" to PRINCE2 section

**What worked:**
- Recognizing that methodology evolution isn't a separate methodology - it's a project type within PRINCE2
- PRINCE2 drives ALL deliverables, including methodology
- Explorative projects are detailed in PRINCE2_operational_v1.0.0.md

**Insight:**
Don't create separate headline sections for concepts that are actually part of another methodology. Ask: "Is this a separate methodology, or a detail of how another methodology works?"

**Refinements to template:**
- When analyzing sections, check if they're truly distinct concepts or implementations of existing concepts
- Look for misplaced detail that should be in a versioned file, not as separate headline

---

### 2025-11-10: Philosophy / Roles & Responsibilities / Decision-Making Analysis

**Applied pattern to:** Philosophy, Roles & Responsibilities, Decision-Making Framework, Working Style sections in WOW.md

**Action taken:**
- Created `Philosophy_v1.0.0.md` in `projects/01-preliminary-to-workplan/`
- Updated Philosophy section in WOW.md to headline: boundary model (Human = outside boundary, AI = inside boundary, boundary moves outward)
- Removed Roles & Responsibilities section (moved to Philosophy detail)
- Removed Decision-Making Framework section (moved to Philosophy detail)
- Removed Working Style section (moved to Philosophy detail)

**What worked:**
- Recognizing that multiple sections were all elaborations of the core philosophy
- The boundary model is the core concept - roles, decisions, and working style are implementations
- Philosophy detail captures the expanding boundary concept

**Insight:**
Multiple sections that elaborate a single core concept should be consolidated into one detail file. Ask: "Are these separate concepts, or different views of the same concept?"

**Result:**
WOW.md now has only 3 sections: Philosophy, Methodology: PRINCE2, Methodology: TDC - very clean and scannable

**Refinements to template:**
- Look for multiple sections that are really elaborating one core principle
- Core concept as headline, elaborations in detail file

---

### 2025-11-10: PRINCIPLES.md Analysis - Philosophy/Goals Category

**Applied pattern to:** Philosophy/Goals category in PRINCIPLES.md

**Action taken:**
- Consolidated 4 sections (What is Splectrum, Primary Goals, Design Philosophy, Quality Standard) into single "What is Splectrum?" headline
- Removed "Quality Standard" (already in WOW/PRINCE2)
- Removed "Design Philosophy Do/Don't" (integrated into approach)
- Removed "Minimal and Complete" from Core Principles (moved to Philosophy_v1.0.0.md as Coding Practice)
- Removed "Exploration + Evidence" from Core Principles (already in WOW)
- Removed "Primary Use Cases" (moved to CIP-003 and CIP-004)
- Renamed "Core Principles" → "Design Principles" (only architectural principles remain)

**What worked:**
- Recognizing embryonic nature of SPL2 definition - detail emerges through exploration
- Separating WOW principles (how we code) from SPL2 design principles (architecture)
- Moving planned work to CIP Register
- Consolidating overlapping content into concise headline

**Insight:**
Embryonic concepts don't need extensive detail upfront. State the current understanding clearly, acknowledge detail will emerge through exploration, let bootstrap pattern work.

**Result:**
PRINCIPLES.md much cleaner - "What is Splectrum?" is embryonic headline that will evolve through exploration projects.

**Refinements to template:**
- Don't elaborate embryonic concepts prematurely - let them evolve through exploration
- Separate general principles (WOW) from domain-specific principles (SPL2 design)
- Planned work belongs in CIP Register, not principles

---

### 2025-11-10: PRINCIPLES.md Complete Analysis

**Applied pattern to:** All remaining categories in PRINCIPLES.md

**Action taken:**
- Design Principles: Kept as-is (embryonic architectural direction)
- Technology Constraints: Kept all as-is (embryonic, will evolve through exploration)
- Split "Data & Schema" into "Kafka Compatibility/Streaming" and "AVRO for Schema and RPC"
- Merged Communication section into AVRO (removed "abstract integration patterns" comment)
- Moved "AI Freedom" to Philosophy_v1.0.0.md (WOW, not SPL2-specific)

**What worked:**
- Recognizing when detail is embryonic vs when it needs extraction
- Technology constraints are mostly embryonic - stating direction, not full implementation
- Waiting for exploration to create meaningful detail (bootstrap pattern)

**Insight:**
Not everything needs detail extraction. Embryonic foundations state direction and constraints clearly, then let exploration projects create detail through doing. Trust the bootstrap pattern.

**Result:**
PRINCIPLES.md is clean, minimal, embryonic. All detail will emerge through exploration projects and get versioned in those project folders.

**Refinements to template:**
- Embryonic is valid state - don't force detail extraction when exploration hasn't happened yet
- Clear, concise statements of direction are often sufficient for foundations

---

### 2025-11-10: PRINCIPLES_DETAILED.md - Extract to Granular Detail Files

**Decision:** Extract PRINCIPLES_DETAILED.md content into granular detail files (without detailed review)

**Rationale:**
- Better organization through separation of concerns
- Easier to reference specific topics from PRINCIPLES.md
- Granular files can be individually versioned as they evolve
- Maintains detail without monolithic file

**Action taken:**
Created 5 detail files in `projects/02-initial-workplan/`:
1. **Data_architecture_v1.0.0.md** - Minimal & Complete, Kafka records, process structure
2. **DSL_engine_v1.0.0.md** - DSL engine details, AI as user, growing library, abstract integration
3. **Pear_platform_v1.0.0.md** - Bare runtime, P2P characteristics
4. **Technology_validation_v1.0.0.md** - All product-poc validation results (AVRO, testing, build tools, etc.)
5. **API_pipelining_v1.0.0.md** - DSL implementation through pipelining (exploratory)

**Added references in PRINCIPLES.md:**
- Design Principles → Data_architecture_v1.0.0.md, DSL_engine_v1.0.0.md, API_pipelining_v1.0.0.md
- Code & Runtime → Pear_platform_v1.0.0.md
- Tooling Stack → Technology_validation_v1.0.0.md

**Approach:**
- Content extracted as-is (no review/refinement yet)
- Files will evolve through future exploration projects
- Each exploration can create new versions in their own project folders

**Insight:**
Granular detail files provide better organization and individual versioning. Extract content as-is for structure, let explorations refine detail later.

---

### 2025-11-10: Artifact-to-Requirements Pinning Pattern

**Discovery:** TDC pattern for versioned requirements and artifacts

**Pattern established:**
1. Each artifact type has its own versioned requirements document
2. **Artifacts reference their requirements as mandatory first line**
3. Requirements evolve independently (can create v2.0.0 without upgrading all artifacts)
4. Artifacts only judged against their referenced requirements
5. No forced upgrades - upgrade artifact only when choosing new requirements
6. Without requirements reference, no way to assess artifact quality

**Implementation:**
- Created WOW_requirements_v1.0.0.md (for WOW.md)
- Created Principles_requirements_v1.0.0.md (for PRINCIPLES.md)
- Requirements live in project folders where created (projects/01-preliminary-to-workplan/)
- Artifacts reference their requirements at the top

**Why it matters:**
- TDC principle: requirements define "done" for artifacts
- Versioning enables evolution without breaking existing artifacts
- Clear quality assessment over time
- Artifact validity is always relative to its referenced requirements

**Application to foundation analysis:**
- When creating new foundation artifacts, define requirements first
- Version requirements documents
- Artifacts reference their requirements
- Foundation updates can create new requirement versions without forcing artifact upgrades

---

## Template Status

**Maturity:** 🟡 Bootstrap (v1.0.0 - evolving during first use)

**Next steps:**
- Apply to additional foundation files
- Capture more cross-pollination insights
- Refine based on what works/doesn't work
- Validate pattern holds across different foundation types

---

## Integration with Foundation Update Methodology

This template supports **Product 3: Foundation Update Methodology** by establishing:
- Where detail files live (project folders)
- How to reference them (versioning scheme)
- When to create new versions (version increment guidelines)

Foundation updates will use this structure for adding new detail or evolving existing detail.
