# Continual Improvement Proposal (CIP) Register

**Project:** 02-initial-workplan
**Last Updated:** 2025-11-08

Lightweight capture of improvement ideas that emerge during project work. CIPs are reviewed during planning cycles and either implemented, deferred, or rejected based on priority and dependencies.

---

## Active CIPs

### CIP-000: Document CIP Register in Methodology

**Type:** Methodology/Process
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Project 02 - discovery during work
**Date Captured:** 2025-11-08

**Description:**
Add CIP Register to PRINCE2_WOW.md as a standard living artifact. Document:
- Purpose: Lightweight idea capture following ITIL Continual Improvement practice
- When to use: Projects capture CIPs as ideas emerge
- Integration with project close: CIP maintenance as part of closure process
- Workflow: Capture → Review → Assess → Implement/Defer/Reject

**Rationale:**
CIP Register proves useful in Project 02 for capturing improvement ideas. Should be formalized in methodology so future projects can use it. Aligns with ITIL Continual Improvement practice.

**Additional consideration:**
Add "CIP Maintenance" to project close process in PRINCE2_WOW.md:
- Review project CIPs
- Update CIP status
- Promote relevant CIPs to global register
- Close implemented CIPs with outcomes
- Follows pattern of projects being responsible for maintenance (foundations, CIPs)

**Next Steps:**
- Assess during Product 5 (Dependency & Priority Analysis)
- Could be part of Product 2 (Foundation Update Methodology) scope
- Or separate quick update to PRINCE2_WOW.md

---

### CIP-001: Product Register for Project Tracking

**Type:** Process/Tool
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Project 02 discussion
**Date Captured:** 2025-11-08

**Description:**
Create a Product Register as a living artifact for projects with multiple products (especially explorative projects with twin pairs). Would provide:
- Status tracking for all products at a glance
- Visibility of twin pair progression (are we maintaining parallelism?)
- Quality criteria status per product
- Dependencies between products
- Progress monitoring

**Rationale:**
Project 02 has 8 products in 4 twin pairs. Tracking becomes important at this scale. Would help ensure we maintain parallel creation methodology and don't fall into sequential mode.

**Considerations:**
- Where does it fit? (PRINCE2_WOW.md artifact, or ad-hoc as needed?)
- Template creation? (Could be twin pair: Product Register + Product Register Template)
- Integration with existing artifacts (DAILY_LOG, project brief)

**Next Steps:**
- Assess during Product 5 (Dependency & Priority Analysis)
- Decide: include in Project 02 scope, or defer to future project

---

### CIP-002: Lightweight ITIL Implementation

**Type:** Methodology
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Project 02 discussion
**Date Captured:** 2025-11-08

**Description:**
Implement lightweight ITIL practices aligned with SPL2 principles. Potential areas:
- **Service Catalog:** What capabilities SPL2 provides (APIs, DSLs, tools)
- **Change Management:** How we evolve foundations, APIs, methodology (we have some of this)
- **Knowledge Management:** Lessons learned, findings, templates (already doing this)
- **Problem Management:** Pattern identification from issues
- **Configuration Management:** Track dependencies, versions, compatibility
- **CIP Register itself:** Following ITIL Continual Improvement practice

**Rationale:**
We're already doing ITIL-ish things (living artifacts, foundation maintenance, lessons learned). Formalizing with ITIL structure could improve organization and reusability. Aligns well with our systematic approach.

**Considerations:**
- Keep lightweight (not heavy ITIL bureaucracy)
- Align with PRINCE2+TDC methodology
- What ITIL practices provide most value for SPL2?
- Integration points with existing methodology

**Next Steps:**
- Research ITIL 4 practices (which are most relevant?)
- Assess during Product 5 (Dependency & Priority Analysis)
- Potential exploration project: "Lightweight ITIL for SPL2"

---

## Implemented CIPs

*(None yet)*

---

## Rejected CIPs

*(None yet)*

---

## CIP Workflow

**Capture:**
- Idea emerges during work
- Create CIP entry (title, description, type, source)
- Status: Captured
- No detailed analysis at capture time

**Review:**
- At project close: review project's CIPs
- During planning cycles: assess captured CIPs
- Dependency & Priority Analysis: evaluate against other work

**Decision:**
- Implement: Move to planned work (workplan or specific project)
- Defer: Leave in Active CIPs for future consideration
- Reject: Move to Rejected CIPs with rationale

**Close:**
- When implemented: Move to Implemented CIPs
- Document outcome and lessons learned

---

## Notes

- CIPs are lightweight - capture quickly, analyze later
- Not every idea becomes a CIP (use judgment)
- CIP Register reviewed during project close
- Relevant CIPs promoted to global CIP Register (when it exists)
- This project-level register is template for future global register
