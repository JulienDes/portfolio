# ADR-0010: File Naming Conventions — Angular 21 Style Guide

## Status

Accepted — 2026-04

## Context

Prior to Angular 19, the Angular CLI appended type suffixes to every generated file:
`user-profile.component.ts`, `auth.service.ts`, `auth.guard.ts`, `text-color.directive.ts`, etc.

These suffixes were useful when Angular required `NgModule` declarations and all artifact types were grouped in the same directories. In a standalone, feature-first project the type is already communicated by:

1. The **class name** (`UserProfileComponent`, `AuthService`).
2. The **folder** the file lives in (`pages/`, `services/`, `guards/`, `directives/`).

Angular's own style guide was updated alongside Angular 19 to reflect this — it now shows plain filenames (`user-profile.ts`, `auth.ts`) rather than type-suffixed ones, and states that suffixes like `.service`, `.directive`, `.guard`, and `.component` are no longer mandated.

## Decision

Adhere to Angular 21's updated file naming conventions:

- **No type suffixes** in filenames. Use `auth.ts`, not `auth.service.ts`; `text-color.ts`, not `text-color.directive.ts`; `showcase-page.ts`, not `showcase-page.component.ts`.
- **Hyphen-separated lowercase** for all filenames (`example-card.ts`, `loading-button.ts`).
- **`.spec.ts`** suffix is kept for test files — it is required for test runners to discover them.
- **Class names** retain their Angular type suffix (`AuthService`, `TextColorDirective`, `ShowcasePageComponent`) — the suffix lives in the identifier, not the filename.

## Consequences

### Positive

- **Aligned with Angular 21.** Follows the framework's own style guide. Generators and tools from the Angular ecosystem will produce the same output.
- **Less noise.** Filenames are shorter and folder context already disambiguates the type.
- **Consistent.** No partial adoption — the rule applies to every artifact type uniformly.

### Negative / Tradeoffs

- **IDE search ambiguity.** Searching for `auth.ts` may surface both the auth service (`core/auth/auth.ts`) and the auth guard (`core/guards/auth.ts`). Folder path is required to distinguish them — a small price for a well-organised project.
- **Breaking from legacy Angular.** Developers familiar with the old convention may find the style unexpected until they read this ADR.

## Alternatives Considered

### Keep the traditional suffixes

Rejected. They are redundant in this codebase and conflict with the direction Angular itself is taking. Staying on the old convention would mean diverging from Angular's style guide and future CLI defaults.

### Keep suffixes only for ambiguous cases (e.g., `.service.ts`)

Rejected. Partial adoption creates inconsistency and forces developers to remember which suffix is required. All-or-nothing is simpler to follow.
