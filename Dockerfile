# Docker image for the primary terria map application server
FROM node:14.18.2

# declare ownership
LABEL maintainer="RENCI"

# install os updates and GDAL
RUN apt-get update && apt-get install -y gdal-bin

# install an editor
RUN apt-get install -yq vim

# create the non-root user
RUN useradd -m -d /home/nru -u 1001 nru

# create some needed dirs for the content
# this was in the original dockerfile so i kept it.
RUN mkdir -p /home/nru/usr/src/app

# change to the base directory
WORKDIR /home/nru/usr/src/app

# copy in all app files
COPY . /home/nru/usr/src/app

# make sure everything is readable
RUN chmod 777 -R /home/nru

# change to that user
USER nru

# need this for large web sites
RUN export NODE_OPTIONS=--max_old_space_size=4096

# set a couple directives so the package update works
RUN yarn config set user 0
RUN yarn config set unsafe-perm true

# install yarn and build up the node_modules dir
RUN yarn install

# expose the web server port
EXPOSE 3001

# start the app
CMD [ "node", "./node_modules/terriajs-server/lib/app.js"]
