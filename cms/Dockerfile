FROM node:22-alpine

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci

# Bypass Vite 5.4+ host check so the admin panel works behind a reverse proxy
RUN find /opt/node_modules/vite/dist/node/chunks -name '*.js' \
    -exec grep -l 'Blocked request' {} \; \
    | xargs sed -i 's/if (!hostHeader || !isHostAllowed(config, isPreview, hostHeader))/if (false)/g'

ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app && chown -R node:node /opt/node_modules
USER node
EXPOSE 1337
CMD ["npm", "run", "develop"]
