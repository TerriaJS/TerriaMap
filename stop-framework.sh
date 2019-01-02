if [ -f "server.pid" ]; then
    pid=`cat "server.pid"`
    echo "(Killing old server)."
    node -e "require('process').kill(${pid})"
else
    echo "TerriaJS server not running."
fi
