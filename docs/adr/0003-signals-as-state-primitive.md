# ADR-0003: Signals as State Primitive

## Status

Accepted — 2026-04

## Context

Angular applications need a way to manage reactive state — both local UI state and derived state from async operations. Historically this was done with `BehaviorSubject` from RxJS, sometimes backed by NgRx for global state.

Angular 16 introduced Signals as a first-class reactive primitive. Angular 17+ shipped `toSignal()` and `toObservable()` bridges. Angular 19 introduced `resource()` for async signals. The ecosystem is clearly moving in this direction.

The question is whether to standardize on Signals, keep RxJS observables, use a full state management library, or mix them.

## Decision

**Signals are the default reactive primitive** for all state in this template:

- Local UI state: `signal<T>()` and `computed()`.
- Async/server state: managed by TanStack Query (see ADR-0004), which exposes its result as a signal.
- Derived state: `computed()` over signals — no manual subscription management.
- Cross-component state: `signal()` in a service with `providedIn: 'root'` when genuinely global.

RxJS is not banned — `HttpClient` returns Observables, and some Angular APIs require them. Bridging is done at the boundary with `toSignal()`. The rest of the codebase does not see Observables.

NgRx and other external state managers are out of scope for this template.

## Consequences

### Positive

- **No subscription management.** No `subscribe()`, no `takeUntilDestroyed()`, no memory leak risk from forgotten unsubscribes.
- **Synchronous reads.** `mySignal()` reads the current value anywhere — no async pipe needed in templates.
- **Fine-grained reactivity.** Angular only re-renders the parts of the template that read a changed signal.
- **Aligned with Angular's direction.** The framework is optimizing for signal-based change detection; Zone.js is being phased out.

### Negative / Tradeoffs

- **RxJS operators lost.** Complex async compositions (`switchMap`, `debounceTime`, `combineLatest`) are natural in RxJS and awkward with signals. For these cases, keep the logic in an Observable and bridge at the last step with `toSignal()`.
- **Signals are synchronous.** They cannot represent "pending" or "error" states natively. This is why TanStack Query handles async state rather than a raw signal.

## Alternatives Considered

### RxJS BehaviorSubject throughout

Rejected. Requires manual subscription and unsubscription everywhere. The `async` pipe helps in templates but adds friction. The ecosystem is moving away from this pattern.

### NgRx

Rejected for this template. NgRx is powerful for large teams with complex shared state, but its boilerplate (actions, reducers, selectors, effects) is disproportionate for the apps this template targets. Projects that genuinely need NgRx can add it.
