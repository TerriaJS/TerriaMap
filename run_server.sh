#!/bin/bash
if [ -f "/etc/init.d/varnish" ]; then
    sudo /etc/init.d/varnish restart
fi
if [ -f terriajs.pid ]; then
    echo "Warning: server seems to be already running."
fi
date > output.log

if [ "`which nohup`" == "" ]; then
    # There's no nohup on Windows. We just run node without it, which is fine in a dev environment.
    node node_modules/terriajs-server "$@" >> output.log 2> error.log < /dev/null &
else
    nohup node node_modules/terriajs-server "$@" >> output.log 2> error.log < /dev/null &
fi
sleep 2 # Give the server a chance to fail.
cat output.log 
pid=$!
ps | grep "^ *${pid}" > /dev/null
running=$?
if [ $running -eq 0 ]; then
    echo "(TerriaJS-Server running in background with pid $!)." && echo $pid > terriajs.pid
    if [ ! -f wwwroot/build/nationalmap.js ]; then
        echo "Warning: TerriaJS-Server is running, but NationalMap has not been built yet. To build it, now run: "
        echo "     gulp watch"
        echo 
    fi

else
    cat error.log
fi

