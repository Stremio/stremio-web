Can I replace webpack with rsbuild in this project?

Cursor (auto):

Yes, you can replace Webpack with Rsbuild here. Rsbuild sits on Rspack (webpack-style APIs), so
this is a migration, not a rewrite of the app.

# What maps cleanly

- ✅ React + TS: Rsbuild’s defaults (usually SWC) can replace babel-loader, ts-loader, and thread-loader.
- ✅ Less + PostCSS: Supported via Rsbuild plugins / tools.postcss (you can keep your cssnano setup).
- ✅ Aliases (stremio, stremio-router): resolve.alias in Rsbuild.
- ✅ Static copies (CopyWebpackPlugin patterns): output.copy or rspack CopyRspackPlugin.
- ✅ Env + ProvidePlugin (Buffer): source.define / tools.rspack.plugins.
- ✅ Multi-entry (main + worker from @stremio/stremio-core-web): source.entry with two entries.
- ✅ Asset rules (fonts, images, wasm): Rsbuild/Rspack asset handling + output.filename patterns.
- ✅ Dev server (0.0.0.0, HTTPS, no HMR): Rsbuild server options can mirror that.

# Things to plan for explicitly

1. Output layout with git commit

You use COMMIT_HASH in paths for scripts, styles, wasm, and SW caching. Rsbuild can do custom output.filename / output.distPath, but you’ll reimplement the same idea in rsbuild.config (still git rev-parse or CI env).

2. ✅ Workbox

workbox-webpack-plugin has had compatibility issues with Rspack; many teams use a Rspack-oriented Workbox plugin (for example community options like @aaroon/workbox-rspack-plugin) or generate the service worker outside the bundler. Treat SW generation as the highest-risk part of the migration and validate the built build/ folder and offline behavior.

3. HTML template

You rely on html-webpack-plugin with inject: false and custom template params (faviconsPath, imagesPath). Rsbuild’s HTML plugin may need a small template or config adjustment so those paths still resolve the same way.

4. CSS modules naming

You use localIdentName: '[local]-[hash:base64:5]' and esModule: false. Check Rsbuild’s CSS modules options so class names and import behavior stay compatible with existing Less files. 5.

5. Minify target

Terser is set to ecma: 5, which points to older browsers. Rsbuild/SWC defaults are often more modern; if you must keep ES5 output, you’ll align output.target / minifier settings with product requirements.

6. Repo scripts & Docker

package.json scripts and Dockerfile only need to call rsbuild dev / rsbuild build instead of webpack; pnpm build can stay the same command name if you point it at Rsbuild.

# Bottom line

Feasible yes, with moderate effort: one new config file, dependency churn (drop most webpack-specific packages), and focused QA on PWA/service worker, CSS module class names, and any edge cases from moving Babel/ts-loader → SWC. If you want to proceed, the next step is a spike: Rsbuild config with both entries, copy + HTML, then Workbox last.
