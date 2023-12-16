FROM node:alpine AS build
WORKDIR /web

RUN apk add --no-cache git

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN echo '{"configs":[{"path":"*","fileExtension":"*","headers":[{"key":"cache-control","value":"public, max-age=7200"}]}]}' >> headerConfig.json

FROM pierrezemb/gostatic:latest

LABEL Description="Stremio Web" Vendor="Smart Code OOD" Version="1.0.0"

COPY --from=build /web/build/ /srv/http/
COPY --from=build /web/headerConfig.json /config/

EXPOSE 8080
ENTRYPOINT ["/goStatic","-port","8080"]