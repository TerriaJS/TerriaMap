# Docker image for the primary terria map application server
FROM node:6

RUN apt-get update && apt-get install -y gdal-bin

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app/component

EXPOSE 3001

ENTRYPOINT [ "node", "./node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]
