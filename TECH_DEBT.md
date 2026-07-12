# Technical Debt

## TypeScript 6.0.3 Pin

**Date:** 2026-07-12
**Status:** Blocked on upstream dependencies

### Description
TypeScript has been strictly pinned to exactly `6.0.3` (with a guardrail script in `preinstall`/`postinstall` and `.npmrc` `save-exact=true`) to prevent accidental drift to TS 7.x. 

### Why we are pinned to 6.0.3
We attempted to upgrade to TypeScript 7.0.2 but had to revert because of three confirmed blockers:

1. **typescript-eslint AST Parser:** The current `@typescript-eslint` packages depend on the old compiler API. Their peer dependencies cap TypeScript at `<6.1.0`.
2. **Next.js TS Verification:** Next.js 16.2.10's `verify-typescript-setup.js` hardcodes a check for `typescript/lib/typescript.js`. TypeScript 7 removed this file, causing the Next.js build to fail.
3. **Path Alias Resolution:** TypeScript 7's restructured package broke `tsconfig.json` path-alias resolution during our build trial.

### Unblocking the Future Upgrade
We can revisit the upgrade to TypeScript 7.x when one or more of the following occur:
- `typescript-eslint` releases v9/v10 with TS 7 support.
- Next.js updates its TypeScript verification process to support the new TS 7 package structure.
- TypeScript 7.1 releases its promised compatibility layer.
