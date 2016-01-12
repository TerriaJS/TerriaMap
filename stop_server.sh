if [ -f "terriajs.pid" ]; then
    pgrep -f terriajs-server > /dev/null && echo "(Killing old server)."
    kill `cat terriajs.pid`
    rm terriajs.pid
else
    echo "TerriaJS server not running."
fi