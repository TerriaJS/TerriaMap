To run the docker image: 

`docker run --rm -it  -p <port>:<port>/tcp -v <host absolute path to confing.json>:/etc/config/client/config.json <image name>:<TAG>`

Command to execute to launch Terria:

`node ./node_modules/terriajs-server/lib/app.js --port <port>`
