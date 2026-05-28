FROM node:22-alpine

# su-exec: lightweight setuid helper for Alpine — used in entrypoint to fix volume permissions
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git su-exec

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN npm install -g node-gyp

WORKDIR /opt/
RUN chown node:node /opt/
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 && npm ci

# Bypass Vite 5.4+ host check so the admin panel works behind a reverse proxy
RUN find /opt/node_modules/vite/dist/node/chunks -name '*.js' \
    -exec grep -l 'Blocked request' {} \; \
    | xargs sed -i 's/if (!hostHeader || !isHostAllowed(config, isPreview, hostHeader))/if (false)/g'

ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY --chown=node:node . .

USER root
RUN printf '#!/bin/sh\nchown -R node:node /opt/app/public/uploads\nexec su-exec node "$@"\n' \
    > /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 1337
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "develop"]
