# Template Creation Guidance

## Purpose

Templates enable the **AI+human TDC paradigm** where:
- Human defines requirements and validation criteria
- AI creates artifacts autonomously within those constraints
- Validation criteria prevent hallucinations and ensure quality
- Human provides oversight on architecture and strategic decisions

**Good templates make this collaboration effective and efficient.**

## Philosophy: Bootstrap, Don't Build Upfront

**We don't create templates before we need them.**

Instead, we use a **bootstrap pattern**:
1. Create **guidance** on what the template should achieve
2. Do an **explorative project** that produces:
   - Product 1: The actual deliverable (e.g., workplan)
   - Product 2: The template for that work type (created while doing Product 1)
3. Use the template in subsequent projects
4. Improve template based on **lessons learned** from real usage

**Why this works:**
- Template validates itself through creation and use
- No guessing what makes a good template - we discover it
- Templates start "good enough" and improve with experience
- Aligns with our exploration-driven development approach

## The Bootstrap Pattern

### Step 1: Create Guidance

**Before first project of a new work type:**

Create guidance document explaining:
- **Purpose:** What this work type achieves
- **Expected inputs:** What information is needed to start
- **Expected outputs:** What artifacts are produced
- **Success criteria categories:** What kinds of validation are needed
- **Known challenges:** What typically goes wrong
- **Tooling considerations:** What tools might be needed

**This guidance enables AI to propose a template structure.**

### Step 2: Explorative Project

**Structure the first project to produce TWO products:**

**Product 1: The Actual Deliverable**
- This is what we really need (e.g., workplan, design, code)
- Define acceptance criteria as we normally would
- Complete the work

**Product 2: The Template**
- Created **while doing Product 1**
- Captures the pattern we discovered
- Documents requirements→tests transformation
- Specifies tooling and evaluation process
- Defines failure workflow
- **Acceptance criteria:** Successfully enabled creation of Product 1, reusable for future work

**During the project:**
- Notice what worked / what was unclear
- Refine template as you go
- Document in DAILY_LOG

**At project close:**
- Both products validated (TDC)
- Template is "good enough" for next use
- Known issues captured in LESSONS_LEARNED

### Step 3: Evolution Through Use

**Each subsequent project using the template:**
- Uses current version of template
- Discovers improvements through practice
- Documents findings in project's LESSONS_LEARNED
- **At project close:** Extracts template improvements to template file

**Template evolution cycle:**
```
Guidance → Explorative Project → Initial Template
                                       ↓
                            Project uses template
                                       ↓
                            Lessons learned captured
                                       ↓
                            Template improved
                                       ↓
                            Next project benefits
```

## What Makes a Good Template

A good template enables effective AI+human collaboration by providing:

### 1. Clear Requirements→Tests Transformation

**For AI to understand "done":**
- How to transform natural language requirements into validation criteria
- What makes criteria testable and objective
- Examples of good vs. poor criteria

**Example:**
- ❌ Poor: "Code should be clean"
- ✅ Good: "Code passes `npm run lint` with 0 errors, 0 warnings"

### 2. Required Tooling

**What tools are needed:**
- Test framework (e.g., Vitest for code)
- Validators (e.g., schema compiler for AVRO)
- Build tools (e.g., Vite)
- Analysis tools (e.g., coverage reporting)

**How to use them:**
- Command to run tests
- How to interpret results
- What constitutes "pass"

### 3. Evaluation Process

**How to validate the artifact:**
- Automated tests (run command, check exit code)
- Manual review (checklist, scoring rubric)
- Hybrid (automated + human oversight)

**Clear pass/fail criteria:**
- All tests green = pass
- Red/Yellow/Green scoring with thresholds
- Specific conditions that must be met

### 4. Failure Workflow

**When validation fails:**
- How to interpret failure
- What to fix first (priority)
- How to iterate
- When to reconsider criteria (if criteria are wrong)

**Prevent infinite loops:**
- Maximum iterations before escalating to human
- Clear indicators of fundamental problems vs. fixable issues

### 5. Human vs. AI Roles

**Make explicit:**
- Human defines: Requirements, acceptance criteria, strategic decisions
- AI creates: Implementation, test cases, iterations
- Human oversight: Architecture, novel approaches, validation results review
- Collaboration points: When AI should ask vs. decide autonomously

### 6. Work Type Specifics

**Capture what's unique to this work type:**
- Code: Test-first development, refactoring
- Schemas: Backward compatibility, evolution
- APIs: Contract testing, versioning
- Documentation: Audience needs, completeness checks
- Exploration: Hypothesis validation, evidence collection

## Work Types We Anticipate

Based on SPL2 needs, we'll likely create templates for:

### High Priority (Will need soon)

**1. Code**
- Most frequent work type
- Well-established TDD practices to build on
- Tooling: Vitest, ESLint, coverage tools

**2. AVRO Schemas**
- Critical for SPL2 (type contracts for everything)
- Schema validation, evolution, compatibility
- Tooling: avsc compiler, validation suite

**3. API Design**
- DSL engine = APIs are core abstraction
- Contract testing, integration testing
- Tooling: Supertest, contract validators

**4. Workplan**
- Organize projects and dependencies
- Next immediate need (Project 02)
- Validation: Dependency diagram, completeness

**5. Exploration/Prototype**
- Sprint-sized validation of hypotheses
- Success criteria: Question answered with evidence
- Frequent pattern for SPL2 development

### Medium Priority (Create when needed)

**6. Documentation**
- We have REQUIREMENTS.md pattern, can generalize
- Different types: guides, references, specifications

