# develop container
FROM node:14 as develop

# build container
FROM node:14 as build
USER node

COPY --chown=node:node . /app

WORKDIR /app

RUN yarn install
RUN yarn gulp release

# deploy container
FROM node:14-slim as deploy

USER node

WORKDIR /app

COPY --from=build /app/wwwroot wwwroot
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/devserverconfig.json serverconfig.json
COPY --from=build /app/index.js index.js
COPY --from=build /app/package.json package.json
COPY --from=build /app/version.js version.js

EXPOSE 3001
ENV NODE_ENV=production
CMD [ "node", "./node_modules/terriajs-server/lib/app.js", "--config-file", "serverconfig.json" ]
