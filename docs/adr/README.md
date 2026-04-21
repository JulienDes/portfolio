# Architecture Decision Records

This folder contains the reasoning behind the major architectural choices in this template.

Each ADR documents:

- **Context** — what situation prompted the decision
- **Decision** — what I chose
- **Consequences** — what I gain and what I give up
- **Alternatives considered** — what I rejected and why

ADRs are **immutable once accepted**. If a decision is revisited, write a new ADR that supersedes the old one and update the status.

---

## Index

| #    | Title                                                                                    | Status   |
| :--- | :--------------------------------------------------------------------------------------- | :------- |
| 0001 | [Feature-First Architecture](./0001-feature-first-architecture.md)                       | Accepted |
| 0002 | [Standalone Components Only](./0002-standalone-components-only.md)                       | Accepted |
| 0003 | [Signals as State Primitive](./0003-signals-as-state-primitive.md)                       | Accepted |
| 0004 | [ApiService + httpResource for Data Fetching](./0004-http-wrapper-and-resource-state.md) | Accepted |
| 0005 | [Dark/Light Theme Strategy](./0005-dark-light-theme-strategy.md)                         | Accepted |
| 0006 | [Angular Material with Design Tokens](./0006-angular-material-design-tokens.md)          | Accepted |
| 0007 | [Vitest over Karma](./0007-vitest-over-karma.md)                                         | Accepted |
| 0008 | [Playwright for E2E Testing](./0008-playwright-for-e2e.md)                               | Accepted |
| 0009 | [Husky and lint-staged as Quality Gate](./0009-husky-lint-staged.md)                     | Accepted |
| 0010 | [File Naming Conventions — Angular 21 Style Guide](./0010-file-naming-conventions.md)    | Accepted |

---

## Writing a New ADR

1. Copy the format of an existing ADR.
2. Number it sequentially (`NNNN-kebab-case-title.md`).
3. Once merged, update this index.
