# Architecture Guide

This document describes the code organization rules for projects built from this template.
We use a **Feature-First** approach — code is grouped by business domain, not by technical type.

---

## Folder Overview

All source code lives in `src/app/`, divided into three pillars:

```text
src/app/
├── core/             # Singletons — loaded once at startup
├── shared/           # Reusable building blocks — used across features
└── features/         # Business domains — the meat of the application
```

---

## 1. Core (`src/app/core/`)

Contains elements that are **unique and global** — instantiated once, never re-imported by features.

```text
core/
├── auth/             # AuthService, JWT helpers
├── guards/           # AuthGuard, RoleGuard
├── interceptors/     # Token injection, error handling
└── layout/           # Header, Footer, Shell components
```

**Golden rule:** `core/` is only imported by `app.component.ts` or `app.config.ts`. Features and shared never import core.

---

## 2. Shared (`src/app/shared/`)

Contains elements **reused by more than one feature**.

```text
shared/
├── components/       # Dumb UI components (buttons, loaders, dialogs)
├── models/           # Cross-cutting TypeScript interfaces
├── pipes/            # TruncatePipe, DateFormatPipe, etc.
└── directives/       # ImgFallbackDirective, etc.
```

**Golden rule:** Components here are dumb — they receive data via `@Input()` and emit actions via `@Output()`. They never call services or inject `HttpClient`.

---

## 3. Features (`src/app/features/`)

Each folder is a self-contained business domain.

```text
features/
└── example/
    ├── models/       # TypeScript interfaces scoped to this feature
    ├── services/     # HTTP calls and signal-based state
    ├── guards/       # Route guards scoped to this feature (optional)
    ├── components/   # Dumb components used only within this feature
    └── pages/        # Smart components — connected to routes
```

### Pages vs Components

|                    | Pages (Smart) | Components (Dumb) |
| :----------------- | :------------ | :---------------- |
| Calls services     | Yes           | No                |
| Reads route params | Yes           | No                |
| Receives data      | From services | Via `@Input()`    |
| Emits events       | Navigates     | Via `@Output()`   |

---

## Data Flow

```
Route → Page (Smart)
           │
           ▼
        FeatureService         ← exposes httpResource<T>() refs
           │
           ▼
        ApiService.url()       ← resolves base URL + config
           │  (httpResource uses HttpClient internally)
           ▼
        Interceptors           ← auth token, error normalisation
           │
           ▼
        Component (Dumb) ← receives data via @Input()
```

Services expose reads as `HttpResourceRef<T>` via `httpResource()` — a signal-based object with `value()`, `isLoading()`, `error()`, `hasValue()`, and `reload()`. Pages inject the service and read these signals directly in templates. No manual subscriptions, no `async` pipe.

Mutations are plain `Observable` methods on the service. After a successful mutation, the page calls `resource.reload()` to refresh the relevant resource.

---

## Theming

Design tokens live in `src/styles/_tokens.scss`. All colors, typography, and spacing reference these tokens. Angular Material is configured to use them for both light and dark themes.

The active theme is controlled by a `dark` class on `<html>`. The `ThemeService` in `core/` reads `localStorage` and `prefers-color-scheme` to set this class. No toggle component is provided — wire it to your own UI.

See [ADR-0005](./docs/adr/0005-dark-light-theme-strategy.md) for the full reasoning.

---

## Conventions

### File naming

Follow Angular 21's style guide — no type suffixes in filenames. The class name and the folder provide enough context.

| Artifact          | File                   | Class                      |
| :---------------- | :--------------------- | :------------------------- |
| Component         | `user-profile.ts`      | `UserProfileComponent`     |
| Service           | `auth.ts`              | `AuthService`              |
| Directive         | `text-color.ts`        | `TextColorDirective`       |
| Guard             | `auth.ts`              | `authGuard`                |
| Interceptor       | `auth.ts`              | `authInterceptor`          |
| Model / interface | `auth.ts`              | `AuthUser`, `AuthResponse` |
| Test              | `user-profile.spec.ts` | —                          |

See [ADR-0010](./docs/adr/0010-file-naming-conventions.md) for the full reasoning.

### Class member ordering

Order class members as follows (enforced by `@typescript-eslint/member-ordering`):

1. **Private fields** — `private readonly api = inject(ApiService)`
2. **Protected fields**
3. **Public fields** — `@Input()`, `@Output()`, `viewChild()`, `readonly count = signal(0)`
4. **Constructor** (only when DI via constructor is needed)
5. **Public methods** (includes lifecycle hooks — `ngOnInit`, `ngOnDestroy`)
6. **Protected methods**
7. **Private methods**

---

## FAQ

| Question                            | Answer                                       | Example          |
| :---------------------------------- | :------------------------------------------- | :--------------- |
| New full page                       | `features/{name}/pages/`                     | Profile page     |
| Small UI piece for one feature      | `features/{name}/components/`                | Avatar card      |
| UI piece used everywhere            | `shared/components/`                         | Loading spinner  |
| Data type used by multiple features | `shared/models/`                             | `User` interface |
| Data type scoped to one feature     | `features/{name}/models/`                    | `AnnonceDetails` |
| Global navigation                   | `core/layout/`                               | Header           |
| HTTP call + state                   | `features/{name}/services/` via `ApiService` | `getProfile()`   |
| Guard for a specific feature route  | `features/{name}/guards/`                    | `PostOwnerGuard` |
| Global auth guard                   | `core/guards/`                               | `AuthGuard`      |
