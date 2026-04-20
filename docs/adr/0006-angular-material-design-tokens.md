# ADR-0006: Angular Material with Design Tokens

## Status

Accepted — 2026-04

## Context

The template needs a UI component library and a theming system that:

1. Provides accessible, production-quality components out of the box.
2. Can be customized without fighting the library's defaults.
3. Supports both light and dark modes through a single configuration.
4. Makes it easy to change brand colors, typography, and shape globally — ideally as part of project initialization.

Angular Material is the natural choice for Angular projects. The question is how to structure the theming layer on top of it.

Angular Material v3 (M3) uses `mat.theme()` with CSS custom properties under the hood. This means Material component styles can respond to CSS variable changes at runtime — making dynamic theming practical.

## Decision

**Angular Material is the component library. Design tokens are the customization layer.**

### Token file

All brand decisions live in `src/styles/_tokens.scss`. This is the **only file that changes when rebranding a project**:

```scss
// Brand colors
$color-primary:    #6750A4;
$color-secondary:  #625B71;
$color-tertiary:   #7D5260;
$color-error:      #B3261E;

// Surface colors (light)
$color-light-bg:   #FFFBFE;
$color-light-surface: #FFFBFE;

// Surface colors (dark)
$color-dark-bg:    #1C1B1F;
$color-dark-surface: #1C1B1F;

// Typography
$font-family:      'Inter', sans-serif;
$font-size-base:   16px;

// Shape
$border-radius-sm: 4px;
$border-radius-md: 12px;
$border-radius-lg: 28px;
```

These variables are consumed in two places:
- `src/styles/_material-theme.scss` — feeds `mat.theme()` to configure Material components.
- `src/styles/global.scss` — exports them as CSS custom properties on `:root` for use in custom components.

### Init script

`scripts/init-theme.js` is a Node script (run once after cloning) that prompts for primary color, font family, and border radius, then patches `_tokens.scss`. This is the intended customization path — not manual file editing.

## Consequences

### Positive

- **Single source of truth.** Changing the primary color in `_tokens.scss` updates Material components, custom components, and CSS variables simultaneously.
- **Easy rebranding.** The init script lets a developer customize the template in under a minute without reading Material's theming docs.
- **Dark mode is automatic.** Both Material and custom styles react to the `dark` class (ADR-0005) because they both read from the same token variables.

### Negative / Tradeoffs

- **SCSS dependency.** The token layer requires SCSS. Projects that want to use plain CSS or a different preprocessor need to adapt the approach.
- **Material M3 opinions.** Material's shape and motion defaults are opinionated. Some projects will want to override more than just the tokens. That is possible but outside the scope of this template.

## Alternatives Considered

### Tailwind CSS instead of Angular Material

Rejected for this template. Tailwind provides utilities, not components. A Tailwind-based template would require building or integrating accessible components (dialogs, date pickers, autocomplete) from scratch. Angular Material provides these out of the box. A Tailwind variant of this template could exist separately.

### No component library — raw CSS only

Rejected. The template aims to be immediately usable on real projects. Accessibility and interaction behavior of form controls, dialogs, and overlays is significant work that Angular Material handles correctly.

### CSS custom properties without SCSS variables

Rejected. SCSS variables are easier to use in `mat.theme()` calls, which expect SCSS color values. The final output is CSS custom properties on `:root` regardless.