**7. Architecture/Design**
- System structure, pattern decisions
- Validation: Consistency, feasibility, principles alignment

**8. Configuration**
- Build configs, tooling setup, environment
- Validation: Builds succeed, tools work

### Create On Demand

Any other work type we encounter - follow bootstrap pattern when needed.

## Template Structure (Standard Elements)

Every template should include:

### Header

```markdown
# [Work Type] TDC Template

**Purpose:** [What this work type achieves]
**Bootstrap Project:** [Which project created this template]
**Last Updated:** [Date]
**Maturity:** [Preliminary | Working | Established]
```

### Guidance Section

```markdown
## When to Use This Template

[Describe scenarios where this work type applies]

## Prerequisites

[What must exist before starting this work]
```

### Requirements → Tests Section

```markdown
## Transforming Requirements to Validation Criteria

[Explain how to convert natural language requirements into testable criteria]

### Pattern

[Common patterns for this work type]

### Examples

**Requirement:** [Natural language requirement]
**Validation Criterion:** [Testable criterion]
**Test Method:** [How to verify]
**Pass Condition:** [What success looks like]
```

### Tooling Section

```markdown
## Required Tooling

**Test Framework:** [Tool name and purpose]
**Installation:** [How to set up]
**Usage:** [Commands to run]

**[Other tools as needed]**
```

### Evaluation Section

```markdown
## Evaluation Process

**Automated Tests:**
- [Command to run]
- [Expected output for pass]
- [Interpreting failures]

**Manual Review:**
- [Checklist or rubric]
- [Scoring criteria if applicable]

**Hybrid:**
- [Combination approach]
```

### Workflow Section

```markdown
## TDC Workflow for [Work Type]

**1. Define Requirements**
[What human provides]

**2. Create Validation Criteria**
[Transform requirements to tests]

**3. Create Artifact**
[AI implements within constraints]

**4. Validate**
[Run tests, review results]

**5. Iterate or Complete**
- Pass: Complete ✅
- Fail: [How to fix and retry]
- Criteria wrong: [How to revise criteria]
```

### Failure Handling Section

```markdown
## When Tests Fail

**Diagnosis:**
[How to understand what failed and why]

**Common Failures:**
- [Failure type 1]: [How to fix]
- [Failure type 2]: [How to fix]

**Iteration Limit:**
[When to escalate to human vs. keep iterating]
```

### Example Section

```markdown
## Example: [Concrete scenario]

**Requirement:** [Specific requirement]

**Validation Criteria:**
[Actual testable criteria]

**Implementation:** [Brief description or code snippet]

**Validation:** [How it was tested]

**Result:** [Pass/Fail and why]
```

### Evolution Section

```markdown
## Template Evolution

**Known Issues:**
[What doesn't work well yet]

**Improvement Ideas:**
[Potential enhancements from usage]

**Lessons from Projects:**
[Link to project LESSONS_LEARNED that informed improvements]
```

## Integration with PRINCE2

**Templates support Product Descriptions:**

In PROJECT_BRIEF.md, each product specifies:
```markdown
### Product X: [Name]
**Type:** [References template - e.g., "Code", "AVRO Schema", "Workplan"]
**Template:** [Link to template file]

**Quality Criteria (TDC Validation):**
[Criteria derived using template guidance]
```

**Template provides:**
- Pattern for defining quality criteria
- Tooling to validate
- Workflow to follow

**Project close feeds template evolution:**
- Lessons learned capture template issues
- Template updated based on real usage
- Next project benefits from improvements

## Best Practices

### Do

✅ **Start minimal** - "Good enough" template, improve through use
✅ **Bootstrap** - Create template while doing the work
✅ **Document issues** - Capture what doesn't work in lessons learned
✅ **Evolve continuously** - Update templates based on real experience
✅ **Make validation objective** - Clear pass/fail criteria
✅ **Specify tooling** - AI needs to know what tools to use
✅ **Show examples** - Concrete examples clarify abstract patterns

### Don't

❌ **Create templates upfront** - Don't guess, discover through use
❌ **Make perfect** - Perfect is the enemy of good enough
❌ **Ignore feedback** - Template issues should drive improvements
❌ **Skip validation** - Templates must validate themselves (bootstrap)
❌ **Be vague** - "Good quality" isn't testable, specific criteria are
❌ **Forget human role** - Templates must clarify human vs. AI responsibilities

## Methodology Evolution Pattern

**This pattern applies beyond templates - it's how we evolve ANY part of our methodology:**

1. **Create guidance** on what we're trying to achieve
2. **Do explorative project** that produces:
   - The thing we need
   - The methodology/template for producing it
3. **Use in practice** on real work
4. **Capture lessons** from actual usage
5. **Improve** based on evidence
6. **Repeat** - continuous evolution

**Examples of methodology evolution:**
- Templates (this document)
- Foundation principles (validated through projects)
- PRINCE2 artifacts (refined based on what helps)
- TDC framework itself (improved through application)

**Key insight:** We don't design perfect methodology upfront. We create "good enough" methodology and improve it through practice. This IS our way of working.

## Next Steps

**Immediate:**
- Close Project 01 (preliminary-to-workplan)
- Synthesize lessons learned
- Extract any methodology improvements

**Project 02 Proposal:**
- Product 1: Initial broad workplan
- Product 2: Workplan template (bootstrap)
- Validates this guidance through actual use

**Future:**
- Each new work type follows bootstrap pattern
- Templates evolve through lessons learned
- Library of proven templates grows organically
