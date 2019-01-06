// Using require as it is simpler instead of typescript's import/export derived syntax. 
// See typescript's "export = and import = require()" modules documentation section. 
// Documentation: https://www.typescriptlang.org/docs/handbook/modules.html
// This works well with the existing codebase.

var fs = require('fs');
var cluster = require('cluster');
var exists = require('./exists');
var serveroptions = require('./serveroptions');
var configureserver = require('./configureserver');
var configuredatabase = require('./configuredatabase');

class app {

    public server: any;
    public db: any; 
    public options: any;

    public init() {

        this.options = new serveroptions();
        this.options.init();

        if (cluster.isMaster) {

            console.log ('TerriaJS Server ' + require('../../package.json').version); // The master process just spins up a few workers and quits.

            if (fs.existsSync('terriajs.pid')) {
                this.warn('TerriaJS-Server seems to be running already.');
            }
                
            this.portInUse(this.options.port, this.options.listenHost);

            if(this.options.listenHost !== 'localhost') {
                this.runMaster();
            } else {
                this.startServer(this.options);
            }     

        } else {
            // We're a forked process.
            this.startServer(this.options);
        }

    }

    public portInUse(port, host) {

        var server = require('net').createServer();

        server.listen(port, host);
        server.on('error', function () {
            console.log('Port ' + port + ' is in use. Exit server using port 3001 and try again.');
        });
        
        server.on('listening', function () {
            server.close();
        });
        
    }

    public error(message) {

        console.error('Error: ' + message);
        process.exit(1);

    }

    public warn(message) {

        console.warn('Warning: ' + message);

    }

    public handleExit() {

        console.log('(TerriaJS-Server exiting.)');
        if (fs.existsSync('terriajs.pid')) {
            fs.unlinkSync('terriajs.pid');
        }
        process.exit(0);

    }

    public runMaster() {

        var cpuCount = require('os').cpus().length;

        // Let's equate non-public, localhost mode with "single-cpu, don't restart".
        if (this.options.listenHost === 'localhost') {
            cpuCount = 1;
        }

        console.log('Serving directory "' + this.options.wwwroot + '" on port ' + this.options.port + ' to ' + (this.options.listenHost ? this.options.listenHost: 'the world') + '.');
        require('./controllers/convert')().testGdal();

        if (!exists(this.options.wwwroot)) {
            this.warn('"' + this.options.wwwroot + '" does not exist.');
        } else if (!exists(this.options.wwwroot + '/index.html')) {
            this.warn('"' + this.options.wwwroot + '" is not a TerriaJS wwwroot directory.');
        } else if (!exists(this.options.wwwroot + '/build')) {
            this.warn('"' + this.options.wwwroot + '" has not been built. You should do this:\n\n' +
                '> cd ' + this.options.wwwroot + '/..\n' +
                '> gulp\n');
        }

        if (typeof this.options.settings.allowProxyFor === 'undefined') {
            this.warn('The configuration does not contain a "allowProxyFor" list.  The server will proxy _any_ request.');
        }

        process.on('SIGTERM', this.handleExit);

        // Listen for dying workers
        cluster.on('exit', function (worker) {
            if (!worker.suicide) {
                // Replace the dead worker if not a startup error like port in use.
                if (this.options.listenHost === 'localhost') {
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

    public startServer(options) {

        this.server = configureserver.start(options); // Set server configurations and generate server. We replace app here with the actual application server for proper naming conventions.
        
        this.server.listen(options.port, options.listenHost, () => console.log(`Terria framework running on ${options.port}!`)); // Start HTTP/s server with expressjs middleware.
        
        this.db = configuredatabase.start(); // Run database configuration and get database object for the framework.

    }

}

export = app;
