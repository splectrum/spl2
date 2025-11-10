# Test Driven Creation (TDC) Framework v1.1.0

**Version:** 1.1.0
**Created:** Project 01 (v1.0.0), Project 02 (v1.1.0 - added artifact-to-requirements pinning)
**Changes in v1.1.0:** Added mandatory artifact-to-requirements pinning pattern

## Philosophy

**"You get what passes tests"** - Quality defined through validation, not aspiration.

**Strict but not rigid:**
- Strict: Must pass validation criteria to be "done"
- Not rigid: How you get there is flexible, iterative approach encouraged

**Universal application:**
- Works for code (traditional TDD)
- Works for documentation
- Works for designs, specifications, research
- Works for any deliverable artifact

## Core Concept

```
Define what "done" means → Create artifact → Validate → Iterate until passes
```

**Key insight:** Validation criteria define quality, not lengthy specifications.

## The TDC Process

### 1. Define Work Item

**What are we creating?**
- Name and type (code, documentation, design, research, etc.)
- Purpose (why we're creating it)
- Context (where it fits)

**Template:** See "Work Item Template" below

### 2. Define Validation Criteria

**How do we know it's done right?**
- Specific, testable criteria
- Not "write good code" but "passes these tests"
- Not "comprehensive docs" but "answers these questions"
- Red/Yellow/Green scoring where appropriate

**Template:** See "Validation Criteria Template" below

### 3. Create Artifact

**Build it:**
- Use any approach that works
- Iterate and refine
- Test against criteria as you go
- Adjust if criteria reveal issues

### 4. Validate

**Does it pass?**
- Run tests (for code)
- Answer validation questions (for documentation)
- Check against criteria (for designs)
- Document results

**Template:** See "Validation Results Template" below

### 5. Iterate or Complete

**If validation passes:** Done ✅
**If validation fails:** Iterate and try again
**If criteria are wrong:** Fix criteria, then iterate

## Work Item Template

Use this for any artifact you're creating:

```markdown
# Work Item: [Name]

**Type:** [Code | Documentation | Design | Research | Specification | Other]
**Purpose:** [Why we're creating this, what problem it solves]
**Context:** [Where this fits, what depends on it]

## Description

[What this work item is - clear, concise explanation]

## Deliverables

[Specific artifacts that will be created]
- [File or product 1]
- [File or product 2]

## Validation Criteria

[How we'll know this is done right - specific, testable]

### Criterion 1: [Name]
**Requirement:** [What must be true]
**Test:** [How to verify it]
**Pass condition:** [What success looks like]

### Criterion 2: [Name]
**Requirement:** [What must be true]
**Test:** [How to verify it]
**Pass condition:** [What success looks like]

[Add as many criteria as needed]

## Acceptance

Work item is complete when:
- ✅ All validation criteria pass
- ✅ All deliverables exist
- ✅ [Any other specific conditions]

## Notes

[Any additional context, constraints, or considerations]
```

## Validation Criteria Template

Different artifact types need different validation approaches:

### For Code

```markdown
## Validation Criteria

### Criterion: Tests Pass
**Requirement:** All unit tests pass
**Test:** Run `npm test`
**Pass condition:** 0 failures, all tests green

### Criterion: Coverage
**Requirement:** Test coverage ≥ X%
**Test:** Run `npm run test:coverage`
**Pass condition:** Coverage report shows ≥ X%

### Criterion: Linting
**Requirement:** Code follows style guidelines
**Test:** Run `npm run lint`
**Pass condition:** 0 errors, 0 warnings

### Criterion: Type Safety
**Requirement:** TypeScript types are correct
**Test:** Run `tsc --noEmit`
**Pass condition:** 0 type errors

### Criterion: Functionality
**Requirement:** [Specific behavior works]
**Test:** [Specific test case or manual verification]
**Pass condition:** [Expected outcome occurs]
```

### For Documentation

```markdown
## Validation Criteria

### Criterion: Fresh Context Test
**Requirement:** Someone with no prior context can understand the document
**Test:** Read doc with fresh eyes, note what's unclear
**Pass condition:** All essential concepts explained, no blocking gaps

### Criterion: Completeness
**Requirement:** All required topics covered
**Test:** Checklist of required topics, verify each is addressed
**Pass condition:** Every required topic has a section

### Criterion: Actionability
**Requirement:** Readers can act on the information
**Test:** Identify action items, verify they're specific enough to execute
**Pass condition:** All guidance is concrete, not vague

### Criterion: Accuracy
**Requirement:** Information is correct and up to date
**Test:** Cross-reference with source material, verify facts
**Pass condition:** No incorrect information, references are current

[See REQUIREMENTS.md for more documentation validation patterns]
```

### For Designs/Specifications

```markdown
## Validation Criteria

### Criterion: Completeness
**Requirement:** All components/sections specified
**Test:** Checklist of required elements
**Pass condition:** No missing pieces

### Criterion: Consistency
**Requirement:** No internal contradictions
**Test:** Cross-reference all sections, identify conflicts
**Pass condition:** All sections align, no contradictions

### Criterion: Feasibility
**Requirement:** Design is actually buildable
**Test:** Review with implementation constraints
**Pass condition:** No impossible requirements

### Criterion: Clarity
**Requirement:** Design is understandable
**Test:** Explain to someone else, note confusion points
**Pass condition:** Key stakeholders understand the design
```

### For Research/Analysis

```markdown
## Validation Criteria

### Criterion: Questions Answered
**Requirement:** All research questions addressed
**Test:** Checklist of questions, verify each has answer
**Pass condition:** Every question answered or marked "not answerable"

### Criterion: Evidence Provided
**Requirement:** Claims supported by evidence
**Test:** Review each claim, verify evidence exists
**Pass condition:** All claims have supporting evidence or marked as hypothesis

### Criterion: Conclusions Valid
**Requirement:** Conclusions follow from evidence
**Test:** Trace logic from evidence to conclusions
**Pass condition:** No logical leaps, conclusions justified

### Criterion: Actionable Insights
**Requirement:** Research leads to clear next steps
**Test:** Identify recommended actions from research
**Pass condition:** Clear recommendations or "no action needed" with rationale
```

## Validation Results Template

Use this to document validation outcomes:

```markdown
# Validation Results: [Work Item Name]

**Date:** [YYYY-MM-DD]
**Validator:** [Who validated]
**Artifact Version:** [Commit hash, version, or identifier]

---

## Criterion: [Name]

**Status:** [✅ Pass | ⚠️ Partial | ❌ Fail]

**Evidence:**
[What was tested, what was observed]

**Result:**
[Why it passed or failed]

**Issues (if any):**
- [Specific problem 1]
- [Specific problem 2]

**Recommendations:**
[What to fix or improve]

---

[Repeat for each criterion]

---

## Overall Assessment

**Summary:**
- Passed: [X] criteria
- Partial: [Y] criteria
- Failed: [Z] criteria

**Is work item complete?** [✅ Yes | ❌ No]

**If not complete:**
- [What needs to be fixed]
- [Priority of fixes]

**If complete:**
- [Note any minor improvements that could be made later]
- [Confirm all deliverables exist]

---

## Next Steps

[What happens next - either iterate or mark complete]
```

## Integration with PRINCE2

**Product Descriptions become Work Items:**
- PRINCE2 "Product" = TDC "Work Item"
- Product quality criteria = TDC validation criteria
- Product sign-off = TDC validation passes

**Example from PROJECT_BRIEF.md:**

```markdown
### Product 1: Repository Review & Foundation Update

**Description:** Foundations validated and updated based on past experience

**Quality Criteria (TDC Validation):**
- Product-poc reviewed, key insights documented
- spl1 archive reviewed, pipelining approach understood
- Foundations updated with relevant learnings
- No conflicts or blocking gaps remain
- Documentation validated and scores "good enough"
```

This IS a TDC work item - quality criteria define "done", validation determines if product is complete.

## Scoring: Red/Yellow/Green

For complex artifacts with multiple criteria, use scoring:

**🟢 Green - Fit for Purpose**
- Meets requirements adequately
- No blocking issues
- Good enough to use

**🟡 Yellow - Issues Present**
- Partially meets requirements
- Issues exist but not blocking
- Can proceed but should improve

**🔴 Red - Blocking Issues**
- Fails requirements significantly
- Critical gaps or problems
- Must fix before proceeding

**Overall quality determined by scoring distribution:**
- All Green = Excellent
- Some Yellow, no Red = Good enough
- Any Red = Not done, must fix

## Adaptation for Different Contexts

### Traditional TDD (Code)
- Red: Write failing test
- Green: Make test pass
- Refactor: Clean up code
- **TDC adds:** Clear definition of what tests to write (validation criteria upfront)

### Documentation TDC
- Define validation criteria (from REQUIREMENTS.md pattern)
- Write document
- Validate against criteria
- Iterate until criteria pass

### Design TDC
- Define what makes design "good enough"
- Create design
- Validate against criteria
- Iterate

### Research TDC
- Define research questions (validation criteria)
- Conduct research
- Validate answers are adequate
- Iterate if gaps remain

## Examples from Project 01

### Example 1: Documentation TDC

**Work Item:** Foundations documentation (WOW.md, PRINCIPLES.md)

**Validation Criteria:** 8 tests in REQUIREMENTS.md
- Fresh Context Test
- Decision-Making Test
- Completeness Test
- [etc.]

**Validation Results:** VALIDATION_RESULTS.md
- Initial: 3 Green, 5 Yellow, 0 Red → "Good enough"
- After improvements: 8 Green, 0 Yellow, 0 Red → "Strongly validated"

**Outcome:** TDC showed exactly what needed improvement (Yellow scores) and when done (all Green)

### Example 2: Research TDC

**Work Item:** product-poc repository review

**Validation Criteria (implicit):**
- What tooling was validated?
- What worked well?
- What should we adopt for SPL2?
- Evidence for each choice?

**Validation Results:** PRODUCT-POC-FINDINGS.md
- All questions answered with evidence
- Clear recommendations with data
- Performance metrics provided
- Maturity ratings assigned

**Outcome:** Research complete when all questions answered with evidence

### Example 3: PRINCE2 Integration

**Product 1:** Repository Review & Foundation Update

**TDC Quality Criteria:**
- product-poc reviewed, key insights documented ✅
- spl1 archive reviewed, pipelining approach understood ✅
- Foundations updated with relevant learnings ✅
- No conflicts or blocking gaps remain ✅
- Documentation validated and scores "good enough" ✅
- Ready to support efficient workplan execution ✅

**Validation:** All criteria met, Product 1 complete

## Best Practices

### Define Criteria Early
- Before creating artifact, define what "done" means
- Saves time - no guessing if you're done
- Prevents scope creep - clear boundaries

### Make Criteria Testable
- Not "good documentation" but "passes these 8 tests"
- Not "clean code" but "linting passes, tests pass, coverage ≥ 80%"
- Specific, verifiable conditions

### Iterate on Criteria Too
- If criteria don't reveal real quality, fix criteria
- If something important isn't validated, add criterion
- Criteria should improve with experience

### Use Appropriate Granularity
- Simple artifact = few criteria
- Complex artifact = many detailed criteria
- Match validation effort to importance

### Document Results
- Validation results are valuable
- Show what was tested, what passed/failed
- Future reference for why decisions were made

### Integrate with Daily Work
- TDC isn't separate from work, it IS the work
- Define → Create → Validate → Iterate is the process
- Validation criteria guide creation

## Summary

**TDC is:**
- Universal quality framework
- Strict about outcomes, flexible about process
- Validation-driven, not specification-driven
- Applicable to any deliverable

**TDC ensures:**
- Clear definition of "done"
- Objective quality assessment
- Iterative improvement
- No ambiguity about completion

**TDC prevents:**
- "I think it's done" without validation
- Endless perfectionism
- Scope creep
- Unvalidated assumptions

**TDC integrates with:**
- PRINCE2 (Product quality criteria)
- Traditional TDD (extends beyond code)
- Agile (definition of done)
- Our WOW (how we work together)

## Artifact-to-Requirements Pinning Pattern

**Pattern discovered in Project 02** - Mandatory practice for all artifacts with requirements.

### The Pattern

Each artifact type needs its own versioned requirements document. Artifacts reference the requirements version active when created. This enables:
- Quality assessment against specific requirements
- Independent evolution of artifacts and requirements
- No forced upgrades
- Preservation of artifact validity over time

### Mandatory Practice

**All artifacts MUST:**
1. Reference their requirements document as the **first line** of the file
2. Use format: `**Requirements:** See path/to/requirements_vX.Y.Z.md`
3. Include version in requirements filename (e.g., `WOW_requirements_v1.0.0.md`)

**Example:**
```markdown
**Requirements:** See `projects/01-preliminary-to-workplan/WOW_requirements_v1.0.0.md`

# Ways of Working (WOW)

[rest of content]
```

### Why This Matters

**Without requirements reference:**
- No way to assess artifact quality objectively
- Can't tell if artifact meets its purpose
- Quality becomes subjective opinion
- No baseline for validation

**With requirements reference:**
- Clear quality assessment (does it meet its requirements?)
- Artifacts judged against their specific requirements version
- Requirements can evolve without breaking existing artifacts
- Validation results are meaningful (pass/fail against known criteria)

### Requirements Documents

**Requirements documents are:**
- Versioned (x.y.z format)
- Stored in project folders where created
- Define validation criteria for artifact type
- Use TDC validation framework (tests/criteria)
- Can evolve independently

**When to create new requirements version:**
- Major changes (x.0.0): Significant new requirements, incompatible changes
- Minor changes (x.y.0): Additional requirements, backward compatible
- Patch changes (x.y.z): Clarifications, corrections

### Artifact Upgrade Decision

**Artifacts are NOT automatically upgraded to new requirements.**

When new requirements version exists:
1. Existing artifacts remain valid against their referenced requirements
2. **Deliberately choose** whether to upgrade artifact to new requirements
3. Upgrade means: update requirements reference + ensure artifact meets new requirements
4. No forced upgrades - artifacts stay valid against their requirements version

### Examples from Project 02

**WOW.md:**
```markdown
**Requirements:** See `projects/01-preliminary-to-workplan/WOW_requirements_v1.0.0.md`
```
- WOW.md validated against WOW_requirements_v1.0.0.md
- All 8 tests Green
- Valid as long as references v1.0.0

**BACKLOG.md:**
```markdown
**Requirements:** See `projects/02-initial-workplan/Backlog_register_requirements_v1.0.0.md`
```
- BACKLOG.md validated against Backlog_register_requirements_v1.0.0.md
- Meets requirements for backlog register
- Valid as long as references v1.0.0

**Backlog items:**
```markdown
**Requirements:** See `projects/02-initial-workplan/Backlog_item_requirements_v1.0.0.md`
```
- Each backlog item references same requirements
- All evaluated against consistent criteria
- Valid as long as reference v1.0.0

### Integration with TDC Process

**Step 0 (New):** Identify/Create Requirements Document
- Before defining work item, identify artifact type
- Does requirements document exist for this artifact type?
- If no: create one (use TDC process!)
- If yes: use current version or decide if new version needed

**Step 1:** Define Work Item
- Include requirements reference in work item
- Validation criteria come from requirements document

**Step 2:** Define Validation Criteria
- Use requirements document as source
- Copy relevant criteria or reference them

**Step 3-5:** Create, Validate, Iterate (unchanged)

**Step 6 (New):** Reference Requirements in Artifact
- **Mandatory first line:** requirements reference
- Enables future quality assessment
- Makes validation results meaningful

### Creating Requirements Documents

**Requirements documents are artifacts too!**
- They need requirements (meta-requirements)
- Typically: clear criteria, testable, appropriate granularity
- Created using TDC process
- Evolved based on evidence

**Bootstrap pattern:**
- Create first version while creating first artifact of that type
- Validate both together (twin pair pattern)
- Evolve through usage and lessons learned

**See Project 02 examples:**
- `WOW_requirements_v1.0.0.md` - 8 validation tests
- `Backlog_item_requirements_v1.0.0.md` - 2 mandatory requirements (started complex, simplified to minimal)
- Evolution based on evidence (over-engineering corrected)

## Creating TDC Templates

**Templates for different work types are created using the bootstrap pattern:**
- Don't create templates upfront
- Create while doing the work (explorative project)
- Evolve through real usage and lessons learned

**See:** `projects/01-preliminary-to-workplan/TEMPLATE_GUIDANCE.md` for detailed guidance on creating and evolving TDC templates for different work types.
