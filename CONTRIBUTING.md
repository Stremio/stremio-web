# Contributing to Stremio Web

Thank you for helping improve Stremio Web.

## Before you start

- Search existing issues and pull requests before starting work.
- Discuss large features or architectural changes with the maintainers first.
- Base your branch on `development` and keep each pull request focused on one change.

## Development

Stremio Web requires Node.js 22 or newer and pnpm 11 or newer.

```sh
pnpm install
pnpm start
```

When changing code:

- Fix the root cause with the smallest practical change.
- Do not include unrelated refactors, formatting, or cleanup.
- Match the patterns and style of the surrounding code.
- Use pnpm and do not add npm or yarn lockfiles.
- Keep CommonJS in existing JavaScript files and prefer TypeScript for new files.
- Reuse existing components, hooks, helpers, aliases, and local LESS modules.
- Avoid new effects or dependencies when existing code can solve the problem directly.
- Do not add new Jest or other test files unless a maintainer requests them.

## Translations

Do not add hardcoded user-facing text. Add translation keys to the public
[`stremio-translations`](https://github.com/Stremio/stremio-translations) repository and update the dependency when needed.

Run the translation scan after changing translation keys:

```sh
pnpm run scan-translations
```

## Validation

Run the checks relevant to your change before opening a pull request:

```sh
pnpm run lint
pnpm test
pnpm run build
git diff --check
```

## Pull requests

- Use a clear branch name without tool or agent prefixes.
- Keep commit subjects, the pull request title, and its description concise.
- Use subject-only commit messages and keep unrelated changes in separate commits or pull requests.
- Explain what changed, why it changed, and how it was verified.
- Include screenshots or a short recording for visible UI changes.
- Write pull request descriptions and review replies yourself; do not paste generated responses into the review discussion.
