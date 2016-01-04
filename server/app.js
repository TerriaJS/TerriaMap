"use strict";

/**
 * Terria server, used to run NationalMap. It is primarily a static web app, but there are a couple of helper functions
 * that run server-side.
 */

// Proxy for servers that don't support CORS
var proxy = require('./proxy');

// Proj4def lookup service, to avoid downloading all definitions into the client.
var crs = require('./crs');

// OGR2OGR wrapper to allow supporting file types like Shapefile.
var convert = require('./convert');

var cluster = require('cluster');

// The master process just spins up a few workers and quits.
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    console.log('Cores Used:', cpuCount);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });
    return;
}

/*global console,require,__dirname*/
/*jshint es3:false*/

var express = require('express');
var compression = require('compression');
var path = require('path');
var cors = require('cors');

var yargs = require('yargs').options({
    'port' : {
        'default' : 3001,
        'description' : 'Port to listen on.'
    },
    'public' : {
        'type' : 'boolean',
        'default' : true,
        'description' : 'Run a public server that listens on all interfaces.'
    },
    'upstream-proxy' : {
        'description' : 'A standard proxy server that will be used to retrieve data.  Specify a URL including port, e.g. "http://proxy:8000".'
    },
    'bypass-upstream-proxy-hosts' : {
        'description' : 'A comma separated list of hosts that will bypass the specified upstream_proxy, e.g. "lanhost1,lanhost2"'
    },
    'help' : {
        'alias' : 'h',
        'type' : 'boolean',
        'description' : 'Show this help.'
    }
});
var argv = yargs.argv;

if (argv.help) {
    return yargs.showHelp();
}

var po = proxy._proxyOptions = {};
po.upstreamProxy = argv['upstream-proxy'];
po.bypassUpstreamProxyHosts = {};

if (argv['bypass-upstream-proxy-hosts']) {
    argv['bypass-upstream-proxy-hosts'].split(',').forEach(function(host) {
        po.bypassUpstreamProxyHosts[host.toLowerCase()] = true;
    });
}

// eventually this mime type configuration will need to change
// https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
var mime = express.static.mime;
mime.define({
    'application/json' : ['czml', 'json', 'geojson'],
    'text/plain' : ['glsl']
});

// initialise app with standard middlewares
var app = express();
app.use(compression());
app.use(cors());
app.disable('etag');

// Serve the bulk of our application as a static web directory.
app.use(express.static(path.join(__dirname, '../wwwroot')));
app.use('/proxy', proxy);
app.use('/proj4def', crs);
app.use('/convert', convert);
app.get('/ping', function(req, res){
  res.status(200).send('OK');
});

// Redirect unknown pages back home. We don't actually have a 404 page, for starters.
app.use(function(req, res, next) {
    res.redirect(303, '/');
});

app.listen(argv.port, argv.public ? undefined : 'localhost');

/*
//sample simple NM service. To use, uncomment and move above the fallback redirection.
app.post('/nm_service_1', function(req, res, next) {
    var formidable = require('formidable');
    //receive the posted object
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //create a layer for NM to display
        var obj = {
            name: 'Bikes Available',
            type: 'DATA',
            proxy: false,
            url: 'http://nationalmap.nicta.com.au/test/bike_racks.geojson'
        };
        //send a response with the object and display text
        res.json({ displayHtml: 'Here are the available bike racks.', layer: obj});
    });
});
*/
