# Stremio Node 14.x
FROM stremio/node-base:fermium

# Meta
LABEL Description="Stremio Web" Vendor="Smart Code OOD" Version="1.0.0"

# Create app directory
RUN mkdir -p /var/www/stremio-web

# Install app dependencies
WORKDIR /var/www/stremio-web
COPY . /var/www/stremio-web
RUN npm install 
RUN npm install -g http-server

# Bundle app source
WORKDIR /var/www/stremio-web

RUN npm run build 

EXPOSE 8080
CMD ["http-server", "/var/www/stremio-web/build/", "-p", "8080", "-d", "false"]
