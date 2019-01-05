'use strict';

// Using require as it is simpler instead of typescript's import/export derived syntax. 
// See typescript's "export = and import = require()" modules documentation section. 
// Documentation: https://www.typescriptlang.org/docs/handbook/modules.html
// This works well with the existing codebase.

var fs = require('fs');
var cluster = require('cluster');
var exists = require('./exists');
var opts = require('./options');
var configureserver = require('./configureserver');
var configuredatabase = require('./configuredatabase');

class app {

    public db: any; 

    init() {

        if (cluster.isMaster) {

            console.log ('TerriaJS Server ' + require('../../package.json').version); // The master process just spins up a few workers and quits.
            options.init();

            if (fs.existsSync('terriajs.pid')) {
                this.warn('TerriaJS-Server seems to be running already.');
            }
                
            this.portInUse(options.port, options.listenHost, function (inUse) {            
                if (inUse) {
                    this.error('Port ' + options.port + ' is in use. Exiting.');
                 } else {
                    if (options.listenHost !== 'localhost') {
                        framework.runMaster();
                    } else {
                        // Let's equate non-public, localhost mode with "single-cpu, don't restart".
                        this.startServer(options);
                    }
                }
            });

            return;

        } else {
            // We're a forked process.
            options.init(true);
            this.startServer(options);
        }

    }

    portInUse(port, host, callback) {

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

    error(message) {

        console.error('Error: ' + message);
        process.exit(1);

    }

    warn(message) {

        console.warn('Warning: ' + message);

    }

    handleExit() {

        console.log('(TerriaJS-Server exiting.)');
        if (fs.existsSync('terriajs.pid')) {
            fs.unlinkSync('terriajs.pid');
        }
        process.exit(0);

    }

    runMaster() {

        var cpuCount = require('os').cpus().length;

        // Let's equate non-public, localhost mode with "single-cpu, don't restart".
        if (options.listenHost === 'localhost') {
            cpuCount = 1;
        }

        console.log('Serving directory "' + options.wwwroot + '" on port ' + options.port + ' to ' + (options.listenHost ? options.listenHost: 'the world') + '.');
        require('./controllers/convert')().testGdal();

        if (!exists(options.wwwroot)) {
            this.warn('"' + options.wwwroot + '" does not exist.');
        } else if (!exists(options.wwwroot + '/index.html')) {
            this.warn('"' + options.wwwroot + '" is not a TerriaJS wwwroot directory.');
        } else if (!exists(options.wwwroot + '/build')) {
            this.warn('"' + options.wwwroot + '" has not been built. You should do this:\n\n' +
                '> cd ' + options.wwwroot + '/..\n' +
                '> gulp\n');
        }

        if (typeof options.settings.allowProxyFor === 'undefined') {
            this.warn('The configuration does not contain a "allowProxyFor" list.  The server will proxy _any_ request.');
        }

        process.on('SIGTERM', this.handleExit);

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

    startServer(options) {

        var app = configureserver.start(options); // Set server configurations and generate server. We replace app here with the actual application server for proper naming conventions.
        app.listen(options.port, options.listenHost, () => console.log(`Terria framework running on ${options.port}!`)); // Start HTTP/s server with expressjs middleware.


        // Run database configuration and get database object for the framework.
        var db = configuredatabase.start();

        // Extend app with database
        this.db = db;

        // Testing framework database
        console.log(framework.db.getStatus());

    }

}

var framework = new app();
var options = new opts();
framework.init(); // Start application.

