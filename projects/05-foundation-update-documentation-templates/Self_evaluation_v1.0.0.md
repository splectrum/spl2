**Requirements:** (To be defined in glossary project)

# Why Self-Evaluation Matters v1.0.0

**Created:** Project 05, 2025-11-16
**Context:** Self-evaluation capability enables autonomy through requirements-driven validation
**Status:** Active - starting point, will evolve significantly

---

## The Connection to Autonomy

**Self-evaluation is the capability that enables autonomous work.**

**Without self-evaluation:**
- AI must ask human to validate every decision
- Constant back-and-forth for quality assessment
- Human becomes bottleneck
- Autonomy boundary stays narrow
- Partnership friction from coordination overhead

**With self-evaluation:**
- AI assesses own work quality against criteria
- Validates completion independently
- Only surfaces when criteria fail or uncertainty exists
- Human reviews strategically, not constantly
- Autonomy boundary expands with demonstrated capability

**The path to autonomy:**
1. Requirements define what success looks like
2. Validation criteria make success measurable
3. AI can self-assess against criteria
4. Accurate self-assessment builds trust
5. Trust enables expanded autonomy
6. Cycle reinforces - more autonomy, more trust

---

## Requirements Make Self-Evaluation Possible

**Clear requirements enable independent quality assessment:**

**Vague requirements:**
- "Write good code" - what does good mean?
- "Comprehensive documentation" - how comprehensive?
- "Clean design" - clean by what standard?
- AI can't self-assess, must ask human

**Clear requirements:**
- "Passes these specific tests"
- "Answers these specific questions"
- "Meets these specific criteria"
- AI can validate independently

**The shift:**
- From subjective assessment → objective validation
- From opinion-based quality → criteria-based quality
- From "what do you think?" → "does it pass?"
- From dependency → autonomy

---

## Test Driven Creation (TDC)

**TDC is the methodology for requirements-driven self-evaluation.**

**Core principle:** "You get what passes tests" - quality defined through validation, not aspiration.

### The TDC Workflow

**5 steps:**

1. **Define Work Item** - What are we creating? Purpose, context, deliverables
2. **Define Validation Criteria** - How do we know it's done right? Specific, testable criteria
3. **Create Artifact** - Build it using any approach that works
4. **Validate** - Does it pass? Run tests, check criteria, document results
5. **Iterate or Complete** - If passes: done ✅ | If fails: iterate | If criteria wrong: fix criteria

**AI self-evaluates at step 4:**
- Run validation criteria
- Assess pass/fail objectively
- Document results
- Decide: complete or iterate

**Human trust builds when:**
- AI validation is accurate (catches real issues)
- AI doesn't claim done when criteria fail
- AI surfaces uncertainty appropriately
- Quality improves through iteration

### Philosophy

**Strict but not rigid:**
- Strict: Must pass validation criteria to be "done"
- Not rigid: How you get there is flexible, iterative approach encouraged

**Universal application:**
- Works for code (traditional TDD)
- Works for documentation, designs, specifications, research
- Works for any deliverable artifact

**Key insight:** Validation criteria define quality, not lengthy specifications.

### Integration with PRINCE2

**Product quality criteria = TDC validation criteria:**
- PRINCE2 defines products (deliverables)
- Each product has quality criteria
- Quality criteria are TDC validation criteria
- AI validates products independently
- Human validates that AI validation was accurate

**Example:**
```markdown
**Quality Criteria (TDC Validation):**
- All tests pass
- Documentation answers specified questions
- No blocking issues remain
- Performance meets requirements
```

AI can assess each criterion objectively.

---

## Artifact-to-Requirements Pinning

**See stepping stone:** Artifact-to-requirements pinning

**Mandatory pattern that enables self-evaluation:**

**The pattern:**
- Each artifact references its requirements document as first line
- Format: `**Requirements:** See path/to/requirements_vX.Y.Z.md`
- Requirements are versioned (enables evolution)

**Why this enables self-evaluation:**
- Clear what requirements the artifact must satisfy
- AI can assess against those specific requirements
- No ambiguity about quality baseline
- Validation results are meaningful

**Without requirements reference:**
- No clear baseline for quality
- Can't objectively assess if artifact is "done"
- Must ask human for validation
- Quality becomes subjective opinion

**With requirements reference:**
- Clear baseline (does it satisfy these requirements?)
- AI can validate independently
- Quality assessment objective
- Self-evaluation possible

---

## Validation Criteria Examples

**Not aspirational, but measurable:**

