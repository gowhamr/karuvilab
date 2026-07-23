# Contributing to KaruviLab

Welcome to KaruviLab! All human contributors and AI agents must follow our strict engineering and workflow disciplines.

## Workflow Discipline
Our workflow relies on the strict discipline defined in `AGENTS.md`:
1. **Investigate before implementing:** Always read the actual current code before proposing fixes. Do not rely on stale summaries or assumptions.
2. **Verify by running:** Verification means running the code. Typechecks and builds are not enough to confirm runtime claims or UI state. If a claim cannot be verified locally, explicitly state the limitation instead of mocking the verification.
3. **Phase everything with a budget:** Separate read-only investigations from implementation phases. Implementation phases must be kept small (2–6 files or tools) with explicit verification checkpoints before continuing.
4. **Track deferred work:** Anything deferred (e.g., awaiting browser verification, pending decisions) must be logged immediately in [TECH_DEBT.md](TECH_DEBT.md), not just mentioned in chat.

## Architectural Constraints
All code must adhere to the Elite Engineering Manifesto defined in [GEMINI.md](GEMINI.md). Key pillars include:
- **Zero-Server-Upload:** All data stays in the browser.
- **Privacy-First:** No telemetry, tracking, or analytics.
- **Local-First Execution:** Heavy compute must be offloaded to Web Workers.
- **No exceptions without documentation:** All intentional deviations must be formally logged in [EXCEPTIONS.md](EXCEPTIONS.md) and [BUNDLE_DECISIONS.md](BUNDLE_DECISIONS.md).

## Required Rigor
For examples of the required architectural rigor and strict rule compliance checks we expect (especially for heavy operations), please review our recent audits:
- [PDF_TOOLS_AUDIT.md](PDF_TOOLS_AUDIT.md) — Demonstrates a rigorous, granular, code-level deep audit spotting specific race conditions, verifying React correctness, and validating memory management.
- [HEAVY_OPS_COMPLIANCE_CHECKLIST.md](HEAVY_OPS_COMPLIANCE_CHECKLIST.md) — Demonstrates a broader rule-compliance checklist verifying the usage of `WorkerOrchestrator` and `AbortSignal` for heavy operations across the codebase.
