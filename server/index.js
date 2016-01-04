"use strict";


var proxy = require('./proxy');
var crs = require('./crs');

var cluster = require('cluster');
var request = require('request');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

//    cpuCount = 1;  //testing

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

// Code to run if we're in a worker process
} else {

    /*global console,require,__dirname*/
    /*jshint es3:false*/

    var express = require('express');
    var fs = require('fs');
    var compression = require('compression');
    var path = require('path');
    var cors = require('cors');
    var formidable = require('formidable');
    var ogr2ogr = require('ogr2ogr');

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

    // eventually this mime type configuration will need to change
    // https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
    var mime = express.static.mime;
    mime.define({
        'application/json' : ['czml', 'json', 'geojson'],
        'text/plain' : ['glsl']
    });

    var app = express();
    app.use(compression());
    app.use(cors());
    app.disable('etag');
    app.use(express.static(path.join(__dirname, 'wwwroot')));

    var po = proxy._proxyOptions = {};
    po.upstreamProxy = argv['upstream-proxy'];
    po.bypassUpstreamProxyHosts = {};
    if (argv['bypass-upstream-proxy-hosts']) {
        argv['bypass-upstream-proxy-hosts'].split(',').forEach(function(host) {
            po.bypassUpstreamProxyHosts[host.toLowerCase()] = true;
        });
    }

    app.get('/ping', function(req, res){
      res.status(200).send('OK');
    });

    app.use('/proxy', proxy);

    app.use('/proj4def', crs);

    // provide conversion to geojson service
    // reguires install of gdal on server: sudo apt-get install gdal-bin
    app.post('/convert', function(req, res, next) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var fname, fpath, inputStream;
            var maxSize = 1000000;

            if (fields.input_url !== undefined) {
                if (fields.input_url.indexOf('http') === 0) {
                    fpath = fields.input_url;
                    fname = fpath;
                }
            } else if (files.input_file !== undefined) {
                if (files.input_file.size <= maxSize) {
                    fpath = files.input_file.path;
                    fname = files.input_file.name;
                } else {
                    console.log('Input file is too large', files.input_file.size);
                }
            }
            if (fpath === undefined) {
                res.status(500).send('Unable to convert data');
                return;
            }
            console.log('Converting', fname);

            var hint = '';
            //simple hint for now, might need to crack zip files going forward
            if (fname.toLowerCase().indexOf('.zip') === fname.length-4) {
                hint = 'shp';
            }

            if (fpath.indexOf('http') === 0) {
                 inputStream = request.get({url: fpath}).on('response', function(response) {
                    var request = this, len = 0;
                    response.on('data', function (chunk) {
                        len += chunk.length;
                        if (len > maxSize) {
                            request.abort();
                        }
                    });
                    response.on('end', function() {
                        console.log('Convert download size', len);
                    });
                });
            } else {
                inputStream = fs.createReadStream(fpath);
            }

            var ogr = ogr2ogr(inputStream, hint)
                            .skipfailures()
                            .options(['-t_srs', 'EPSG:4326']);

            ogr.exec(function (er, data) {
                if (er) {
                    console.error(er);
                }
                if (data !== undefined) {
                    res.status(200).send(JSON.stringify(data));
                } else {
                    res.status(500).send('Unable to convert data');
                }
            });
        });
    });


    //Share record storage
    app.post('/upload', function(req, res, next) {
    });


    app.get('/get/:id', function(req, res, next) {
    });


    //sample simple NM service
    app.post('/nm_service_1', function(req, res, next) {
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

    // Redirect unknown pages back home. We don't actually have a 404 page, for starters.
    app.use(function(req, res, next) {
        res.redirect(303, '/');
    });

    app.listen(argv.port, argv.public ? undefined : 'localhost');
}
