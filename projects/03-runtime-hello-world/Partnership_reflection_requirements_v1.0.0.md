# Partnership Reflection Requirements

**Version:** 1.0.0
**Created:** 2025-11-12
**Purpose:** Define requirements for partnership reflection process - mandatory closure activity for methodology health assessment and improvement

---

## What is Partnership Reflection?

**Partnership Reflection** is a mandatory project closure activity for assessing and improving the human-AI collaboration:

**Characteristics:**
- **Health assessment** - Current state of collaboration, methodology, patterns
- **Evidence-based** - Grounded in actual project experience
- **Frank and honest** - Safe space for identifying what works and what doesn't
- **Actionable** - Produces concrete recommendations and improvements
- **Continuous improvement** - Regular fixture (like sprint retrospective)

**Why Mandatory:**
- Methodology only improves through systematic reflection
- Prevents silent accumulation of friction/inefficiencies
- Identifies "local rules" gaps where clearer requirements would help
- Maintains partnership health over time
- Evidence-based evolution of collaboration patterns

---

## When It Occurs

**Timing:** Project closure (mandatory closure activity per PRINCE2_operational)

**Trigger:** After project deliverables complete, before final commit

**Frequency:** Every project closure (not skippable)

**Emergency Updates:** foundations/PARTNERSHIP.md can be updated between reflections if critical partnership issues emerge, but this should be rare

---

## Three-Artifact Structure

Partnership reflection produces three artifacts with distinct purposes:

### 1. PARTNERSHIP_REFLECTION.md (Project Folder)

**Location:** `projects/[XX-project-name]/PARTNERSHIP_REFLECTION.md`

**Created by:** AI (Claude) during project closure

**Purpose:** Detailed snapshot of partnership health at project completion

**Immutability:** Never modified after creation (historical record)

**Required Content:**
1. **What's Working Exceptionally Well**
   - Collaboration patterns that are effective
   - Methodology elements providing value
   - Patterns worth continuing/amplifying

2. **What's Impressive About Human Approach**
   - Meta-awareness, course correction, balance
   - Human strengths in the partnership
   - What makes collaboration effective

3. **Risks Identified**
   - Concerns about current trajectory
   - Potential problems if unaddressed
   - Quantified where possible (ratios, counts, trends)
   - Priority/severity assessment

4. **What AI Finds Challenging**
   - Areas where AI lacks clear guidance ("local rules" gaps)
   - Judgment calls that cause uncertainty
   - Gaps in requirements/criteria
   - Not complaints - identification of where requirements would help

5. **User Response** (if provided before reflection document creation)
   - Human's perspective on AI feedback
   - Additional context or clarification
   - Partnership philosophy statements

6. **Action Items** (if drafted by AI)
   - Organized by priority
   - Concrete, actionable recommendations
   - May be revised during review discussion

**Tone:** Frank, honest, objective. Safe space for identifying problems without fear.

