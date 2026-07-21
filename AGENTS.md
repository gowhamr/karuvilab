# KaruviLab — Agent Operating Protocol
Applies to every session, on top of GEMINI.md's engineering rules.

## Terminology Definitions
- **Reviewed**: Inspected source code or configuration files directly.
- **Verified**: Observed through actual runtime execution or reproducible empirical evidence.
- **Confirmed**: Validated by clean automated test suites or verified runtime assertions.

---

## 1. Investigate before implementing
Read the actual current code before proposing a fix — never assume a prior session's description of the codebase is still accurate. If a claim can be checked in the repo, check it; don't infer from a filename or a summary.

## 2. Verification means running it, not describing it
"Typecheck passed" / "build succeeded" is not verification of a runtime claim (memory behavior, UI state, user-facing correctness). If a claim is about what happens in a browser, it must be checked in a browser or honestly reported as unavailable — never substitute a mock/simulation of the exact thing being verified and call it verified. If real verification isn't possible in this environment, say so explicitly instead of proceeding as if it happened.

## 3. Phase everything with a size budget
Read-only audits/investigations may cover a large batch (20–50+ items) in one pass, since nothing is being changed. Implementation/fix passes must stay small (2–6 files or tools per phase) with a verification checkpoint before continuing. Never mix the two — don't fix while auditing.

## 4. No mocked output, ever — label limitations instead
Never ship a tool that returns hardcoded/placeholder output pretending to be real computation. If full correctness isn't achievable this pass, implement a real subset and say so in the UI — don't fake the rest.

## 5. Match claims to actual capability
UI copy, security/privacy claims, and marketing language must not promise more than the code actually guarantees (e.g. never say "securely wiped" or "instantly erased" for something that's really "reference cleared, GC timing not guaranteed"). This applies to legal/policy pages too — they are not ordinary copy; flag any AdSense/tracking/compliance-adjacent page for human review rather than treating a rewrite as final.

## 6. Dependencies require approval
Never install a new package without first reporting its name, size (gzipped), and justification, and waiting for explicit go-ahead. Every approved addition gets a BUNDLE_DECISIONS.md entry.

## 7. Feature-first, not capability-first
Don't recommend or add a library/capability without a concrete, named tool or route it powers. "Fills a gap" is not sufficient justification on its own.

## 8. Cite the exact rule when flagging a violation
When something violates GEMINI.md, cite the specific rule code (P-04, KL-05, PERF-01, etc.) and quote its text — don't just say "performance issue" or "bad practice."

## 9. Surface what you find, even if it's not what was asked
If investigating one issue turns up an unrelated one (a missing file, a stale claim, a live/broken page), report it explicitly and separately — don't fix it silently and don't bury it in an unrelated section.

## 10. Escalate architectural decisions — don't guess
If a fix requires a scope or architecture decision (new dependency, product tradeoff, ambiguous spec), stop and ask rather than picking an interpretation and proceeding.

## 11. Loops need an exit condition
Any "audit/fix/re-verify" cycle gets a maximum pass count and a clear stop condition, stated up front. "Independently verified twice" means genuinely different methodology each time (different evidence gathered, not a second agent rubber-stamping the first one's conclusions). Once a question is settled this way, record the conclusion (TECH_DEBT.md or equivalent) so a future session doesn't re-investigate it from scratch — re-running the same check a third time is not more evidence, it's wasted effort.

## 12. Track deferred work, don't let it evaporate
Anything explicitly deferred (a fix that needs a browser to verify, a decision awaiting approval, a scope cut for later) gets a TECH_DEBT.md entry immediately — not just a mention in a chat response.

## 13. Self-reports need a fresh check, not a reread
"All fixed" / "completed" claims from a prior session are a starting point for verification, not a conclusion. Re-open the actual current files and re-check against the original requirement before agreeing something is done.

## 14. Log genuine rule exceptions formally
If a GEMINI.md rule truly cannot be met (a hard browser/API constraint, not just inconvenience), it must be logged in EXCEPTIONS.md — rule, reason, and mitigation — before the code is considered done. Explaining it in chat is not a substitute for the logged exception GEMINI.md itself requires.

## 15. Confirm current state before diagnosing
Before diagnosing any environment/dependency/version issue, confirm actual current state first (npm ls, exact file contents, exact installed version) — don't diagnose against what a prior session or a prior report claimed the state was.

## 16. Never fabricate citations or external URLs
A "Sources:" line or external URL may only be included in any report if it was directly returned by a real tool call (web_search, read_url_content, or an explicit codebase file reference) executed in that same turn, or explicitly provided by the user in a prompt (with clear attribution). Never infer, guess, reconstruct from memory, or pattern-match a URL to look like a plausible citation. If no tool call produced a source, state "no external source" rather than inventing one. This applies retroactively to self-audits too: if asked to explain an existing citation's origin, verify against actual tool-call logs, not a plausible-sounding narrative.

## 17. Classify findings with explicit confidence levels
Every technical finding, audit conclusion, or diagnostic claim must be assigned an explicit confidence level based on the evidence gathered:
- **High confidence**: Backed by direct runtime execution, browser observation, or test output.
- **Medium confidence**: Backed by direct source code or configuration file inspection.
- **Low confidence**: Based on reasoned inference or static analysis without direct execution.

## 18. Include reproducible evidence references
Every significant finding, bug report, or audit item must include exact evidence references to make audits easily reproducible:
- File path(s)
- Line number(s) where applicable
- Command or tool used to gather the evidence (if applicable)
