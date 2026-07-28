# Phase 0: Research & Technical Rationale

## Decision 1: Pre-Slicing (Cleaving) Width Decomposition Strategy
- **Decision**: For any raw section with $W_{\text{section}} > W_{\text{roll}}$, decompose it width-wise into $N = \lfloor W / W_{\text{roll}} \rfloor$ full-width strips and 1 remainder strip of width $W \bmod W_{\text{roll}}$.
- **Rationale**: Standard 2D bin packing solvers overflow container bounds when an item's width exceeds the roll width. Pre-slicing converts wide room sections into standard parallel strips before nesting, maintaining physical continuity and structural ancestry.
- **Alternatives Considered**: Rejecting wide sections or manual user splitting. Rejected because auto-cleaving is essential for automated takeoff.

## Decision 2: Length-Descending Sorting Heuristic ($L_{\text{cut}}$ Descending)
- **Decision**: Sort all decomposed cut pieces strictly by Length Descending (`b.length - a.length`).
- **Rationale**: Sorting by Area Descending creates a critical "Area-Sorting Trap": processing shorter wide cuts first generates short side remnants that cannot fit longer narrow cuts, forcing fresh roll cuts. Sorting by length prioritizes longer cuts, generating maximum-length side-cut remnants ($10\text{ ft} \times 20\text{ ft}$) that easily absorb shorter pieces ($10\text{ ft} \times 10\text{ ft}$), saving 10+ linear feet per job.

## Decision 3: Structural Ancestry Naming Convention
- **Decision**: Name cleaver output pieces using alphabetical suffixes: `[Section_Name] Part A`, `[Section_Name] Part B`, `[Section_Name] Part C`.
- **Rationale**: Installer cut sheets and proposal PDFs require clear section tracing so installers know exactly which physical strip corresponds to which part of the room layout.
