# Testing

Runner: **Vitest 4** + jsdom + `@testing-library/react`. Phase 1 set up the infrastructure on Jest; Phase 4 migrated the runner to Vitest without rewriting tests.

## Running tests

```bash
pnpm test            # one-shot (vitest run)
pnpm test:watch      # watch mode
pnpm test:coverage   # with v8 coverage report
```

Vitest config lives in [vitest.config.ts](../vitest.config.ts). Test setup (loads `@testing-library/jest-dom` matchers) in [tests/setup.js](../tests/setup.js).

`globals: true` is enabled so `describe` / `it` / `expect` / `beforeEach` / `afterEach` / `vi` are available without imports — same ergonomics as Jest.

## Where tests go

| Location | For |
|---|---|
| `tests/*.spec.js` / `*.test.js` | Repo-wide utility tests (routes regex, copyright, i18n scan) |
| `tests/common/*.spec.{js,ts}` | Tests for `src/common/` hooks and utilities |
| `tests/components/<Name>.spec.tsx` | Component tests (forthcoming) |
| `tests/helpers/*.js` | Shared test utilities (mocks, render helpers) |

Tests are discovered by Vitest's default `.spec.*` / `.test.*` match, scoped to `tests/**` via the config's `include` pattern.

## Helpers

All under [tests/helpers/](../tests/helpers/).

### `renderWithServices(ui, opts?)`

Mounts a component under the production context tree: `ServicesContext.Provider` + `RouteFocusedProvider`. Returns Testing Library's `render()` result plus the stubbed `services` object so the test can assert on `dispatch`/`analytics` mock calls.

```js
const renderWithServices = require('../helpers/renderWithServices');

const { services, getByText } = renderWithServices(<MyComponent />);
fireEvent.click(getByText('Save'));
expect(services.core.transport.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({ action: 'Save' })
);
```

Override the services object or route-focused state via `opts`:

```js
renderWithServices(<X />, {
    services: mockServices({ core: { active: false } }),
    routeFocused: false,
});
```

### `mockServices(overrides?)`

Returns a plain object shaped like `ServicesContext` (see [src/services/ServicesContext/types.d.ts](../src/services/ServicesContext/types.d.ts)) with every sub-service stubbed via `vi.fn()`. Pass per-service overrides.

### `mockCoreTransport(overrides?)`

Returns an object implementing the [CoreTransport](../src/services/Core/types.d.ts) interface — `on`/`off`/`getState`/`dispatch`/`analytics` etc. are all `vi.fn()` so tests can assert invocations or resolve custom values. An extra `__emit(name, ...args)` method pumps events to registered listeners so you can drive the React side of a hook that subscribes to transport events:

```js
const transport = mockCoreTransport({
    getState: vi.fn().mockResolvedValue({ settings: { streamingServerUrl: 'x' } })
});
// later, in the test body:
act(() => transport.__emit('NewState', 'ctx'));
```

## Hook tests

Use `renderHook` / `act` from `@testing-library/react` v16+. No separate `@testing-library/react-hooks` package.

```js
const { renderHook, act } = require('@testing-library/react');
const useBinaryState = require('../../src/common/useBinaryState');

const { result } = renderHook(() => useBinaryState(false));
act(() => result.current[1]()); // on()
expect(result.current[0]).toBe(true);
```

See the seed specs under [tests/common/](../tests/common/) for working examples: `useBinaryState`, `useLiveRef`, `useInterval`, `useTimeout`, `throttle`, `isEqual`.

## Mocking timers

The seed tests for `useInterval` / `useTimeout` / `throttle` use `vi.useFakeTimers()` / `vi.advanceTimersByTime()`. Always wrap timer advances in `act()` so React state updates flush.

## Styles and assets

CSS Modules and Less imports are mocked via [tests/helpers/styleMock.js](../tests/helpers/styleMock.js) — a Proxy that returns the string `"<className>"` for any accessed key. Components can be rendered without Less loaders in play.

## History

- **Phase 1** — added Jest + jsdom + `@testing-library/*`, helpers, seed hook tests (`useBinaryState`, `useLiveRef`, `useInterval`, `useTimeout`).
- **Phase 2** — added pin tests for third-party semantics (`throttle.spec.js`, `isEqual.spec.js`) before swapping the underlying implementations.
- **Phase 4** — swapped the runner from Jest to Vitest; same test files ran unchanged after a mechanical `jest.* → vi.*` codemod.
