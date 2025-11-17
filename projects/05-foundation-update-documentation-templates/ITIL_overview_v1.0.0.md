**Requirements:** (To be defined in glossary project)

# ITIL Overview v1.0.0

**Created:** Project 05, 2025-11-16
**Context:** Pure ITIL reference for future service management approach
**Status:** Reference - not yet adapted for SPL2, placeholder for future development

---

## What is ITIL?

**ITIL (Information Technology Infrastructure Library)** is a framework for IT service management (ITSM) that focuses on aligning IT services with business needs through structured processes for service delivery, support, and continuous improvement.

**Core philosophy:**
- Services are ongoing, not one-time deliveries
- Quality defined by service value to users
- Continuous improvement through feedback and metrics
- Structured processes for managing change and incidents
- Balance between stability and responsiveness

**ITIL vs. PRINCE2:**
- PRINCE2: Project management (building things, delivering products)
- ITIL: Service management (running things, operating services)
- PRINCE2: Finite lifecycle (initiate, execute, close)
- ITIL: Continuous lifecycle (operate, improve, evolve)

---

## ITIL Service Lifecycle

### 1. Service Strategy

**Define what services to offer and why:**
- Understanding customer needs and market
- Defining value proposition for services
- Financial management for IT services
- Service portfolio management
- Demand management

**Key questions:**
- What services should we offer?
- Who are our customers and what do they value?
- How do we differentiate our services?
- How do we fund and price services?
- What's our strategy for growth and change?

### 2. Service Design

**Design services and supporting processes:**
- Service catalog management (what services exist)
- Service level management (what quality/availability promised)
- Capacity management (can we deliver at required scale)
- Availability management (uptime, resilience)
- IT service continuity management (disaster recovery)
- Information security management
- Supplier management

**Key outputs:**
- Service design packages
- Service level agreements (SLAs)
- Operational level agreements (OLAs)
- Architecture and design documentation

### 3. Service Transition

**Build, test, and deploy new or changed services:**
- Change management (controlled, assessed changes)
- Service asset and configuration management (CMDB)
- Release and deployment management
- Service validation and testing
- Knowledge management
- Transition planning and support

**Key processes:**
- Change evaluation (assess impact and risk)
- Change authorization (approve/reject changes)
- Change implementation (execute changes)
- Post-implementation review (did it work?)

### 4. Service Operation

**Day-to-day running of services:**
- Incident management (restore service quickly when broken)
- Problem management (find root causes, prevent recurrence)
- Event management (detect and respond to events)
- Request fulfillment (handle service requests)
- Access management (rights and permissions)

**Key activities:**
- Monitoring and alerting
- First-line support
- Escalation procedures
- Service desk operations
- Technical management

### 5. Continual Service Improvement (CSI)

**Ongoing improvement of services:**
- Seven-step improvement process
- Service measurement and metrics
- Return on investment analysis
- Service reporting
- Identifying improvement opportunities
- Implementing improvements

**CSI approach:**
1. What is the vision? (strategic goals)
2. Where are we now? (baseline assessment)
3. Where do we want to be? (measurable targets)
4. How do we get there? (improvement plan)
5. Did we get there? (measurement and metrics)
6. How do we keep the momentum going? (embed improvements)

---

## Key ITIL Processes

### Change Management

**Controlling changes to minimize risk and disruption:**

**Change types:**
- **Standard changes:** Pre-approved, low risk, routine (e.g., password reset)
- **Normal changes:** Require evaluation and authorization (e.g., infrastructure upgrade)
- **Emergency changes:** Urgent, expedited approval process (e.g., security patch)

**Change process:**
1. Request for Change (RFC) raised
2. Change evaluation (impact, risk, resource requirements)
3. Change authorization (approve/reject based on evaluation)
4. Change implementation (execute the change)
5. Change review (post-implementation review)

**Change Advisory Board (CAB):**
- Reviews and authorizes significant changes
- Assesses change schedule and conflicts
- Provides expertise on impact assessment

### Incident Management

**Restore normal service operation as quickly as possible:**

**Key concepts:**
- Incident: Unplanned interruption or reduction in service quality
- Priority: Based on impact (how many affected) and urgency (how quickly must it be fixed)
- Workaround: Temporary solution to restore service
- Resolution: Permanent fix

**Incident lifecycle:**
1. Detection and recording
2. Classification and prioritization
3. Investigation and diagnosis
4. Resolution and recovery
5. Closure
6. Post-incident review (for major incidents)

**Major incidents:**
- Highest priority
- Separate procedure with dedicated resources
- Senior management involvement
- Communication plan for stakeholders

### Problem Management

