**Requirements:** (To be defined in glossary project)

# Local Rules Apply v1.0.0

**Created:** Project 05, 2025-11-16
**Context:** Artifacts satisfy their requirements version at creation - no retroactive burden when requirements evolve
**Status:** Active

---

## The Principle

**Artifacts satisfy their own requirements (version at time of creation). No retroactive burden when requirements evolve.**

**Core pattern:**
- Each artifact references specific version of its requirements (first line)
- Artifact satisfied those requirements at time of creation
- Artifact remains valid even if requirements evolve later
- New work uses new requirements, old work stays valid

**Why this matters:**
- Freedom to evolve requirements based on evidence
- No anxiety about breaking previous work
- Focus on what's needed NOW, not historical consistency
- Evolution happens naturally, not through retroactive compliance

---

## Artifact-to-Requirements Pinning

**See stepping stone:** Artifact-to-requirements pinning

**The mandatory pattern:**

```markdown
**Requirements:** See path/to/requirements_vX.Y.Z.md

# Artifact Name

[content...]
```

**Every artifact with requirements:**
- References requirements document as first line
- Includes specific version number
- Version never changes for the artifact
- Clear what the artifact satisfied at creation

**Why first line:**
- Immediately visible when reading artifact
- Can't be missed or forgotten
- Easy to verify quality baseline
- Standard pattern across all artifacts

---

## No Retroactive Compliance

**When requirements change, previous artifacts don't need updating.**

**The problem this solves:**

**Without local rules:**
- New requirements version created (v2.0.0)
- All previous artifacts "fail" new requirements
- Forced upgrade burden on all old work
- Or accept that old work is "non-compliant"
- Anxiety about evolution breaking things
- Resistance to improving requirements

**With local rules:**
- New requirements version created (v2.0.0)
- Previous artifacts still satisfy their v1.0.0 requirements
- No forced upgrades, no "non-compliance"
- Old work remains valid
- Requirements can evolve freely
- Evidence-based improvement without anxiety

**The shift:**
- From "all artifacts must meet current requirements"
- To "artifacts must meet their requirements"
- From retroactive compliance burden
- To freedom to evolve based on evidence

---

## Three-Tier Structure: General → Specific → Local

### 1. General (Top): Foundations

**WOW.md, PRINCIPLES.md, PARTNERSHIP.md:**
- Broad principles that rarely change
- Mutable entry points (protected by CHANGELOGs)
- Reference detailed implementations
- Headline format with detail documents

**Characteristics:**
- Stable over time
- High-level guidance
- Versioned only through CHANGELOGs
- Always "current"

### 2. Specific (Middle): Requirements Documents

**Project types, product types, templates, stepping stone requirements:**
- Define expectations for categories of work
- Versioned immutables in project folders or chats/immutables/
- Can evolve based on evidence (new versions created)
- Contain specific WOW guidance for their domain

**Characteristics:**
- Version numbered (v1.0.0, v1.1.0, v2.0.0)
- Immutable once created (never change)
- New versions emerge from evidence
- Local rules apply to artifacts referencing them

**Example:**
- Project_requirements_v1.3.1.md
- Exploration_project_requirements_v1.0.0.md
- CHAT_REQUIREMENTS_v1.0.0.md

### 3. Local (Bottom): Artifacts

**Projects, deliverables, code, documentation:**
- Reference specific requirement versions (first line)
- Satisfy those requirements at creation
- Remain valid when requirements evolve
- Deliberate upgrade decision if needed

**Characteristics:**
- Created to satisfy specific requirements version
- Quality assessed against that version
- Not automatically upgraded
- Valid indefinitely against their requirements

**Example:**
- PROJECT_BRIEF.md references Project_requirements_v1.3.1.md
- Remains valid even if Project_requirements_v2.0.0.md created later

### The Flow

```
WOW.md (general, mutable)
  ↓ references
Project_requirements_v1.3.1.md (specific, immutable)
  ↓ referenced by
PROJECT_BRIEF.md (local, immutable)
```

**Evolution:**
```
Evidence from Project 05 shows need for new project type
  ↓
Create Project_requirements_v1.4.0.md (adds new type)
  ↓
Future projects reference v1.4.0
  ↓
Project 05 still references v1.3.1 (remains valid)
```

---

## Benefits

### For Creators

**Clear expectations:**
- Reference tells you exactly what to satisfy
- No ambiguity about requirements
- Version-specific validation criteria
- Know when you're done

