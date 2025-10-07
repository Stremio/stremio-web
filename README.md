# Stremio - Freedom to Stream

![Build](https://github.com/stremio/stremio-web/workflows/Build/badge.svg?branch=development)
[![Github Page](https://img.shields.io/website?label=Page&logo=github&up_message=online&down_message=offline&url=https%3A%2F%2Fstremio.github.io%2Fstremio-web%2F)](https://stremio.github.io/stremio-web/development)

Stremio is a modern media center that's a one-stop solution for your video entertainment. You discover, watch and organize video content from easy to install addons.

## Build

### Prerequisites

* Node.js 12 or higher
* [pnpm](https://pnpm.io/installation) 10 or higher

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm start
```

### Production build

```bash
pnpm run build
```

### Disable service worker

When deploying behind authentication middlewares (or for testing) you may want to
disable the generated service worker so the root page isn't served from cache.

Set the `DISABLE_SERVICE_WORKER` environment variable to `1` (or `true`) at
build-time to prevent the service worker from being generated. Additionally,
at runtime the same variable prevents the client from registering a service
worker if present.

Example (build without SW):

```bash
DISABLE_SERVICE_WORKER=1 pnpm run build
```

Example (start production server without registering SW):

```bash
DISABLE_SERVICE_WORKER=1 pnpm start-prod
```

## Screenshots

### Board

![Board](/screenshots/board.png)

### Discover

![Discover](/screenshots/discover.png)

### Meta Details

![Meta Details](/screenshots/metadetails.png)

## License

Stremio is copyright 2017-2023 Smart code and available under GPLv2 license. See the [LICENSE](/LICENSE.md) file in the project for more information.
