# Docker image for the primary terria map application server
# Intended for use only with a "context" directory created by create-docker-context.js
FROM node:16-slim

RUN mkdir -p /etc/config/client

USER node
WORKDIR /usr/src/app
COPY --chown=node:node component /usr/src/app

EXPOSE 3001
ENV NODE_ENV=production
CMD [ "node", "./node_modules/terriajs-server/lib/app.js", "--config-file", "serverconfig.json" ]
