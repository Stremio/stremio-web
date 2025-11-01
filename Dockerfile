# Stremio Node 20.x
# the node version for running Stremio Web
ARG NODE_VERSION=20-alpine
FROM node:$NODE_VERSION AS base

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk add --no-cache git

# Meta
LABEL Description="Stremio Web" Vendor="Smart Code OOD" Version="1.0.0"

RUN mkdir -p /var/www/stremio-web
WORKDIR /var/www/stremio-web

# Setup app
FROM base AS app

COPY package.json pnpm-lock.yaml /var/www/stremio-web
RUN pnpm i --frozen-lockfile

COPY . /var/www/stremio-web
RUN pnpm build

# Setup server
FROM base AS server

RUN pnpm i express@4

# Finalize
FROM base

COPY http_server.js /var/www/stremio-web
COPY --from=server /var/www/stremio-web/node_modules /var/www/stremio-web/node_modules
COPY --from=app /var/www/stremio-web/build /var/www/stremio-web/build

EXPOSE 8080
CMD ["node", "http_server.js"]
