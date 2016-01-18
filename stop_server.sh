if [ -f "terriajs.pid" ]; then
    pid=`cat terriajs.pid`
    ps | grep "^ *${pid}" > /dev/null
    running=$?
    if [ $running -eq 0 ]; then
        echo "(Killing old server)."
        kill $pid
    fi
    rm terriajs.pid
else
    echo "TerriaJS server not running."
fi