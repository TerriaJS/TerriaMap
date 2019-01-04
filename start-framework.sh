#!/bin/bash
if [ -f "/etc/init.d/varnish" ]; then
    sudo /etc/init.d/varnish restart
fi
date > server.log

if [ "`which nohup`" == "" ]; then
    # There's no nohup on Windows. We just run node without it, which is fine in a dev environment.
    (node $(dirname "$0")/app/dist/bundle-backend.js "$@" 2>&1 < /dev/null) | tee -a server.log &
else
    (nohup node $(dirname "$0")/app/dist/bundle-backend.js "$@" 2>&1 < /dev/null) | tee -a server.log &
fi

sleep 2