**No looking over shoulder:**
- Don't need to check historical consistency
- Don't need to validate against all previous patterns
- Focus on current requirements only
- Done when current requirements satisfied

**Freedom to improve:**
- Can propose requirements improvements
- Evidence from work drives evolution
- No anxiety about breaking previous work
- Continuous improvement encouraged

### For Consumers

**Clear understanding:**
- Know what artifact satisfied at creation
- Can assess against those specific requirements
- Understand quality baseline
- Context for artifact's design decisions

**Current needs assessment:**
- Can evaluate if artifact meets needs NOW
- May be valid but not current enough
- Explicit upgrade decision possible
- No forced upgrades

**Explicit upgrade path:**
- If requirements changed significantly
- Can choose to upgrade artifact to new requirements
- Or continue using with old requirements
- Or create new artifact with new requirements

### For Evolution

**Requirements improve through evidence:**
- Friction from using requirements reveals issues
- Evidence shows what's missing or wrong
- New versions created based on demonstrated need
- Organic evolution, not speculation

**New work benefits:**
- Latest requirements reflect latest learning
- Improved patterns immediately available
- No legacy baggage from old requirements
- Quality improves over time

**Old work remains valid:**
- No forced upgrades or retrofits
- Satisfied requirements at the time
- Value doesn't diminish with evolution
- Can be used or referenced with confidence

**Minimal and complete applies:**
- Evolve requirements when evidence shows need
- Not when imagined future needs suggest it
- Pain-driven improvement
- Evidence-based evolution

---

## Application

### When Creating Any Artifact

**Process:**

1. **Identify artifact type** - What am I creating? Project, product, deliverable, code, documentation?

2. **Find appropriate requirements** - What requirements document defines expectations for this type?

3. **Reference it (first line, specific version)** - `**Requirements:** See path/to/requirements_vX.Y.Z.md`

4. **Satisfy those requirements** - Build artifact to meet those specific requirements

5. **Done** - No need to check historical consistency, no need to satisfy future requirements

**That's it:**
- Simple, clear process
- No ambiguity about what to satisfy
- No retroactive burden
- Freedom to focus on current work

### When Requirements Evolve

**Process:**

1. **Evidence shows need** - Friction from using current requirements, patterns discovered, learning captured

2. **Create new version** - Evidence-based improvement, versioning (major.minor.patch)

3. **New work references new version** - Future artifacts use improved requirements

4. **Old work keeps old references** - Previous artifacts don't change

5. **No retroactive updates needed** - Old work remains valid against its requirements

**Evolution is natural:**
- Driven by evidence, not speculation
- New versions created when demonstrated need
- Old versions remain valid
- No compliance burden

### When Assessing Artifact

**Process:**

1. **Check referenced requirements version** - What requirements did this satisfy?

2. **Evaluate against those requirements** - Does it meet them? TDC validation

3. **If using now, assess current needs** - Does it meet needs TODAY, even if it met requirements THEN?

4. **Upgrade if needed, but not required** - Deliberate decision based on current needs

**Quality assessment:**
- Against specific requirements version
- Objective validation possible
- Can be "valid but not current enough"
- Upgrade decision explicit and optional

---

## Examples

### Project Types

**Scenario:**
- Project 02 used Exploration_project_requirements_v1.0.0.md
- Project 03 used Exploration_project_requirements_v1.0.0.md
- Evidence from Projects 02-04 suggests improvements
- Exploration_project_requirements_v2.0.0.md created with new patterns

**Result:**
- Projects 02 and 03 remain valid (satisfied v1.0.0)
- No need to retroactively update their artifacts
- Future Exploration Projects use v2.0.0
- Learning captured, old work still valid

### Code Artifacts

**Scenario:**
- Method created referencing Code_requirements_v1.0.0.md
- Code_requirements_v2.0.0.md adds new validation rules (stricter error handling)
- Method still works, satisfies v1.0.0

**Result:**
- Method remains valid (satisfied v1.0.0 requirements)
- New methods use v2.0.0, include stricter error handling
- Old method not forced to upgrade
- Deliberate upgrade decision if/when method needs changes
- Both versions coexist without conflict

### Documentation

**Scenario:**
- README.md references Documentation_requirements_v1.0.0.md
- v1.0.0 required: purpose, installation, basic usage
- Evidence: Users confused by lack of examples
- v2.0.0 adds requirement: examples section

