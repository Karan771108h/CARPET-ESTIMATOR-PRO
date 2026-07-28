# AI Workflow Rules

## Approach
Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent product behavior from scratch.

## Scoping Rules
- Work on one feature unit at a time (e.g., "Build area calculation" before "Build strip allocation").
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step (e.g., do not build the PDF UI and the Math logic in the same prompt).

## When to Split Work
Split an implementation step if it combines:
- UI changes and backend API changes.
- Multiple math formulas at once (build Area first, verify, then build Pattern Matching).
- Any behavior not clearly defined in the context files.

If a change cannot be verified end-to-end quickly (e.g., running a pure function against a test case), the scope is too broad — split it.

## Handling Missing Requirements
- Do not invent math formulas. If a pattern match type is not defined in `architecture.md`, ask for clarification.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Files
Do not modify the following unless explicitly instructed:
- `middleware.ts` (core security boundary)
- `package.json` / `package-lock.json`

## Keeping Docs in Sync
Update the relevant context file whenever implementation changes:
- System architecture or boundaries
- Math logic formulas
- Code conventions or standards

## Before Moving to the Next Unit
1. The current unit works end-to-end within its defined scope.
2. No invariant defined in `architecture.md` was violated (especially: NO DATABASE usage).
3. `progress-tracker.md` reflects the completed work.
4. `npm run build` passes.
