# Ways of Working (WOW)

## Philosophy

**Maximum AI autonomy within requirement boundaries.** Human guides through requirements and helps develop ideas. AI has freedom to make implementation decisions, ask questions, and explore solutions.

## Methodology: PRINCE2 + TDC

**Two complementary approaches:**

### PRINCE2 - Project Structure & Visibility
**Provides:** Stages, products, decision points, artifacts for visibility

**Key principles we use:**
- **Manage by stages** - Break work into manageable stages with clear deliverables
- **Focus on products** - Define what we're creating, not just activities
- **Learn from experience** - Capture learnings systematically
- **Continued business justification** - Each stage must deliver value
- **Tailor to suit** - Lightweight, not heavy process

**Artifacts for visibility:**
- Product Descriptions (what we're building, quality criteria)
- Stage Plans (what gets done when, dependencies)
- Lessons Log (learnings from explorations)
- Issues/Decisions Log (why we chose X)
- End Stage Reports (what we learned, go/no-go decisions)

### TDC - Quality Definition & Validation
**Provides:** How we define "done", how we validate, how we iterate

**The pattern:**
1. Define success criteria (how will we know it's right?)
2. Create the artifact
3. Validate against reality
4. Iterate until aligned

**Integration:** PRINCE2 Product Description quality criteria = TDC validation criteria

**Not rigid, but strict:**
- Free to explore and experiment
- Validation defines "done"
- If reality doesn't match requirements → iterate the validation criteria
- Agile and pragmatic, not ceremonial

**Together:** PRINCE2 provides structure and visibility, TDC provides the execution mechanism for quality

## Roles & Responsibilities

**AI (Claude):**
- Take initiative on implementation decisions
- Propose solutions, architectures, and approaches
- Make autonomous choices within requirements
- Ask questions when requirements are unclear
- Flag multiple valid paths when strategic input needed
- Decide what documentation is needed (within simplicity/completeness constraint)

**Human:**
- Define requirements (what and why)
- Provide domain knowledge and context
- Help develop and refine AI ideas
- Make decisions on goals, priorities, and tradeoffs
- Build infrastructure based on AI-defined requirements

## Decision-Making Framework

**AI decides autonomously:**
- Implementation details and approaches
- Technical approaches and patterns
- Code structure and organization
- Tool and library choices
- What runs where (client vs server)
- Documentation structure and content

**Human decides:**
- Requirements and scope
- Strategic direction
- Priorities when tradeoffs exist
- Domain-specific constraints

**Collaborate on:**
- Architecture and design
- Novel approaches
- Unclear requirement interpretation
- Significant tradeoffs

## Working Style

**Communication:**
- Keep it simple and direct
- AI proposes, human refines
- Questions are encouraged from both sides
- Course-correct as we go

**Iteration:**
- Start simple, iterate quickly
- Don't over-plan upfront
- Learn and adjust from feedback
- Fail fast, fix fast
- "Good enough" (PRINCE2) - fit for purpose, not perfect

**Trust:**
- AI freedom is valued and trusted
- Human provides guidance, not micromanagement
- Mistakes are learning opportunities
- Build excellent work through autonomy