**Find and fix root causes to prevent recurring incidents:**

**Problem vs. Incident:**
- Incident: Symptom (service is down)
- Problem: Root cause (why service went down)
- Known error: Problem with documented workaround

**Problem management activities:**
1. Problem detection (pattern of incidents, proactive analysis)
2. Problem investigation (root cause analysis)
3. Workaround identification (temporary fix)
4. Known error database (document for future incidents)
5. Problem resolution (permanent fix via RFC)
6. Problem closure

**Proactive problem management:**
- Trend analysis of incidents
- Review of technical debt
- Supplier/vendor management
- Continuous improvement initiatives

### Service Level Management

**Ensure agreed service levels are met:**

**Key documents:**
- **SLA (Service Level Agreement):** Agreement with customer on service quality
- **OLA (Operational Level Agreement):** Internal agreement supporting SLA
- **UC (Underpinning Contract):** External supplier contract supporting SLA

**SLA metrics examples:**
- Availability (uptime percentage)
- Performance (response time, throughput)
- Reliability (mean time between failures)
- Support (response and resolution times)

**SLA lifecycle:**
1. Define service requirements
2. Negotiate and agree SLA
3. Monitor service performance
4. Report on SLA achievement
5. Review and revise SLA

### Configuration Management

**Maintain information about IT assets and their relationships:**

**Configuration Management Database (CMDB):**
- Central repository of IT assets (configuration items)
- Relationships between CIs
- Version and change history
- Supports impact analysis for changes

**Configuration Item (CI) examples:**
- Hardware (servers, network equipment)
- Software (applications, licenses)
- Documentation
- Services
- People (roles and responsibilities)

**Key activities:**
- Configuration identification
- Configuration control
- Status accounting (current state)
- Verification and audit

### Knowledge Management

**Capture and share knowledge to improve efficiency:**

**Knowledge Management System (KMS):**
- Service knowledge management system
- Contains solutions, workarounds, documentation
- Fed by incident resolution, problem management
- Accessed by service desk, technical teams

**Knowledge artifacts:**
- Known error database
- Service documentation
- FAQs and troubleshooting guides
- Lessons learned
- Best practices

---

## ITIL Roles and Functions

### Service Desk

**Single point of contact for users:**
- Log incidents and service requests
- First-line resolution where possible
- Escalate to specialist teams
- Keep users informed
- Close resolved incidents

**Service desk models:**
- Local service desk (on-site)
- Centralized service desk (single location)
- Virtual service desk (distributed, appears centralized)
- Follow-the-sun (24/7 across time zones)

### Technical Management

**Custodian of technical knowledge and expertise:**
- Maintain technical infrastructure
- Support service lifecycle processes
- Provide technical expertise for problem resolution
- Design and maintain technical architecture

### Application Management

**Manage applications throughout lifecycle:**
- Application development (build new, enhance existing)
- Application support (maintain, troubleshoot)
- Performance optimization
- Integration management

### IT Operations Management

**Day-to-day operational activities:**
- IT operations control (monitoring, job scheduling)
- Facilities management (data centers, power, cooling)
- Operations bridge (24/7 monitoring and initial response)

---

## Key ITIL Principles

### 1. Focus on Value

**Every service, process, and activity should create value:**
- Value defined by customer, not provider
- Balance cost with quality
- Optimize for outcomes, not outputs

### 2. Design for Experience

**Consider end-to-end user experience:**
- User journey mapping
- Touchpoint optimization
- Service design thinking
- Customer-centric approach

### 3. Start Where You Are

**Don't start from scratch unnecessarily:**
- Assess current state honestly
- Reuse what works
- Evolve incrementally
- Build on existing strengths

### 4. Work Holistically

**Services are systems, components interact:**
- Consider dependencies
- Avoid siloed thinking
- Integrate processes
- Collaborate across teams

### 5. Progress Iteratively

**Incremental improvement with feedback:**
- Avoid big-bang changes
- Deliver value quickly
- Learn and adjust
- Sustainable pace

### 6. Observe Directly

**Data-driven decision making:**
- Measure what matters
- Monitor continuously
- Real metrics over assumptions
- Evidence-based improvement

### 7. Be Transparent

**Open communication and visibility:**
- Share information
- Clear accountability
- Honest about issues
- Build trust through openness

### 8. Collaborate

**Work together across boundaries:**
- Cross-functional teams
- Shared goals
- Partner with suppliers
- Co-create with customers

### 9. Keep It Simple

**Complexity is waste:**
- Eliminate unnecessary steps
- Automate where valuable
- Clear, straightforward processes
- Practical over theoretical

---

## ITIL 4 Updates

