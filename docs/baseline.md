# Baseline metrics — pre-modernization

Captured: 2026-04-19 from commit `5560813b3` (head of `development`). Reference for later modernization phases to prove/disprove regression.

## Environment

| | |
|---|---|
| Node | 20 (pinned via `.nvmrc`) |
| pnpm | 10.33.0 |
| OS used for capture | Windows 11 (msys bash) |
| Hardware | Developer workstation (not CI) — wall times are indicative, not absolute |

## Build

Single production build of `pnpm build`.

| Metric | Value |
|---|---|
| `pnpm build` wall time | **59 s** |
| Webpack compile time (reported by webpack) | 47.2 s |
| Warnings | 3 (all pre-existing asset-size advisories) |
| Errors | 0 |

## Bundle sizes

Output under `build/<commit-hash>/`. Sizes are raw bytes on disk; gzip column computed with default `gzip` (level 6).

| Asset | Raw | Gzip |
|---|---|---|
| `scripts/main.js` | 7,656,089 B (7.30 MiB) | **2,234,167 B (2.13 MiB)** |
| `scripts/worker.js` | 24,314 B (23.74 KiB) | 7,922 B (7.74 KiB) |
| `styles/main.css` | 293,095 B (286.22 KiB) | 35,451 B (34.62 KiB) |
| `binaries/stremio_core_web_bg.wasm` | 5,187,534 B (4.95 MiB) | n/a (already compressed binary) |
| Service-worker precache claim | ~17.3 MB total, 27 URLs | |

Main entrypoint total (main.js + main.css + auxiliary assets): **7.58 MiB raw / ~2.17 MiB gzip**.

Webpack's own bundle-size warnings (all pre-existing):
- `main.css` (286 KiB) exceeds 244 KiB recommended asset size.
- `main.js` (7.3 MiB) vastly exceeds it.
- Main entrypoint (7.58 MiB) exceeds 244 KiB recommended entrypoint size.

## Tests

| Metric | Value |
|---|---|
| `pnpm test` wall time | **2.4 s** |
| Suites | 3 (`tests/copyright.spec.js`, `tests/routesRegexp.spec.js`, `tests/i18nScan.test.js`) |
| Tests | **70 passing** |
| Tests covering React components | 0 |
| Tests covering hooks | 0 |
| Tests covering route flows | 0 |
| Integration / E2E tests | 0 |

## Lint

| | |
|---|---|
| `pnpm lint` | clean (0 warnings, 0 errors) |

## Type check

| | |
|---|---|
| `pnpm exec tsc --noEmit` | **15 errors** reported in `src/` (exits 0 because `strict: false` and `checkJs: false`) |

Representative examples:
- `src/common/FileDrop/utils.ts(13,31)` — `Buffer`/`Uint8Array` incompatibility
- `src/common/usePlayUrl.ts(2,20)` — `magnet-uri` has no declaration file
- `src/routes/Calendar/Placeholder/Placeholder.tsx(18,18)` — missing `Image` props (`fallbackSrc`, `renderFallback`, `onError`)
- `src/routes/Calendar/Table/Cell/Cell.tsx(48,33)` — `string | undefined` not assignable to `string`

These are latent issues in `.ts`/`.tsx` files today, unsurfaced by CI because type-check is not gated.

## Source files in `src/`

| | Count |
|---|---|
| `.js` / `.jsx` | **224** |
| `.ts` / `.tsx` | 195 |
| `.less` | 117 |
| Files importing `prop-types` (via `require`) | **71** |

TS coverage (by file count): ~46.5%.

## Library swap targets

Count of files importing each dep earmarked for replacement in Phase 2.

| Import | Files |
|---|---|
| `classnames` | 34 |
| `lodash.debounce` / `.throttle` / `.intersection` | 8 |
| `fast-equals` | 1 |

## What's intentionally not captured

- **Cold dev-server startup time** — requires interactive measurement of `pnpm start` over HTTPS; deferred to pre-Phase-3 spike where the Webpack-vs-Vite delta is the headline number.
- **HMR time for `.less` / `.jsx` edits** — same reason.
- **Lighthouse performance score** — requires serving the prod build and running headless Chrome; will be captured in Phase 8 alongside post-modernization comparison.

## Later-phase targets (restated)

| Metric | Baseline (here) | Target |
|---|---|---|
| `pnpm build` wall time | 59 s | ≥ 3× faster |
| `main.js` gzip | 2.13 MiB | −10% or better |
| Test count | 70 | 150+ |
| `tsc --noEmit` errors | 15 | 0 under `strict: true` |
| `.js` / `.jsx` in `src/` | 224 | 0 |
| `prop-types` dep | present (71 files) | removed |
