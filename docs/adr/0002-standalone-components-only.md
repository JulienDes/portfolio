# ADR-0002: Standalone Components Only

## Status

Accepted — 2026-04

## Context

Angular historically required `NgModule` to declare components, pipes, and directives, and to control what each component could see. Angular 14 introduced standalone components as an opt-in. Angular 19 made standalone the default. Angular 21 (used in this template) deprecates module-based applications entirely.

The template must choose a clear stance: allow modules for backwards compatibility, or go fully standalone and build conventions around it.

## Decision

**No `NgModule` anywhere in this template.** Every component, pipe, and directive is standalone. Lazy loading uses `loadComponent()` and `loadChildren()` with route-level code splitting — no feature modules.

`app.config.ts` is the single configuration entry point, using `provide*()` functions exclusively.

## Consequences

### Positive

- **Explicit dependencies.** Each component declares exactly what it imports. No hidden transitive imports via a shared module.
- **Better tree-shaking.** The bundler can eliminate unused components more precisely.
- **Simpler lazy loading.** `loadComponent(() => import('./pages/login/login.component'))` is more readable than a lazy-loaded module wrapping one component.
- **Aligned with Angular's direction.** Module-based apps are a dead end; building on standalone avoids a future migration.

### Negative / Tradeoffs

- **Repeated imports.** If ten components all need `CommonModule` equivalents (`NgIf`, `NgFor`, etc.), each imports them individually. Mitigated by Angular's built-in control flow (`@if`, `@for`) which needs no import.
- **No NgModule escape hatch.** Third-party libraries that only expose `NgModule` require a `importProvidersFrom()` shim. This is rare in Angular 21.

## Alternatives Considered

### Allow NgModule for legacy library compatibility

Rejected. The template is greenfield. Any library still requiring NgModule-only usage should be replaced with a standalone-compatible alternative. Allowing modules "just in case" would create two patterns in the same codebase.
