# Docker image for the primary terria map application server
FROM node:14.18.2

# declare ownership
LABEL maintainer="RENCI"

# install os updates and GDAL
RUN apt-get update && apt-get install -y gdal-bin

# install an editor
RUN apt-get install -yq vim

# create some needed dirs for the content
# this was in the original dockerfile so i kept it.
RUN mkdir -p /home/nru/usr/src/app

# change to the base directory
WORKDIR /home/nru/usr/src/app

# copy in all neccesary app dirs
COPY buildprocess ./buildprocess
COPY lib ./lib
COPY patches ./patches
COPY wwwroot ./wwwroot

# and files
COPY code .
COPY ecosystem-production.config.js .
COPY ecosystem.config.js .
COPY entry.js .
COPY gulpfile.js .
COPY index.js .
COPY package.json .
COPY terria-logo.png .
COPY tsconfig.json .
#COPY version.js .
COPY yarn.lock .
COPY devserverconfig.json .

# make sure everything is readable
RUN chmod 777 -R /home/nru

# need this for large web sites
RUN export NODE_OPTIONS=--max_old_space_size=4096

# set a couple directives so the package update works
RUN yarn config set user 0
RUN yarn config set unsafe-perm true

# get a specific version of yarn
RUN yarn policies set-version 1.22.17

# install gulp
RUN npm install gulp -g

# change to the non-root user
USER 1000

RUN git config --global url."https://".insteadOf git://

## install yarn and build up the node_modules dir
RUN yarn install

# sync terria dependancies
# although this fixes mobx version conflicts it causes other errors
# RUN npm run gulp-sync

RUN npx browserslist@latest --update-db

# create the "build" dir/files
#RUN npm run gulp build

# remove the file we will turn into a symbolic link
RUN rm /home/nru/usr/src/app/wwwroot/init/apsviz.json

# make a symbolic link to the apsviz.json file
RUN ln -s /fileserver/terria-map/apsviz.json /home/nru/usr/src/app/wwwroot/init/apsviz.json

# expose the web server port
EXPOSE 3001

# start the app
# nohup npm run gulp:watch & node ./node_modules/terriajs-server/lib/app.js
# "/bin/sh", "-c", "yarn start; while true; do date; sleep 3600; done"
CMD ["/bin/sh", "-c", "yarn start; npm run gulp:watch"]
