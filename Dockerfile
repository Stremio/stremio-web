# Stremio Node 14.x
# the node version for running Stremio Web
ARG NODE_VERSION=20-alpine
FROM node:$NODE_VERSION AS base

# Meta
LABEL Description="Stremio Web" Vendor="Smart Code OOD" Version="1.0.0"

RUN mkdir -p /var/www/stremio-web
WORKDIR /var/www/stremio-web

# Install app dependencies
FROM base AS prebuild

RUN apk update && apk upgrade && \
    apk add --no-cache git
WORKDIR /var/www/stremio-web
COPY . .
RUN npm install
RUN npm run build

# Bundle app source
FROM base AS final

WORKDIR /var/www/stremio-web
COPY . .
COPY --from=prebuild /var/www/stremio-web/node_modules ./node_modules
COPY --from=prebuild /var/www/stremio-web/build ./build

EXPOSE 8080
CMD ["node", "http_server.js"]
