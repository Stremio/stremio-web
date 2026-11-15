# Testing dual subtitles on Linux

Requires Node >=22, pnpm >=11 and the Stremio Linux Flatpak with mpv secondary subtitle support.

```sh
pnpm install --frozen-lockfile
pnpm run build
python -m http.server 18080 --bind 127.0.0.1 --directory build
```

Close Stremio normally, then in another terminal:

```sh
flatpak run com.stremio.Stremio --url http://127.0.0.1:18080
```

The local web origin has separate browser storage; sign in if needed. Select a primary subtitle, open the Secondary tab, choose a language and exact variant. Secondary has separate delay and vertical position controls. Language and height are remembered locally; delay resets for each video. Secondary Off disables automatic secondary selection. The normal subtitle Off control clears both active tracks.

To return to normal Stremio, close the test window, stop the HTTP server with Ctrl+C, and launch Stremio normally. No installed package is replaced.

## Scope

Linux native playback only. Secondary supports HTTP(S) add-on tracks and embedded text tracks; not dropped local files or bitmap subtitles. Secondary ASS styling is stripped by mpv. Primary behavior and styling remain unchanged.

## Validation

Native wrapper harness: disabled path, independent controls, stale completion rejection, fallback failures, 100 cleanup cycles, primary ID isolation passed.
Real headless mpv integration: French/Arabic cues, seek, independent position/delay, HTTP subtitle loading, 20 switching cycles and cleanup passed. Translation tests: 51 passed.

Full GUI playback, Arabic visual shaping, casting regression and CPU/GPU/memory comparisons remain manual acceptance checks; headless tests do not establish those results. Type checking currently reports upstream errors outside this feature. No upstream PR has been opened.

Production build passed (two bundle-size warnings). Web tests: 70 passed, including the translation scan. Web lint: zero errors, 242 warnings within the existing budget. The scan-translations script could not find pnpx; its Jest test passed in the full suite.
