**Type:** plain req

# submit

## Spec

**Method name** for submission operations. Provide work or input for processing.

**Semantic meaning:** Hand something over for processing, review, or execution.

**Common patterns:**
- Returns confirmation and tracking information
- May trigger processing (sync or async)
- Work is validated/processed by the receiving system
- Often returns metadata about dependencies or state

**Examples:**
- `spl/dev/submit` - Submit work package to overlay for implementation
- `spl/pipeline/submit` - Submit job to processing pipeline
- `spl/review/submit` - Submit artifact for review

**Naming convention:** Use `submit` when handing work to a system for processing.

**Not to be confused with:**
- `install` - Add permanent components
- `execute` - Run immediately
- `publish` - Make available to consumers

Scope: Method naming convention.

Purpose: Define consistent meaning of "submit" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (hand over for processing)
- [ ] Distinguished from related operations
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Submission implies the receiving system will do something with what was submitted.
