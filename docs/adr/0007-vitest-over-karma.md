# ADR-0007: Vitest over Karma

## Status

Accepted — 2026-04

## Context

Angular's default test runner has historically been Karma with Jasmine. Karma launches a real browser, which makes it slow to start and difficult to run in CI without a headless Chrome setup. The Angular team announced Karma as deprecated in Angular 16 and has since recommended migrating to Jest or Web Test Runner.

The template must choose a unit test runner. The criteria:
- Fast feedback loop (watch mode, no browser launch overhead).
- Compatible with Angular's testing utilities (`TestBed`).
- Good TypeScript support.
- Familiar API for developers coming from Jest.

## Decision

Use **Vitest** as the unit test runner.

Vitest uses Vite's transform pipeline, supports TypeScript natively, and has a Jest-compatible API (`describe`, `it`, `expect`, `vi.fn()`). The Angular team ships `@analogjs/vitest-angular` (used here via `@angular/build`) which provides a Vite plugin that handles Angular's template compilation inside Vitest.

Test files use the `.spec.ts` suffix convention. `TestBed` works as normal.

Vitest is configured in `vitest.config.ts` at the project root.

## Consequences

### Positive

- **Fast.** No browser launch. Watch mode re-runs only affected tests in milliseconds.
- **Native TypeScript.** No `ts-jest` or compilation step — Vite handles it.
- **Jest-compatible.** Developers who know Jest are immediately productive. Migration of Jest tests to Vitest is usually zero-effort.
- **Single toolchain.** Vite is already used for the dev server and build via `@angular/build`. Using Vitest keeps the transform pipeline consistent.

### Negative / Tradeoffs

- **No real browser.** Vitest runs in jsdom (simulated DOM). Tests that rely on real browser rendering, layout, or browser-specific APIs need Playwright (ADR-0008) instead.
- **`@angular/build` Vitest integration is relatively new.** Edge cases with complex Angular DI setups may surface. The workaround is always to fall back to `TestBed` defaults.

## Alternatives Considered

### Jest

Rejected in favor of Vitest. Jest requires `ts-jest` or `babel-jest` for TypeScript, adding configuration overhead. Vitest is faster and uses the same transform pipeline as the build. The APIs are nearly identical, so there is no meaningful developer experience difference.

### Karma / Jasmine

Rejected. Karma is deprecated by the Angular team. Browser-launch overhead makes watch mode slow. Setting up headless Chrome in CI requires additional configuration. There is no compelling reason to adopt a deprecated tool in a new template.

### Web Test Runner

Rejected. Less ecosystem momentum than Vitest. The Angular integration story is less mature.
