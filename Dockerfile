# Stremio Node 14.x
# the node version for running Stremio Web
ARG NODE_VERSION=15-alpine
FROM node:$NODE_VERSION AS base

# Meta
LABEL Description="Stremio Web" Vendor="Smart Code OOD" Version="1.0.0"

RUN apk update && apk upgrade && \
    apk add --no-cache git
RUN mkdir -p /var/www/stremio-web
WORKDIR /var/www/stremio-web

# Install app dependencies
FROM base AS prebuild

WORKDIR /var/www/stremio-web
COPY ./package*.json ./
RUN npm install

# Bundle app source
FROM prebuild AS final

WORKDIR /var/www/stremio-web
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "http_server.js"]
