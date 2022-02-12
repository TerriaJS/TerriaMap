FROM node:10
RUN apt-get update && apt-get install -y gdal-bin
WORKDIR /usr/src/app

RUN yarn global add gulp

COPY package.json .
COPY yarn.lock .
RUN yarn install 
COPY . /usr/src/app

RUN rm wwwroot/build -fr 

RUN ls -l

RUN cat gulpfile.js

RUN npm run gulp release

EXPOSE 3001

CMD [ "node", "node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]
