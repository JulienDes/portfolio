# ADR-0008: Playwright for End-to-End Testing

## Status

Accepted — 2026-04

## Context

Unit tests (Vitest) verify isolated logic. They cannot catch integration failures: a form that submits but doesn't navigate, an auth flow that breaks when the token expires, or a layout that collapses at a specific viewport width.

End-to-end tests drive a real browser against the running app and verify full user flows. The template should scaffold e2e testing infrastructure so projects start with it wired up rather than adding it as an afterthought.

The two dominant choices are Cypress and Playwright.

## Decision

Use **Playwright** for end-to-end testing.

Playwright is maintained by Microsoft, runs tests in Chromium, Firefox, and WebKit in parallel, and has first-class TypeScript support. Tests live in `e2e/` at the project root.

The template ships with:
- `playwright.config.ts` configured to run against `http://localhost:4200`.
- A `e2e/example.spec.ts` showing how to write a basic navigation test.
- An npm script `test:e2e` that starts the dev server and runs Playwright in one command.

## Consequences

### Positive

- **Real browser.** Playwright catches bugs that jsdom cannot: CSS layout issues, browser API differences, real network timing.
- **Multi-browser.** Running against Chromium, Firefox, and WebKit in CI catches cross-browser regressions for free.
- **Parallel execution.** Playwright runs tests in parallel across browsers and workers. Large e2e suites complete faster than sequential alternatives.
- **Auto-wait.** Playwright waits for elements to be visible and stable before interacting — no manual `waitFor` calls for standard flows.
- **Trace viewer.** Failed CI tests produce a trace file that replays the failure step-by-step, including screenshots and network requests.

### Negative / Tradeoffs

- **Slower than unit tests.** Browser launch and real network calls make e2e tests 10–100× slower than Vitest tests. They belong in a separate CI stage, not in the fast feedback loop.
- **Flakiness risk.** Real browser tests can fail for timing reasons unrelated to the code. Playwright mitigates this with auto-wait, but flaky tests are a maintenance burden that requires discipline.

## Alternatives Considered

### Cypress

Rejected. Cypress has a friendlier initial setup experience, but Playwright has caught up on tooling and surpassed Cypress on multi-browser support and parallel execution. Playwright's trace viewer is superior to Cypress's video recording for debugging CI failures. The Angular community has largely converged on Playwright.

### No e2e scaffolding

Rejected. Projects that start without e2e infrastructure rarely add it later. Including a minimal working config lowers the barrier enough that teams actually write e2e tests.
