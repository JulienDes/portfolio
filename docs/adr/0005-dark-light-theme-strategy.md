# ADR-0005: Dark/Light Theme Strategy

## Status

Accepted — 2026-04

## Context

Modern web apps are expected to support both light and dark themes. There are several approaches: CSS media queries only, a class toggled on the root element, CSS custom properties, or a combination. The solution must:

1. Respect the OS-level `prefers-color-scheme` preference on first load.
2. Allow the user to override the OS preference and persist that choice.
3. Apply instantly on page load with no flash of wrong theme.
4. Work seamlessly with Angular Material's theming system.

## Decision

**Theme is controlled by a `dark` class on `<html>`**, set before Angular boots to prevent flash.

### How it works

1. `src/index.html` contains an inline `<script>` that runs synchronously before the page renders. It reads `localStorage.getItem('theme')`. If absent, it falls back to `window.matchMedia('(prefers-color-scheme: dark)')`. It sets `document.documentElement.classList.toggle('dark', isDark)` immediately.

2. `ThemeService` (in `core/`) mirrors this logic in Angular. It exposes:
   - `isDark: Signal<boolean>` — current state.
   - `toggle()` — flips the theme and persists to `localStorage`.
   - `setTheme(theme: 'light' | 'dark' | 'system')` — explicit control.

3. SCSS uses the class selector to scope theme-specific overrides:
   ```scss
   :root { --color-background: #{$color-light-bg}; }
   :root.dark { --color-background: #{$color-dark-bg}; }
   ```

4. Angular Material's theme is defined with `color-scheme: light dark` and uses `mat.theme()` with both light and dark palettes. The `dark` class activates the dark palette.

No toggle component is provided. `ThemeService` is ready — wire `toggle()` to whatever button or menu fits the app's design.

## Consequences

### Positive

- **No flash.** The inline script runs synchronously before any paint, so the correct theme is applied before Angular loads.
- **OS preference respected.** Users who have not expressed a preference get the theme that matches their OS.
- **Persistent override.** A user's explicit choice survives navigation and refresh.
- **Single source of truth.** The `dark` class drives both CSS variables and Material theming — no two separate toggle mechanisms.

### Negative / Tradeoffs

- **Inline script in `index.html`.** It is small (~5 lines) and necessary, but it is code outside Angular's build system. It must be kept in sync manually if the theme key or logic changes.
- **Class on `<html>` is global.** There is no per-component or per-subtree theming. This is intentional — partial dark mode is a UX anti-pattern.

## Alternatives Considered

### CSS `prefers-color-scheme` media query only

Rejected. There is no way to let the user override the OS preference. Many users want a dark site even when their OS is in light mode.

### Angular service sets theme after bootstrap

Rejected. Angular boots after the first paint. Setting the theme in `ngOnInit` or `APP_INITIALIZER` causes a visible flash from the default (light) theme to the user's preferred theme.
