# Contributing to Syntopic Studio

## Branching
- Create feature branches from `main`.
- Keep changes focused and small where possible.

## Local workflow
- Install dependencies with `npm ci`
- Run `npm run typecheck`
- Run `npm run build`
- Verify the editor in the browser before opening a pull request

## Code style
- TypeScript strict mode only
- Prefer feature modules over large shared files
- Keep graph, runtime, and UI concerns separated
- Use React Flow idioms for editor work
- Avoid adding dependencies without a clear reason

## Pull requests
- Include a concise summary
- Note verification steps
- Include screenshots or short screen recordings for UI changes when useful

## Issue triage
- Use the issue templates for bugs and feature requests
- Include reproduction steps for defects
- Include workflow context for product suggestions
