Before build the image the following env variable needs to be ser:
`export DOCKER_BUILDKIT=1`

To run the docker image: 

`docker run --rm -it  -p <port>:<port>/tcp -v <host absolute path to client config.json>:/etc/config/client/config.json <host absolute path to server config.json>:/etc/config/server/serverconfig.json <image name>:<TAG>`

Command to execute to launch Terria:

`node ./node_modules/terriajs-server/lib/app.js --config-file <path to serverconfig.json>`

