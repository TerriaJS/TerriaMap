# Docker image for the primary terria map application server
FROM node:10

RUN apt-get update && apt-get install -y gdal-bin

RUN mkdir -p /usr/src/app && mkdir -p /etc/config/client
WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm install
COPY . /usr/src/app

RUN ln -s /etc/config/client/config.json wwwroot/config.json