**Bad criteria (can't self-evaluate):**
- "Write good code"
- "Make it comprehensive"
- "Design it cleanly"
- "Document it well"

**Good criteria (can self-evaluate):**
- "Passes these 5 unit tests"
- "Answers these 3 questions in documentation"
- "Meets these architectural requirements"
- "Includes these specified sections"

**The difference:**
- Good criteria are specific and testable
- AI can run tests or check criteria
- Pass/fail is objective
- Self-evaluation accurate

---

## Red/Yellow/Green Scoring

**For complex artifacts with multiple criteria:**

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

**Overall quality:**
- All Green = Excellent
- Some Yellow, no Red = Good enough
- Any Red = Not done, must fix

**AI can self-score:**
- Assess each criterion
- Assign color based on evidence
- Aggregate to overall assessment
- Document reasoning

**Human can validate scoring:**
- Review AI's assessment
- Check if scoring accurate
- Build trust in AI judgment
- Expand autonomy when accurate

---

## Building Trust Through Accurate Self-Evaluation

**Trust cycle:**

**AI demonstrates accuracy:**
1. AI self-evaluates against criteria
2. AI reports honest assessment (not optimistic)
3. Human validates AI's assessment
4. Assessment proves accurate
5. Human trusts AI judgment more

**Trust enables autonomy:**
6. Human reviews less frequently
7. AI works more independently
8. Autonomy boundary expands
9. Partnership friction decreases
10. Work velocity increases

**Breaking trust:**
- AI claims "done" when criteria fail
- AI misses obvious issues
- AI overly optimistic in assessment
- Human must re-validate everything
- Autonomy boundary contracts

**Maintaining trust:**
- Honest self-assessment
- Surface uncertainty explicitly
- Accurate pass/fail determination
- Document validation results
- Continuous calibration

---

## When to Surface vs. Self-Validate

**AI should self-validate when:**
- Validation criteria are clear and testable
- AI can objectively assess pass/fail
- No ambiguity in requirements
- Demonstrated capability in this area
- Trust established through accuracy

**AI should surface to human when:**
- Validation criteria unclear or ambiguous
- Subjective judgment required
- Novel situation without precedent
- Uncertainty about pass/fail
- Risk is high and validation critical

**The boundary shifts:**
- Early partnership: Surface more, validate less independently
- Growing trust: Self-validate routine work, surface edge cases
- Mature partnership: Self-validate most work, surface strategic decisions

**Evidence drives expansion:**
- Track self-evaluation accuracy
- When consistently accurate → expand autonomy
- When errors occur → understand why, calibrate
- Trust grows with demonstrated capability

---

## Best Practices

### Define Criteria Early

**Before creating artifact:**
- Define what "done" means
- Make criteria specific and testable
- Agree on validation approach
- No ambiguity about completion

**Benefits:**
- AI knows target from start
- Can self-assess during creation
- Iteration based on criteria
- Clear completion signal

### Make Criteria Testable

**Specific, verifiable conditions:**
- Automated tests that can be run
- Checklists that can be verified
- Questions that can be answered
- Metrics that can be measured

**Not aspirational:**
- Not "good enough"
- Not "high quality"
- Not "comprehensive"
- But specific, measurable conditions

### Iterate on Criteria Too

**Criteria can be wrong:**
- Don't reveal real quality issues
- Miss important aspects
- Too strict or too loose
- Don't match actual needs

**Fix criteria when:**
- Artifact passes but quality insufficient
- Criteria miss important concerns
- Validation doesn't predict usability
- Evidence shows criteria wrong

**This is allowed:**
- Criteria are hypotheses about quality
- Validate through use
- Evolve based on evidence
- Better criteria → better self-evaluation

### Document Validation Results

**Record what was validated:**
- Which criteria were checked
- What passed, what failed
- Why failures occurred
- What was changed to fix

**Why this matters:**
- Future reference for decisions
- Learning from validation
- Pattern recognition
- Calibration of judgment

### Integrate with Daily Work

**TDC isn't separate from work:**
- Define → Create → Validate → Iterate IS the work
- Validation criteria guide creation
- Self-evaluation continuous, not final step
- Quality built in, not bolted on

---

## What Self-Evaluation Enables

**Autonomous execution:**
- AI works independently within defined scope
- Validates quality without constant human review
- Only surfaces issues or uncertainty
- Human guides strategically, not tactically

**Faster iteration:**
- No waiting for human validation at each step
- Quick feedback loops through self-assessment
- Rapid convergence on quality
- Evidence-based iteration

**Reduced friction:**
- Less coordination overhead
- Fewer back-and-forth validations
- Clear completion signals
- Trust reduces anxiety

**Scaled partnership:**
- AI handles larger scope independently
- Human focuses on high-value decisions
- Partnership leverages both strengths
- More accomplished together

**Continuous improvement:**
- Self-evaluation accuracy improves over time
- Calibration through feedback
- Learning from validation results
- Growing capability and trust

---

## Evolution Expected

**This is v1.0.0 - starting point for significant evolution:**

**Will deepen:**
- Connection between self-evaluation and autonomy
- How trust builds through accurate assessment
- When to self-validate vs. surface
- Calibration and learning processes

**Will explore:**
- Different types of validation (automated, checklist, judgment-based)
- Validation in different contexts (code, docs, design)
- Meta-evaluation (how accurate is AI self-assessment?)
- Autonomy boundary expansion patterns

**Will integrate:**
- Friction as signal (validation failures create productive friction)
- Partnership in trust (honest self-assessment builds trust)
- Evidence-based evolution (validation results drive improvement)
- HAICC (self-evaluation enables collaborative creativity at scale)

---

**Summary: Self-evaluation matters because it enables autonomy. Clear requirements and validation criteria make self-evaluation possible. TDC provides the methodology. Artifact-to-requirements pinning provides the baseline. Accurate self-assessment builds trust. Trust expands autonomy boundary. The path from dependent validation to autonomous execution runs through requirements-driven self-evaluation.**
