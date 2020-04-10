# Stremio - The media center you need

![Build](https://github.com/stremio/stremio-web/workflows/Build/badge.svg?branch=development)

Stremio is a modern media center that's a one-stop solution for your video entertainment. You discover, watch and organize video content from easy to install addons.

## Build

#### Prerequisites:
* Node.js 10 or higher
* yarn [__configured for use with GitHub Packages__](#authenticating-with-the-github-package-registry)

### Install dependencies:

```bash
yarn install
```

### Development:

```bash
yarn start
```

### Production:

```bash
yarn build
```

## Screenshots

### Board:
![Board](/screenshots/board.png)

### Discover:
![Discover](/screenshots/discover.png)

### Meta Details:
![Meta Details](/screenshots/metadetails.png)

## Authenticating with the GitHub Package Registry

Yarn (and NPM) need to be configured before they are able to download packages from GitHub's new [package registry](https://github.com/features/packages). You'll need to authenticate them before GitHub will let you download anything.

First, we need to generate a personal access token for your GitHub account at https://github.com/settings/tokens/new. Yarn will use this to connect to the API on your behalf. Give it a recognisable name like "Yarn @ Home PC", allow it to use the `read:packages` scope (which is all you need for interacting with the packages api).

![Example of token configuration](https://user-images.githubusercontent.com/60934058/79003747-1d25c680-7b4b-11ea-8953-0c0cdc00bae0.png)

Hit "Generate Token", copy the token that pops up, and close the window. 

> Take care of this token - it identifies **you** on GitHub

![Generated token presented next to a checkmark and button to copy it with](https://user-images.githubusercontent.com/60934058/79003880-74c43200-7b4b-11ea-967e-5ace7f490f4b.png)

Now, we need to let Yarn know about our token. Handily, Yarn uses the same configuration as NPM here, so it doesn't matter which tool you use. We can tell it to how to login to `npm.pkg.github.com` by popping this at the top of `~/.npmrc`

```
//npm.pkg.github.com/:_authToken=YOUR_AUTH_TOKEN
```

### Official GitHub Packages Documentation

- https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages#about-tokens
- https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages

## License

Stremio is copyright 2017-2020 Smart code and available under GPLv2 license. See the [LICENSE](/LICENSE.md) file in the project for more information.