**Result:**
- README.md still valid (v1.0.0 didn't require examples)
- New READMEs include examples (v2.0.0)
- README.md can be upgraded if desired
- Not required, remains valid as-is
- Evidence-driven improvement, no retroactive burden

### Stepping Stones

**Scenario:**
- Minimal and Complete stepping stone created with requirements v1.0.0
- Glossary entry added, used in work
- Evidence shows requirements need clarification
- Requirements_v2.0.0 created with clearer validation criteria

**Result:**
- Glossary entry satisfied v1.0.0 (remains valid)
- Can choose to upgrade entry to v2.0.0
- New stepping stones use v2.0.0 from creation
- Evolution without retroactive burden

---

## Integration with Other Patterns

### Artifact-to-Requirements Pinning

**Local rules require pinning:**
- Can't apply local rules without version reference
- Pinning makes requirements version explicit
- First line reference is the mechanism
- Mandatory pattern enabling local rules

### TDC Validation

**Local rules enable objective validation:**
- Know exactly what requirements to validate against
- No ambiguity about quality baseline
- Self-evaluation possible with clear reference
- Validation results meaningful and traceable

### Evidence-Based Evolution

**Local rules enable fearless evolution:**
- Requirements can improve based on evidence
- No anxiety about breaking previous work
- Freedom to respond to demonstrated needs
- Organic improvement without compliance burden

### Minimal and Complete

**Local rules support minimal approach:**
- Start with minimal requirements
- Evolve when evidence shows need
- No premature comprehensive requirements
- Previous work remains valid as requirements grow

---

## Misconceptions and Clarifications

### "Doesn't this mean old work is low quality?"

**No - quality is relative to requirements at creation time.**

- Old work satisfied its requirements = quality achieved
- Requirements evolving ≠ old work becoming invalid
- Quality = meets requirements, not "meets latest requirements"
- Value doesn't diminish when requirements improve

### "Should I upgrade old artifacts when requirements change?"

**Only if current needs demand it.**

- Not required - old artifacts remain valid
- Upgrade if: Using artifact now and new requirements add needed value
- Don't upgrade if: Artifact works fine, no current need
- Deliberate decision based on evidence, not compliance

### "How do I know if I should create new version?"

**Evidence from use.**

- Friction from using current requirements
- Patterns discovered repeatedly
- Learning captured in lessons learned
- Demonstrated need, not imagined improvement
- Pain-driven, not speculation-driven

### "Won't this create version sprawl?"

**Only if you create versions without evidence.**

- Evidence-based evolution prevents unnecessary versions
- Versions created when demonstrated need
- Most artifacts reference current version
- Old versions exist but aren't proliferating
- Natural consolidation over time

---

## Anti-Patterns

### Retroactive Upgrades

**Forcing old artifacts to meet new requirements:**
- Violates local rules principle
- Creates compliance burden
- Discourages requirements evolution
- Wastes effort on non-value work

**Instead:**
- Leave old artifacts valid against their requirements
- Only upgrade when current needs demand
- Focus effort on new work with better requirements

### Version Without Evidence

**Creating new requirements version without demonstrated need:**
- Speculation-driven evolution
- Premature optimization of requirements
- Version sprawl without value
- Complexity without benefit

**Instead:**
- Wait for evidence from use
- Create versions when friction shows need
- Evidence-based evolution only
- Pain-driven improvement

### Ignoring Requirements Evolution

**Never improving requirements despite evidence:**
- Friction persists unnecessarily
- Learning not captured
- Future work suffers from old patterns
- Missed improvement opportunities

**Instead:**
- Respond to friction from requirements
- Create new versions when evidence shows need
- Capture learning for future work
- Balance stability with improvement

### Ambiguous References

**Referencing requirements without version:**
- Can't apply local rules without version
- Quality assessment ambiguous
- Don't know what was satisfied
- Validation baseline unclear

**Instead:**
- Always include version in reference
- First line, explicit version number
- Clear what artifact satisfied
- Objective quality assessment possible

---

**Summary: Local rules mean artifacts satisfy their requirements version at creation, not future versions. No retroactive burden when requirements evolve. Freedom to improve based on evidence. Three-tier structure: General foundations → Specific requirements (versioned) → Local artifacts (reference versions). Quality assessed against artifact's requirements, not latest requirements. Evolution natural and fearless.**
