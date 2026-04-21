# Angular 21 Standalone Template

A production-ready Angular 21 starter with Material M3 theming, feature-first architecture, and a full quality gate out of the box.

---

## Stack

| Layer           | Choice                               |
| :-------------- | :----------------------------------- |
| Framework       | Angular 21 (standalone, no NgModule) |
| UI              | Angular Material M3                  |
| State           | Signals + `httpResource()`           |
| Styling         | SCSS with M3 design tokens           |
| Tests           | Vitest (unit) · Playwright (e2e)     |
| Linting         | ESLint + `eslint-plugin-boundaries`  |
| Formatting      | Prettier                             |
| Git hooks       | Husky + lint-staged + commitlint     |
| Package manager | Bun                                  |

---

## Getting started

```bash
bun install
bun run init        # interactive theme initializer (palette, font, radius)
bun start           # dev server at http://localhost:4200
```

The dev server proxies `/api` → `http://localhost:8080`. Edit `proxy.conf.json` to change the target.

---

## Commands

```bash
bun start           # dev server
bun run build       # production build
bun test            # unit tests (vitest)
bun run test:watch  # unit tests in watch mode
bun run test:e2e    # Playwright e2e tests
bun run lint        # ESLint
bun run format      # Prettier
bun run init        # re-run theme initializer
```

---

## Architecture

```
src/app/
├── core/       # Singletons: auth, guards, interceptors, layout, theme
├── shared/     # Reusable UI: components (ui-*), directives, models, pipes
└── features/   # One folder per domain
```

Import boundaries are enforced by ESLint:

- `features` → can import `core` and `shared`
- `shared` → cannot import `core` or `features`
- `core` → cannot import `features`
- Features cannot cross-import each other

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full guide and [docs/adr/](./docs/adr/) for the reasoning behind each decision.

---

## Theming

- 12 built-in Material palettes, switchable at runtime
- Light / dark mode driven by a `dark` class on `<html>`
- All tokens live in `src/styles/_tokens.scss` — edit palette, font, and radius there
- Run `bun run init` for an interactive prompt

---

## Adding a feature

```bash
mkdir -p src/app/features/{name}/{models,services,guards,components,pages}
```

1. Add a `loadComponent` route in `app.routes.ts`
2. Create a service using `httpResource()` for reads, `ApiService` methods for mutations
3. Pages are smart (inject services), components are dumb (`@Input` / `@Output` only)
