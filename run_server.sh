#!/bin/bash
if [ -f "/etc/init.d/varnish" ]; then
    sudo /etc/init.d/varnish restart
fi
if [ -f terriajs.pid ]; then
    echo "Warning: server seems to be already running."
fi
# pkill -f terriajs-server
date > output.log
nohup node node_modules/terriajs-server "$@" >> output.log 2> error.log < /dev/null &
sleep 2 # Give the server a chance to fail.
cat output.log 
pid=$!
ps | grep "^\s*${pid}" > /dev/null && echo "(TerriaJS-Server running in background with pid $!)." && echo $pid > terriajs.pid
cat error.log