**ITIL 4 (2019) modernized the framework:**

### Service Value System (SVS)

**How components work together to create value:**
- Guiding principles (9 principles above)
- Governance (organizational control)
- Service value chain (6 activities)
- Practices (evolved from processes)
- Continual improvement

### Service Value Chain

**Six core activities:**
1. **Plan:** Shared vision and direction
2. **Improve:** Continual improvement of services
3. **Engage:** Stakeholder understanding and relationships
4. **Design & Transition:** Services meet expectations and ready for use
5. **Obtain/Build:** Service components available
6. **Deliver & Support:** Services delivered and supported

### ITIL Practices (evolved from Processes)

**34 practices across three categories:**

**General management practices:**
- Strategy management
- Portfolio management
- Architecture management
- Continual improvement
- Measurement and reporting
- Risk management
- And more...

**Service management practices:**
- Service design
- Service level management
- Availability management
- Capacity and performance management
- Service continuity management
- Incident management
- Problem management
- Service request management
- And more...

**Technical management practices:**
- Deployment management
- Infrastructure and platform management
- Software development and management
- And more...

---

## ITIL Benefits

**When implemented well:**

**For the organization:**
- Improved service quality and consistency
- Reduced costs through efficiency
- Better risk management
- Improved decision making through metrics
- Competitive advantage

**For customers:**
- Better service experience
- Clear expectations (SLAs)
- Faster incident resolution
- More reliable services
- Improved communication

**For staff:**
- Clear roles and responsibilities
- Consistent processes
- Better tools and knowledge
- Career development paths
- Reduced firefighting

---

## ITIL Challenges

**Common pitfalls:**

**Over-bureaucracy:**
- Too much process, not enough value
- Forms and approvals slow everything down
- Compliance over outcomes
- Process for process sake

**Solution:** Tailor to context, keep it simple, focus on value

**Siloed implementation:**
- Departments implement in isolation
- Handoffs between silos create friction
- Lack of end-to-end thinking
- Conflicting priorities

**Solution:** Work holistically, integrate processes, shared goals

**Resistance to change:**
- "We've always done it this way"
- Fear of new processes
- Lack of training and communication
- Change fatigue

**Solution:** Involve people early, communicate benefits, progress iteratively

**Metric gaming:**
- Optimizing for metrics, not outcomes
- Hitting targets, missing point
- Data theater without insight
- Perverse incentives

**Solution:** Observe directly, focus on value, measure what matters

**Tool-first thinking:**
- Buy tool, expect magic
- Tool doesn't match process
- Over-customization creates technical debt
- Process dictated by tool limitations

**Solution:** Process before tools, tailor to needs, keep it simple

---

## ITIL and Agile/DevOps

**ITIL often seen as incompatible with agile/DevOps - this is false:**

**Complementary approaches:**
- ITIL: Service management framework (what to do)
- Agile: Iterative development approach (how to build)
- DevOps: Culture and practices (how to deliver)

**Integration points:**
- ITIL change management + DevOps automation = continuous delivery with governance
- ITIL incident management + DevOps monitoring = faster detection and resolution
- ITIL continual improvement + Agile retrospectives = systematic learning
- ITIL service design + Agile user stories = customer-focused services

**Modern ITIL (ITIL 4):**
- Explicitly embraces agile and DevOps
- Iterative improvement built-in
- Flexibility and speed emphasized
- Value streams over process compliance

---

## Relevance to SPL2 (Future Direction)

**Current stepping stones that align with ITIL:**
- **Adhoc Activity:** Similar to ITIL standard/emergency changes
- **Planned Activity:** Similar to ITIL normal changes (formal project addons)
- **Unplanned Activity:** Similar to ITIL change management at project closure

**Potential future application:**
- **Service management:** When Splectrum platform runs, ITIL provides service operation framework
- **Change management:** Structured approach to platform evolution
- **Incident/problem management:** Handling issues in running services
- **Continual improvement:** CIPs align with ITIL CSI approach
- **Knowledge management:** Glossaries, documentation, lessons learned

**Not currently implemented:**
- This is pure ITIL reference
- SPL2 focused on building, not yet operating services
- Will become relevant as platform matures
- Placeholder for future service management approach

---

**Summary: ITIL is a comprehensive framework for IT service management focused on delivering value through well-run services. Core lifecycle: Strategy → Design → Transition → Operation → Continual Improvement. Key processes: Change, Incident, Problem, Service Level, Configuration, Knowledge Management. Modern ITIL (v4) emphasizes value, agility, and holistic thinking. Currently reference material for SPL2 - will inform future service management approach as platform matures from building to operating.**
