# Docker image for the primary terria map application server
FROM osgeo/gdal:alpine-small-3.1.0

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh npm


RUN mkdir -p /etc/config/client
WORKDIR /usr/src/app
COPY . .
RUN rm wwwroot/config.json && ln -s /etc/config/client/config.json wwwroot/config.json

EXPOSE 3001

CMD [ "node", "./node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]


