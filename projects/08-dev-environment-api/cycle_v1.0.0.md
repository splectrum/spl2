**Type:** plain req

# cycle

## Spec

**Method name** for iterative execution operations. Run one iteration of a repeating process.

**Semantic meaning:** Execute one turn of a cycle, returning control after each iteration.

**Common patterns:**
- Returns results of this cycle
- May return-and-resume (stop on failure, continue after fix)
- Tracks iteration count
- Reports progress/state
- Enables handoff between cycles

**Examples:**
- `spl/dev/cycle` - Run one test cycle, return on failure or completion
- `spl/process/cycle` - Execute one processing cycle
- `spl/pipeline/cycle` - Run one pipeline iteration

**Naming convention:** Use `cycle` when the operation is one iteration of a repeating process with return-and-resume pattern.

**Not to be confused with:**
- `execute` - One-shot execution
- `run` - Start and run to completion
- `loop` - Continuous execution without return

Scope: Method naming convention.

Purpose: Define consistent meaning of "cycle" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (one iteration with return)
- [ ] Distinguished from related operations
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Cycle enables interactive workflows - run, check result, intervene, continue.
