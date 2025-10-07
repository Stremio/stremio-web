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

### Run with Docker

```bash
docker build -t stremio-web .
docker run -p 8080:8080 stremio-web
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
