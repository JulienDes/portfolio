# ADR-0009: Husky and lint-staged as Commit Quality Gate

## Status

Accepted — 2026-04

## Context

Code style and formatting inconsistencies accumulate quickly in a team setting. Relying on developers to manually run the linter and formatter before every commit is unreliable. CI catches these issues, but only after the commit is already in the repository — creating noise in the git history and slowing down review cycles.

A pre-commit hook that runs automatically and blocks the commit if it fails is the right place to enforce formatting and linting. The challenge is that running the full linter on the entire codebase before every commit is slow. Only the staged files should be checked.

## Decision

Use **Husky** to manage Git hooks and **lint-staged** to scope checks to staged files only.

### Pre-commit hook

On every `git commit`, the pre-commit hook runs lint-staged, which:
1. Runs `prettier --write` on staged `.ts`, `.html`, `.scss`, and `.json` files.
2. Runs `eslint --fix` on staged `.ts` and `.html` files.
3. Re-stages any files that were auto-fixed.

If lint-staged exits with an error (a rule that cannot be auto-fixed), the commit is blocked and the developer must fix the issue manually.

### Commit-msg hook

A `commit-msg` hook runs `commitlint` to enforce [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `chore:`, etc.). This keeps the git history readable and enables automated changelog generation if desired.

Configuration lives in:
- `.husky/pre-commit`
- `.husky/commit-msg`
- `.lintstagedrc.json`
- `commitlint.config.js`

## Consequences

### Positive

- **Consistent codebase.** Formatting and linting are enforced mechanically, not by convention or code review comments.
- **Fast.** lint-staged only processes changed files. A typical commit adds less than 500ms of overhead.
- **Clean history.** Conventional Commits make it trivial to understand what changed and why when reading `git log`.
- **CI stays green.** Formatting failures are caught before they reach CI, not after.

### Negative / Tradeoffs

- **Can be bypassed.** `git commit --no-verify` skips hooks. This is intentional — developers must be able to make emergency commits. CI should run the same checks as a backstop.
- **Initial setup friction.** Husky hooks are installed via `prepare` script in `package.json`. Developers must run `bun install` (or equivalent) after cloning for hooks to activate. This is standard practice but occasionally forgotten.

## Alternatives Considered

### Enforce formatting and linting only in CI

Rejected. CI feedback is slow (minutes) and the fix requires an additional commit. Pre-commit hooks catch the same issues in seconds and prevent the bad commit from ever entering the history.

### Run linter on the full codebase pre-commit

Rejected. On a large project, linting all files takes 10–30 seconds. That friction leads developers to use `--no-verify`. lint-staged scoping keeps the hook fast enough that bypassing it is never tempting.
