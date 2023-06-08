# Stremio Node 14.x
FROM stremio/node-base:fermium

# Meta
LABEL Description="Stremio Web" Vendor="Smart Code OOD" Version="1.0.0"

# Update GitHub remote host key
RUN echo "github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=" >> ~/.ssh/known_hosts

# Create app directory
RUN mkdir -p /var/www/stremio-web

# Install app dependencies
WORKDIR /var/www/stremio-web
COPY . /var/www/stremio-web
RUN npm install 

# Bundle app source
WORKDIR /var/www/stremio-web

RUN npm run build 

EXPOSE 8080
CMD ["node", "http_server.js"]