**Quality Criteria:**
- Grounded in project evidence (reference specific examples)
- Balanced (acknowledges what works AND what doesn't)
- Actionable (identifies specific problems, not vague concerns)
- Quantified where possible (ratios, counts, trends)
- Clear about gaps vs complaints

---

### 2. PARTNERSHIP_REFLECTION_REVIEW.md (Project Folder)

**Location:** `projects/[XX-project-name]/PARTNERSHIP_REFLECTION_REVIEW.md`

**Created by:** Human + AI during review discussion

**Purpose:** Detailed record of review discussion, decisions, and actions taken

**Immutability:** Never modified after creation (historical record)

**Required Content:**
1. **Items Addressed**
   - Each item from reflection document
   - Discussion summary for each
   - Decision/action taken

2. **Recommendations for Change**
   - Concrete methodology improvements
   - New "local rules" requirements identified
   - Foundation updates needed
   - CIPs created for partnership improvements

3. **Actions Taken Immediately**
   - Changes made during review
   - Documents updated
   - CIPs added to register

4. **Deferred Actions**
   - Actions identified but deferred (with rationale)
   - Backlog items created
   - Follow-up timing

5. **Partnership Health Assessment**
   - Overall health status
   - Trajectory (improving/stable/declining)
   - Critical concerns requiring immediate attention

**Process Requirements:**
- Must address EVERY item raised in reflection document
- Decisions must be explicit (not "we discussed X")
- Rationale documented for deferrals
- Clear ownership for follow-up actions

**Quality Criteria:**
- Complete coverage (nothing from reflection ignored)
- Decisions documented with rationale
- Action items specific and assigned
- Partnership health assessment honest and clear

---

### 3. foundations/PARTNERSHIP.md (Foundation)

**Location:** `foundations/PARTNERSHIP.md`

**Created/Updated:** After partnership reflection review

**Purpose:** Current partnership health state (headline only)

**Style:** Headline document (like WOW.md, PRINCIPLES.md) - concise, current, references detail

**Mutability:** Updated after each reflection → review (living document)

**Required Content:**
1. **Current Partnership Health**
   - Overall health status (one paragraph max)
   - Trajectory statement

2. **Active Concerns**
   - Current partnership issues being addressed
   - Critical gaps in "local rules"
   - Risks under monitoring

3. **Recent Improvements**
   - Latest changes to collaboration patterns
   - Newly established "local rules"
   - Risk mitigations implemented

4. **References**
   - Link to versioned detail files if needed (rare)
   - Link to most recent reflection documents
   - Link to partnership-related CIPs

**Quality Criteria:**
- One page maximum (headline style)
- Current state only (not historical)
- Clear and concise
- References detail rather than including it
- Updated after each reflection → review

**Initial State:** May not exist until first partnership reflection (Project 03)

---

## Review Process Requirements

**When:** After PARTNERSHIP_REFLECTION.md created, before project final commit

**Participants:** Human + AI (collaborative discussion)

**Duration:** As long as needed to address all items

**Process:**
1. **Preparation:**
   - AI creates PARTNERSHIP_REFLECTION.md
   - Human reviews before discussion

2. **Discussion:**
   - Go through reflection item by item
   - Human + AI dialogue on each point
   - Identify actions, recommendations, decisions

3. **Documentation:**
   - Create PARTNERSHIP_REFLECTION_REVIEW.md during discussion
   - Capture decisions and rationale
   - Document actions taken/deferred

4. **Improvements:**
   - Make immediate changes (methodology updates, new requirements)
   - Create CIPs for partnership improvements
   - Update foundations/PARTNERSHIP.md

5. **Closure:**
   - Verify all reflection items addressed
   - Commit review document and any changes
   - Partnership reflection complete

**Collaboration Mode:** Fully collaborative (human + AI working together)

---

## Integration with Other Processes

### PRINCE2 Closure Process

Partnership reflection is **Step 3.7** in closure process (mandatory):
- Follows: Products evaluated, lessons synthesized, foundations updated, CIP/backlog grooming
- Precedes: Final commit and push
- Cannot close project without completing partnership reflection

### CIP Process

Partnership improvements can become CIPs:
- **When:** If improvement requires design, experimentation, or deferred implementation
- **Type:** Partnership/methodology CIPs (not just product features)
- **Examples:**
  - "CIP-009: Define documentation-to-code ratio threshold"
  - "CIP-010: Create commit message depth requirements"
  - "CIP-011: Establish granularity judgment criteria"

CIPs added to main CIP Register (no separate partnership registry)

### Foundation Updates

Partnership reflection can trigger foundation updates:
- Small updates: Do immediately during review
- Large updates: Create backlog item/project
- Always update foundations/PARTNERSHIP.md

### "Local Rules" Creation

Partnership reflection is PRIMARY mechanism for identifying "local rules" gaps:
- AI identifies areas where clearer requirements would help
- Review discussion decides which gaps to fill (TDC approach)
- Create requirements documents for validated needs
- Pattern: Identify gap → Validate need → Create requirement

---

## Success Criteria

A partnership reflection succeeds when:

1. **Honest Assessment**
   - Frank identification of what works and what doesn't
   - Balanced view (not just positives or negatives)
   - Grounded in evidence from project

2. **Complete Coverage**
   - All items from reflection addressed in review
   - No critical concerns ignored or deferred without rationale
   - Partnership health honestly assessed

3. **Actionable Outcomes**
   - Concrete recommendations produced
   - Actions taken or explicitly deferred with rationale
   - Clear next steps identified

4. **Methodology Improvement**
   - New "local rules" identified or created
   - CIPs for partnership improvements as needed
   - Foundation PARTNERSHIP.md updated

5. **Partnership Health Maintained**
   - Issues surfaced and addressed
   - Friction points identified and mitigated
   - Collaboration patterns optimized

**Not measured by:**
- Zero problems identified (healthy to find problems)
- All actions completed immediately (deferral with rationale is valid)
- Perfect partnership (continuous improvement expected)

---

## Artifact Requirements Summary

**PARTNERSHIP_REFLECTION.md:**
- Must reference these requirements (first line)
- Created by AI during closure
- Detailed, immutable, project folder
- Required sections: What works, risks, challenges, user response, action items

**PARTNERSHIP_REFLECTION_REVIEW.md:**
- Must reference these requirements (first line)
- Created during human + AI review discussion
- Detailed, immutable, project folder
- Must address every reflection item

**foundations/PARTNERSHIP.md:**
- Must reference these requirements (first line)
- Headline style (one page max)
- Current state only (living document)
- Updated after each reflection → review

---

## Related Artifacts

- PRINCE2_operational_v1.2.0: Defines closure process including partnership reflection
- TDC_framework_v1.1.0: Artifact-to-requirements pinning
- Philosophy_v1.1.0: Evidence-based evolution, continuous improvement
- CIP_REGISTER.md: Partnership improvement CIPs tracked here

---

## Version History

**v1.0.0 (2025-11-12):**
- Initial requirements
- Three-artifact structure established
- Integration with PRINCE2 closure process
- CIP integration for partnership improvements
- "Local rules" gap identification mechanism

---

*These requirements define partnership reflection as systematic mechanism for maintaining and improving human-AI collaboration quality over time.*
