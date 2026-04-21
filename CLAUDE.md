# CLAUDE.md

## Project

Angular 21 standalone template. See `ARCHITECTURE.md` for the full folder guide and `docs/adr/` for decision records.

## Commands

```bash
bun start          # dev server (proxies /api → localhost:8080)
bun run build      # production build
bun test           # unit tests via @angular/build:unit-test (vitest)
bun run test:watch # watch mode
bun run test:e2e   # Playwright e2e tests
bun run lint       # ESLint
bun run format     # Prettier
bun run init       # interactive theme initializer
```

## Architecture

```
src/app/
├── core/       # Singletons: auth, guards, interceptors, layout, theme, http
├── shared/     # Reusable: components (ui-*), directives, models, pipes
└── features/   # One folder per domain: models/, services/, guards/, components/, pages/
```

**Import rules (enforced by eslint-plugin-boundaries):**

- `features` → can import `core` and `shared`
- `shared` → cannot import `core` or `features`
- `core` → cannot import `features`
- Features cannot cross-import each other

## Key patterns

**Data fetching** — use `httpResource()` from `@angular/common/http` in services. `ApiService.url(path)` resolves the base URL. Interceptors handle auth token and error normalisation automatically.

```typescript
readonly profile = httpResource<User>(() => this.api.url('/profile'));
```

**State** — signals throughout. `computed()` for derived state. No RxJS subscriptions in components.

**Theming** — edit `src/styles/_tokens.scss` to change palette, font, or radius. Run `bun run init` for an interactive prompt. The `dark` class on `<html>` drives light/dark; `ThemeService` manages it.

**Shared directives** — `[textColor]`, `[surface]`, `[elevation]`, `button[loading]` — apply Material system tokens without remembering `--mat-sys-*` names.

**SCSS tokens** — `@use 'styles/sys' as sys` gives autocomplete for all Material system tokens: `sys.$primary`, `sys.$surface-container-high`, etc.

**M3 button semantics** — M3 has five variants: elevated, filled, filled tonal, outlined, text. Emphasis comes from the variant alone — there are no semantic color overrides for destructive, warn, or success. Do not add custom color classes or override MDC tokens on buttons.

| Intent             | Pattern                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| Primary action     | `mat-flat-button` (filled)                                                  |
| Secondary / cancel | `mat-stroked-button` (outlined) or `mat-button` (text)                      |
| Destructive        | `mat-stroked-button` or `mat-button` — the label and icon carry the meaning |

## Component selectors

- `app-*` — feature and core components
- `ui-*` — shared UI components (`ui-spinner`, `ui-error`, `ui-empty`, `ui-confirm-dialog`)
- Attribute directives — no prefix (`textColor`, `surface`, `elevation`, `loading`)

## Adding a feature

1. `mkdir -p src/app/features/{name}/{models,services,guards,components,pages}`
2. Add a `loadComponent` route in `app.routes.ts`
3. Service uses `httpResource()` for reads, `ApiService` methods for mutations
4. Pages are smart (inject services), components are dumb (`@Input`/`@Output` only)
