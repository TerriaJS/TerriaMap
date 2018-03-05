# Docker image for the primary terria map application server
FROM node:6

RUN apt-get update && apt-get install -y gdal-bin

RUN mkdir -p /usr/src/app && mkdir -p /etc/config/client
WORKDIR /usr/src/app/component
COPY . /usr/src/app
RUN rm wwwroot/config.json && ln -s /etc/config/client/config.json wwwroot/config.json

EXPOSE 3001

CMD [ "node", "./node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]
