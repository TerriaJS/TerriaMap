FROM node:10
RUN apt-get update && apt-get install -y gdal-bin
WORKDIR /usr/src/app

RUN yarn global add gulp

COPY . /usr/src/app

RUN rm wwwroot/build -fr 
RUN rm node_modules -fr 
 
RUN git config --global url."https://".insteadOf git://

RUN yarn install 

RUN npm run celec-init

RUN npm run gulp release

EXPOSE 3001

CMD [ "node", "node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]
