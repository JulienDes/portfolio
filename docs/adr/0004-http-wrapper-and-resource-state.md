# ADR-0004: ApiService + httpResource for Data Fetching

## Status

Accepted — 2026-04

## Context

Every feature that fetches data from an API needs to handle loading state, error state, and the data itself consistently. A bare `HttpClient` call forces every service and component to re-implement this handling.

Angular's `httpResource()` and `rxResource()` APIs solve this natively. They are experimental in Angular 21 but **confirmed to stabilize in Angular 22**, with the API shape frozen. The Angular team does not break experimental APIs carelessly this late in a release cycle.

The template adopts them now to eliminate a custom wrapper that would only exist to be deleted.

## Decision

Two layers handle all HTTP and async state:

### 1. `ApiService` — URL construction and transport

A single injectable service that wraps `HttpClient`. It handles:
- Base URL injection via `APP_CONFIG`.
- Default headers (Content-Type, Accept).
- Error normalisation — maps `HttpErrorResponse` to a typed `ApiError`.

Feature services inject `ApiService` to build full request URLs and options. They never inject `HttpClient` directly. Since `httpResource()` uses `HttpClient` under the hood, all interceptors (auth token injection, error handling) apply automatically.

```typescript
// core/http/api.service.ts
url(path: string): string  // resolves against base URL
get<T>(path: string): Observable<T>
post<T>(path: string, body: unknown): Observable<T>
put<T>(path: string, body: unknown): Observable<T>
patch<T>(path: string, body: unknown): Observable<T>
delete<T>(path: string): Observable<T>
```

`get/post/put/patch/delete` are used for mutations and one-off calls. Reads use `httpResource()` directly.

### 2. `httpResource()` — signal-based reads

Feature services expose data as `HttpResourceRef<T>`, which provides:

```typescript
resource.value()      // Signal<T | undefined>
resource.hasValue()   // Signal<boolean>
resource.isLoading()  // Signal<boolean>
resource.error()      // Signal<unknown>
resource.status()     // Signal<'idle' | 'loading' | 'resolved' | 'error'>
resource.reload()     // manually re-trigger the fetch
```

The URL factory reads signals, so re-fetching on param changes is automatic:

```typescript
// features/profile/services/profile.service.ts
readonly profile = httpResource<User>(
  () => this.api.url('/profile')
);

// features/post/services/post.service.ts
readonly post = httpResource<Post>(
  () => this.api.url(`/posts/${this.postId()}`)
);
```

Templates read the signals directly:

```html
@if (profile.isLoading()) { <app-spinner /> }
@else if (profile.error()) { <app-error /> }
@else if (profile.hasValue()) { <app-profile-card [user]="profile.value()!" /> }
```

Mutations remain plain `Observable` methods on the service — they are one-off operations, not ongoing state. Callers invoke `resource.reload()` after a successful mutation to refresh the relevant resource.

### Angular 22 upgrade

When upgrading to Angular 22, remove the `experimental` note from this ADR. No code changes are required — the import path and API surface are identical between the experimental and stable versions.

## Consequences

### Positive

- **No custom wrapper.** The template ships zero lines of state management infrastructure.
- **Reactive by default.** Signal-dependent URL factories re-fetch automatically when inputs change — no manual effect or subscription needed.
- **Interceptors work.** Auth token injection and error interceptors apply to all `httpResource()` calls.
- **Consistent shape.** Every async read exposes the same `{ value, hasValue, isLoading, error, status, reload }` interface.
- **Future-proof.** The experimental API is the stable API — v22 only removes the flag.

### Negative / Tradeoffs

- **Experimental import.** Until Angular 22, the import carries the experimental tag. Breaking changes are technically permitted, though considered very unlikely given the confirmed stabilization timeline.
- **No built-in caching.** `httpResource()` does not cache across component instances. Service scope controls sharing — `providedIn: 'root'` shares state app-wide; component-provided services are local.
- **Mutations are separate.** There is no mutation state abstraction. Feature services expose mutation methods as plain Observables; callers manage pending/error state locally if needed.

## Alternatives Considered

### Custom `createResource()` wrapper mirroring `httpResource()`

Rejected. Writing a wrapper to mirror an API that already exists adds code that exists only to be deleted. Given the confirmed v22 timeline, the experimental risk does not justify the maintenance cost.

### TanStack Query

Rejected. Introduces a significant external dependency with its own mental model (query keys, stale time, cache invalidation). For apps that need cross-component caching and background sync, TanStack Query is the right tool — but it should be added deliberately per project, not baked into a template.

### Raw `HttpClient` with `async` pipe

Rejected. Forces every template to handle loading/error states independently with no consistent shape.
