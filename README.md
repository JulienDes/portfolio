# My Portfolio

A personal portfolio built with Angular 21, based on a starter template made by a friend.

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
