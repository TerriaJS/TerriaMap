/* jshint node: true */
"use strict";

var options = require('./options');
var fs = require('fs');
var exists = require('./exists');
var cluster = require('cluster');
var makeserver = require('./makeserver');

function portInUse(port, host, callback) {
    var server = require('net').createServer();

    server.listen(port, host);
    server.on('error', function () {
        callback(true);
    });
    server.on('listening', function () {
        server.close();
        callback(false);
    });
}

function error(message) {
    console.error('Error: ' + message);
    process.exit(1);
}

function warn(message) {
    console.warn('Warning: ' + message);
}



function runMaster() {
    function handleExit() {
        console.log('(TerriaJS-Server exiting.)');
        if (fs.existsSync('terriajs.pid')) {
            fs.unlinkSync('terriajs.pid');
        }
        process.exit(0);
    }


    var cpuCount = require('os').cpus().length;
    // Let's equate non-public, localhost mode with "single-cpu, don't restart".
    if (options.listenHost === 'localhost') {
        cpuCount = 1;
    }
    console.log('Serving directory "' + options.wwwroot + '" on port ' + options.port + ' to ' + (options.listenHost ? options.listenHost: 'the world') + '.');
    require('./controllers/convert')().testGdal();

    if (!exists(options.wwwroot)) {
        warn('"' + options.wwwroot + '" does not exist.');
    } else if (!exists(options.wwwroot + '/index.html')) {
        warn('"' + options.wwwroot + '" is not a TerriaJS wwwroot directory.');
    } else if (!exists(options.wwwroot + '/build')) {
        warn('"' + options.wwwroot + '" has not been built. You should do this:\n\n' +
            '> cd ' + options.wwwroot + '/..\n' +
            '> gulp\n');
    }

    if (typeof options.settings.allowProxyFor === 'undefined') {
        warn('The configuration does not contain a "allowProxyFor" list.  The server will proxy _any_ request.');
    }

    process.on('SIGTERM', handleExit);

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        if (!worker.suicide) {
            // Replace the dead worker if not a startup error like port in use.
            if (options.listenHost === 'localhost') {
                console.log('Worker ' + worker.id + ' died. Not replacing it as we\'re running in non-public mode.');    
            } else {
                console.log('Worker ' + worker.id + ' died. Replacing it.');
                cluster.fork();
            }
        }
    });

    fs.writeFileSync('terriajs.pid', process.pid.toString());
    console.log('(TerriaJS-Server running with pid ' + process.pid + ')');

    console.log('Launching ' +  cpuCount + ' worker processes.');

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
}

function startServer(options) {
    makeserver(options).listen(options.port, options.listenHost);
}

if (cluster.isMaster) {
    // The master process just spins up a few workers and quits.
    console.log ('TerriaJS Server ' + require('../package.json').version);
    options.init();

    if (fs.existsSync('terriajs.pid')) {
        warn('TerriaJS-Server seems to already be running.');
    }
    portInUse(options.port, options.listenHost, function (inUse) {
        if (inUse) {
            error('Port ' + options.port + ' is in use. Exiting.');
        } else {
            if (options.listenHost !== 'localhost') {
                runMaster();
            } else {
                // Let's equate non-public, localhost mode with "single-cpu, don't restart".
                startServer(options);
            }
        }
    });
    return;
} else {
    // We're a forked process.
    options.init(true);
    startServer(options);
}
