#!/bin/bash

forever stopall
sudo /etc/init.d/varnish restart
nohup forever server/app.js > output.log 2> error.log < /dev/null &

