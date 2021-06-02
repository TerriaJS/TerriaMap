# Docker image for the primary terria map application server
ARG NODE_IMG_VERSION=14
ARG APP_CONFIG_FILE=devserverconfig.json

FROM node:${NODE_IMG_VERSION}-buster-slim as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
# ### For corporate proxies, add your CA-Cert to the dir, then uncomment below.
# COPY ./CA-Cert.crt /usr/local/share/ca-certificates/
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates
# git -- required for node package url-loader
## DELME
COPY --from=redhbr001.cgg.com/satmap/debian:buster \
    /etc/ssl/certs/ca-certificates.crt \
    /etc/ssl/certs/ca-certificates.crt
## DELME
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
# Add Proxy / CA Certs for Git, Yarn, NPM
RUN git config --global http.proxy ${http_proxy} \
    && git config --global https.proxy ${https_proxy} \
    && git config --global url."https://github.com/".insteadOf git@github.com: \
    && git config --global url."https://".insteadOf git:// \
    && git config --global http.sslCAInfo /etc/ssl/certs/ca-certificates.crt \
    && yarn config set proxy $http_proxy \
    && yarn config set https-proxy $https_proxy \
    && yarn config set no-proxy $no_proxy \
    && yarn config set cafile /etc/ssl/certs/ca-certificates.crt \
    && npm config set proxy $http_proxy \
    && npm config set https-proxy $https_proxy \
    && npm config set no-proxy $no_proxy \
    && npm config set cafile /etc/ssl/certs/ca-certificates.crt
ARG NODE_IMG_VERSION
ARG MAINTAINER
LABEL "NODE_IMG_VERSION"="${NODE_IMG_VERSION}" \
      "MAINTAINER"="${MAINTAINER}" \
      "SSL_CERT_FILE"="${SSL_CERT_FILE}"


FROM base as build
WORKDIR /opt/app
# Add TerriaMap and any modified packages (terriajs, cesium)
COPY . .
RUN yarn install
RUN npm run gulp release


FROM base as runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        gdal-bin \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Create non-root user
RUN groupadd -r terriauser -g 1001 \
    && useradd -u 1001 --no-log-init --create-home -r -g terriauser terriauser
# Move proxy config files from root to user
RUN mv /root/.npmrc /home/terriauser/.npmrc \
    && mv /usr/local/share/.yarnrc /home/terriauser/.yarnrc \
    && chown -R terriauser:terriauser /home/terriauser
WORKDIR /opt/app
COPY --from=build --chown=terriauser:terriauser \
    opt/app/node_modules ./node_modules
COPY --from=build --chown=terriauser:terriauser \
    opt/app/wwwroot ./wwwroot
COPY --from=build --chown=terriauser:terriauser \
    opt/app/*config.json .
USER terriauser:terriauser
EXPOSE 3001
ARG APP_CONFIG_FILE
ENV APP_CONFIG_FILE ${APP_CONFIG_FILE}
CMD ["sh", "-c", \
    "node ./node_modules/terriajs-server/lib/app.js \
     --config-file $APP_CONFIG_FILE"]