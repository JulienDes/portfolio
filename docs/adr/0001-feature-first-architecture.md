# ADR-0001: Feature-First Architecture

## Status

Accepted — 2026-04

## Context

This template targets Angular SPAs that grow beyond a handful of pages. The main structural question is whether to organize code by **technical type** (all services together, all components together) or by **business domain** (everything for a feature in one folder).

Previous projects organized by technical type (`services/`, `components/`, `models/`) at the top level. As features multiplied, navigating the codebase required jumping between four or five distant folders to follow a single user flow. Onboarding new developers was slow because there was no obvious "home" for a given feature.

The template also needs to enforce clear ownership rules between layers: what can import what, and where does global vs feature-specific code live.

## Decision

Adopt a **three-pillar Feature-First layout**:

```
src/app/
├── core/       # Singletons loaded once (auth, guards, interceptors, layout)
├── shared/     # Reusable building blocks with no feature affinity
└── features/   # One folder per business domain
```

Each feature follows the same internal structure:

```
features/{name}/
├── models/     # TypeScript interfaces scoped to this feature
├── services/   # HTTP calls and signal-based state
├── guards/     # Route guards scoped to this feature (optional)
├── components/ # Dumb components scoped to this feature
└── pages/      # Smart components connected to routes
```

Import rules:
- `features/` may import from `core/` and `shared/`.
- `shared/` may **not** import from `core/` or `features/`.
- `core/` may **not** import from `features/`.
- Features may **not** import from other features. Cross-feature data belongs in `shared/models/`.

## Consequences

### Positive

- **Locality.** All files for a feature are co-located. Understanding or deleting a feature means touching one folder.
- **Scalability.** Adding a new feature is additive — no existing folder grows unboundedly.
- **Clear ownership.** The import rules make it obvious when a model has "graduated" to shared.
- **Feature-scoped guards.** Route guards that encode feature-specific business rules (e.g. "only the resource owner can edit") live in `features/{name}/guards/` rather than polluting `core/guards/`.

### Negative / Tradeoffs

- **More nesting.** A simple component lives four levels deep (`features/auth/pages/login/`). This is a deliberate tradeoff for clarity at scale.
- **Discipline required.** The import rules only hold if developers don't cross-import between features. A linter rule (`eslint-plugin-boundaries`) can enforce this mechanically.

## Alternatives Considered

### Organize by technical type at the top level

Rejected. Works for small apps but degrades as features grow. A `services/` folder with 20 unrelated services is not navigable.

### Flat structure (everything in `app/`)

Rejected. No scalability, no enforced ownership, leads to spaghetti imports quickly.
