**Type:** plain req

# extract

## Spec

**Method name** for extraction operations. Remove and retrieve something from a container or system.

**Semantic meaning:** Take out contents, making them available separately from the source.

**Common patterns:**
- Source may remain intact or be modified
- Returns extracted content and metadata
- May support destination specification
- Often includes state/metadata with extracted content

**Examples:**
- `spl/dev/extract` - Extract completed module from overlay with metadata
- `spl/archive/extract` - Extract files from archive
- `spl/data/extract` - Extract subset of data for analysis

**Naming convention:** Use `extract` when removing contents from a container while preserving structure.

**Not to be confused with:**
- `export` - Convert and send elsewhere
- `copy` - Duplicate without removing
- `retrieve` - Fetch without structural change

Scope: Method naming convention.

Purpose: Define consistent meaning of "extract" across all SPL2 APIs.

## Self-eval

- [ ] Semantic meaning is clear (remove and retrieve)
- [ ] Distinguished from related operations
- [ ] Common patterns documented
- [ ] Examples provided

## Comments

Extraction implies taking something out that was inside something else.
