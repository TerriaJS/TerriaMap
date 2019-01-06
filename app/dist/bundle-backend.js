/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/backend/app.ts":
/*!****************************!*\
  !*** ./app/backend/app.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Using require as it is simpler instead of typescript's import/export derived syntax. 
// See typescript's "export = and import = require()" modules documentation section. 
// Documentation: https://www.typescriptlang.org/docs/handbook/modules.html
// This works well with the existing codebase.
var fs = __webpack_require__(/*! fs */ "fs");
var cluster = __webpack_require__(/*! cluster */ "cluster");
var exists = __webpack_require__(/*! ./exists */ "./app/backend/exists.ts");
var serveroptions = __webpack_require__(/*! ./serveroptions */ "./app/backend/serveroptions.ts");
var configureserver = __webpack_require__(/*! ./configureserver */ "./app/backend/configureserver.ts");
var configuredatabase = __webpack_require__(/*! ./configuredatabase */ "./app/backend/configuredatabase.ts");
class app {
    init() {
        this.options = new serveroptions();
        this.options.init();
        if (cluster.isMaster) {
            console.log('TerriaJS Server ' + __webpack_require__(/*! ../../package.json */ "./package.json").version); // The master process just spins up a few workers and quits.
            if (fs.existsSync('terriajs.pid')) {
                this.warn('TerriaJS-Server seems to be running already.');
            }
            this.portInUse(this.options.port, this.options.listenHost);
            if (this.options.listenHost !== 'localhost') {
                this.runMaster();
            }
            else {
                this.startServer(this.options);
            }
        }
        else {
            // We're a forked process.
            this.startServer(this.options);
        }
    }
    portInUse(port, host) {
        var server = __webpack_require__(/*! net */ "net").createServer();
        server.listen(port, host);
        server.on('error', function () {
            console.log('Port ' + port + ' is in use. Exit server using port 3001 and try again.');
        });
        server.on('listening', function () {
            server.close();
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
        var cpuCount = __webpack_require__(/*! os */ "os").cpus().length;
        // Let's equate non-public, localhost mode with "single-cpu, don't restart".
        if (this.options.listenHost === 'localhost') {
            cpuCount = 1;
        }
        console.log('Serving directory "' + this.options.wwwroot + '" on port ' + this.options.port + ' to ' + (this.options.listenHost ? this.options.listenHost : 'the world') + '.');
        __webpack_require__(/*! ./controllers/convert */ "./app/backend/controllers/convert.js")().testGdal();
        if (!exists(this.options.wwwroot)) {
            this.warn('"' + this.options.wwwroot + '" does not exist.');
        }
        else if (!exists(this.options.wwwroot + '/index.html')) {
            this.warn('"' + this.options.wwwroot + '" is not a TerriaJS wwwroot directory.');
        }
        else if (!exists(this.options.wwwroot + '/build')) {
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
                }
                else {
                    console.log('Worker ' + worker.id + ' died. Replacing it.');
                    cluster.fork();
                }
            }
        });
        fs.writeFileSync('terriajs.pid', process.pid.toString());
        console.log('(TerriaJS-Server running with pid ' + process.pid + ')');
        console.log('Launching ' + cpuCount + ' worker processes.');
        // Create a worker for each CPU
        for (var i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
    }
    startServer(options) {
        this.server = configureserver.start(options); // Set server configurations and generate server. We replace app here with the actual application server for proper naming conventions.
        this.server.listen(options.port, options.listenHost, () => console.log(`Terria framework running on ${options.port}!`)); // Start HTTP/s server with expressjs middleware.
        this.db = configuredatabase.start(); // Run database configuration and get database object for the framework.
    }
}
module.exports = app;


/***/ }),

/***/ "./app/backend/configuredatabase.ts":
/*!******************************************!*\
  !*** ./app/backend/configuredatabase.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var database = __webpack_require__(/*! ./database */ "./app/backend/database.ts");
class configuredatabase {
    static start() {
        var connection;
        var config = __webpack_require__(/*! ../dbconfig.json */ "./app/dbconfig.json");
        switch (config.database.type) {
            case 'mysql':
                connection = __webpack_require__(/*! ./databases/mysql/mysql.js */ "./app/backend/databases/mysql/mysql.js");
            /* Other database example
            case 'mssql':
                terriadb = require('./databases/mssql/mssql.js');
            */
            /* Other database example
            case 'mongodb':
                terriadb = require('./databases/mongodb/mongodb.js');
            */
            /* Custom example
            case 'customdb':
                terriadb = require('./databases/customdb/customdb.js');
            */
            default:
                connection = __webpack_require__(/*! ./databases/mysql/mysql.js */ "./app/backend/databases/mysql/mysql.js");
        }
        return new database(config.database.type, config.database.host, config.database.username, config.database.password, connection); // Return database object
    }
}
module.exports = configuredatabase;


/***/ }),

/***/ "./app/backend/configureserver.ts":
/*!****************************************!*\
  !*** ./app/backend/configureserver.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var express = __webpack_require__(/*! express */ "express");
var compression = __webpack_require__(/*! compression */ "compression");
var path = __webpack_require__(/*! path */ "path");
var cors = __webpack_require__(/*! cors */ "cors");
var cluster = __webpack_require__(/*! cluster */ "cluster");
var exists = __webpack_require__(/*! ./exists */ "./app/backend/exists.ts");
var basicAuth = __webpack_require__(/*! basic-auth */ "basic-auth");
var fs = __webpack_require__(/*! fs */ "fs");
var ExpressBrute = __webpack_require__(/*! express-brute */ "express-brute");
// This is a static class with static properties to configure the server. 
// Creates and returns a single express server.
// It does not need to be instantiated. 
class configureserver {
    static start(options) {
        // eventually this mime type configuration will need to change
        // https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
        var mime = express.static.mime;
        mime.define({
            'this.application/json': ['czml', 'json', 'geojson'],
            'text/plain': ['glsl']
        });
        this.options = options;
        // initialise this.app with standard middlewares
        this.app = express();
        this.app.use(compression());
        this.app.use(cors());
        this.app.disable('etag');
        if (options.verbose) {
            this.app.use(__webpack_require__(/*! morgan */ "morgan")('dev'));
        }
        if (typeof options.settings.trustProxy !== 'undefined') {
            this.app.set('trust proxy', options.settings.trustProxy);
        }
        if (options.verbose) {
            this.log('Listening on these this.endpoints:', true);
        }
        this.endpoint('/ping', function (req, res) {
            res.status(200).send('OK');
        });
        // We do this after the /ping service above so that ping can be used unauthenticated and without TLS for health checks.
        if (options.settings.redirectToHttps) {
            var httpAllowedHosts = options.settings.httpAllowedHosts || ["localhost"];
            this.app.use(function (req, res, next) {
                if (httpAllowedHosts.indexOf(req.hostname) >= 0) {
                    return next();
                }
                if (req.protocol !== 'https') {
                    var url = 'https://' + req.hostname + req.url;
                    res.redirect(301, url);
                }
                else {
                    next();
                }
            });
        }
        var auth = options.settings.basicAuthentication;
        if (auth && auth.username && auth.password) {
            var store = new ExpressBrute.MemoryStore();
            var rateLimitOptions = {
                freeRetries: 2,
                minWait: 200,
                maxWait: 60000,
            };
            if (options.settings.rateLimit && options.settings.rateLimit.freeRetries !== undefined) {
                rateLimitOptions.freeRetries = options.settings.rateLimit.freeRetries;
                rateLimitOptions.minWait = options.settings.rateLimit.minWait;
                rateLimitOptions.maxWait = options.settings.rateLimit.maxWait;
            }
            var bruteforce = new ExpressBrute(store, rateLimitOptions);
            this.app.use(bruteforce.prevent, function (req, res, next) {
                var user = basicAuth(req);
                if (user && user.name === auth.username && user.pass === auth.password) {
                    // Successful authentication, reset rate limiting.
                    req.brute.reset(next);
                }
                else {
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="terriajs-server"');
                    res.end('Unauthorized');
                }
            });
        }
        // Serve the bulk of our this.application as a static web directory.
        var serveWwwRoot = exists(options.wwwroot + '/index.html');
        if (serveWwwRoot) {
            this.app.use(express.static(options.wwwroot));
        }
        // Proxy for servers that don't support CORS
        var bypassUpstreamProxyHostsMap = (options.settings.bypassUpstreamProxyHosts || []).reduce(function (map, host) {
            if (host !== '') {
                map[host.toLowerCase()] = true;
            }
            return map;
        }, {});
        this.endpoint('/proxy', __webpack_require__(/*! ./controllers/proxy */ "./app/backend/controllers/proxy.js")({
            proxyableDomains: options.settings.allowProxyFor,
            proxyAllDomains: options.settings.proxyAllDomains,
            proxyAuth: options.proxyAuth,
            proxyPostSizeLimit: options.settings.proxyPostSizeLimit,
            upstreamProxy: options.settings.upstreamProxy,
            bypassUpstreamProxyHosts: bypassUpstreamProxyHostsMap,
            basicAuthentication: options.settings.basicAuthentication,
            blacklistedAddresses: options.settings.blacklistedAddresses
        }));
        var esriTokenAuth = __webpack_require__(/*! ./controllers/esri-token-auth */ "./app/backend/controllers/esri-token-auth.js")(options.settings.esriTokenAuth);
        if (esriTokenAuth) {
            this.endpoint('/esri-token-auth', esriTokenAuth);
        }
        this.endpoint('/proj4def', __webpack_require__(/*! ./controllers/proj4lookup */ "./app/backend/controllers/proj4lookup.js")); // Proj4def lookup service, to avoid downloading all definitions into the client.
        this.endpoint('/convert', __webpack_require__(/*! ./controllers/convert */ "./app/backend/controllers/convert.js")(options).router); // OGR2OGR wrthis.apper to allow supporting file types like Shapefile.
        this.endpoint('/proxyabledomains', __webpack_require__(/*! ./controllers/proxydomains */ "./app/backend/controllers/proxydomains.js")({
            proxyableDomains: options.settings.allowProxyFor,
            proxyAllDomains: !!options.settings.proxyAllDomains,
        }));
        this.endpoint('/serverconfig', __webpack_require__(/*! ./controllers/serverconfig */ "./app/backend/controllers/serverconfig.js")(options));
        var errorPage = __webpack_require__(/*! ./errorpage */ "./app/backend/errorpage.ts");
        var show404 = serveWwwRoot && exists(options.wwwroot + '/404.html');
        var error404 = errorPage.error404(show404, options.wwwroot, serveWwwRoot);
        var show500 = serveWwwRoot && exists(options.wwwroot + '/500.html');
        var error500 = errorPage.error500(show500, options.wwwroot);
        var initPaths = options.settings.initPaths || [];
        if (serveWwwRoot) {
            initPaths.push(path.join(options.wwwroot, 'init'));
        }
        this.app.use('/init', __webpack_require__(/*! ./controllers/initfile */ "./app/backend/controllers/initfile.js")(initPaths, error404, options.configDir));
        var feedbackService = __webpack_require__(/*! ./controllers/feedback */ "./app/backend/controllers/feedback.js")(options.settings.feedback);
        if (feedbackService) {
            this.endpoint('/feedback', feedbackService);
        }
        var shareService = __webpack_require__(/*! ./controllers/share */ "./app/backend/controllers/share.js")(options.settings.shareUrlPrefixes, options.settings.newShareUrlPrefix, options.hostName, options.port);
        if (shareService) {
            this.endpoint('/share', shareService);
        }
        this.app.use(error404);
        this.app.use(error500);
        var server = this.app;
        var osh = options.settings.https;
        if (osh && osh.key && osh.cert) {
            console.log('Launching in HTTPS mode.');
            var https = __webpack_require__(/*! https */ "https");
            server = https.createServer({
                key: fs.readFileSync(osh.key),
                cert: fs.readFileSync(osh.cert)
            }, this.app);
        }
        process.on('uncaughtException', function (err) {
            console.error(err.stack ? err.stack : err);
            process.exit(1);
        });
        return server;
    }
    static log(message, worker1only) {
        if (!worker1only || cluster.isWorker && cluster.worker.id === 1) {
            console.log(message);
        }
    }
    static endpoint(path, router) {
        if (this.options.verbose) {
            this.log('http://' + this.options.hostName + ':' + this.options.port + '/api/v1' + path, true);
        }
        if (path !== 'proxyabledomains') {
            // deprecated this.endpoint that isn't part of V1
            this.app.use('/api/v1' + path, router);
        }
        // deprecated this.endpoint at `/`
        this.app.use(path, router);
    }
}
module.exports = configureserver;


/***/ }),

/***/ "./app/backend/controllers/convert.js":
/*!********************************************!*\
  !*** ./app/backend/controllers/convert.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true */

var express = __webpack_require__(/*! express */ "express");
var fs = __webpack_require__(/*! fs */ "fs");
var ogr2ogr = __webpack_require__(/*! terriajs-ogr2ogr */ "terriajs-ogr2ogr");
var request = __webpack_require__(/*! request */ "request");
var formidable = __webpack_require__(/*! formidable */ "formidable");

var convert = {};

convert.testGdal = function() {
    // test doing 'something' with an empty GeoJSON object. It will either fail with ENOENT, or fail with OGR2OGR output.
    ogr2ogr({}).exec(function(error) {
        if ((error !== undefined) && error.message.match(/ENOENT/)) {
            console.log('Convert warning: ogr2ogr (gdal) is not installed or inaccessible, so the format conversion service will fail.');
        } else {
            // GDAL is installed ok.
        }
    });
};

function tooBigError(request, response) {
    response.header('Connection', 'close'); // stop the client from sending additional data.
    response.status(413) // Payload Too Large
            .send('This file is too big to convert. Maximum allowed size: ' + convert.maxConversionSize + ' bytes');
    console.log('Convert: uploaded file exceeds limit of ' + convert.maxConversionSize + ' bytes. Aborting.');
}

// Extract file name and path out of the provided HTTP POST form
function parseForm(req, res, callback) {
    var form = new formidable.IncomingForm();
    form.on('progress', function(bytesReceived, bytesExpected) {
        // Allow double because bytesReceived is the entire form, not just the file.
        if (bytesReceived > convert.maxConversionSize * 2) {
            var result = tooBigError(req, res);

            // remove any files already uploaded
            (form.openedFiles || []).forEach(function(file) {
                try {
                    fs.unlink(file.path);
                } catch(e) {
                }
            });

            return result;
        }
    });
    form.parse(req, function(err, fields, files) {
        if (fields.input_url !== undefined) {
            if (fields.input_url.indexOf('http') === 0) {
                callback(fields.input_url, fields.input_url, req, res);
            }
        } else if (files.input_file !== undefined) {
            if (files.input_file.size <= convert.maxConversionSize) {
                callback(files.input_file.path, files.input_file.name, req, res);
            } else {
                fs.unlink(files.input_file.path); // we have to delete the upload ourselves.
                return tooBigError(req, res);
            }
        }
    });
}

// Pass a stream to the OGR2OGR library, returning a GeoJSON result.
function convertStream(stream, req, res, hint, fpath) {
    var ogr = ogr2ogr(stream, hint)
                    .skipfailures()
                    .options(['-t_srs', 'EPSG:4326']);

    ogr.exec(function (er, data) {
        if (er) {
            console.error('Convert error: ' + er);
        }
        if (data !== undefined) {
            res.status(200).send(JSON.stringify(data));
        } else {
            res.status(415). // Unsupported Media Type
                send('Unable to convert this data file. For a list of formats supported by Terria, see http://www.gdal.org/ogr_formats.html .');
        }
        if (fpath) {
            fs.unlink(fpath); // clean up the temporary file on disk
        }
    });
}

function handleContent (fpath, fname, req, res) {
    if (!fpath) {
        return res.status(400).send('No file provided to convert.');
    }
    console.log('Convert: receiving file named ', fname);

    var hint = '';
    //simple hint for now, might need to crack zip files going forward
    if (fname.match(/\.zip$/)) {
        hint = 'shp';
    }
    if (fpath.indexOf('http') === 0) {
        var httpStream, abort = false;
        // Read file content by opening the URL given to us
        httpStream = request.get({url: fpath});
        httpStream.on('response', function(response) {
            var request = this, len = 0;
            convertStream(response, req, res, hint);
            response.on('data', function (chunk) {
                len += chunk.length;
                if (!abort && len > convert.maxConversionSize) {
                    tooBigError(request, res);
                    abort = true;
                    httpStream.abort(); // avoid fetching the entire file once we know it's too big. We'll probably get one or two chunks too many.
                    response.destroy();
                }
            });
            response.on('end', function() {
                console.log('Convert: received file of ' + len + ' bytes' + (abort ? ' (which we\'re discarding).' : '.'));
            });
        });
    } else {
        // Read file content embedded directly in POST data
        convertStream(fs.createReadStream(fpath), req, res, hint, fpath);
    }
}

// provide conversion to geojson service
// reguires install of gdal on server:
//   sudo apt-get install gdal-bin
convert.router = express.Router().post('/',  function(req, res) {
    parseForm(req, res, handleContent);
});


module.exports = function(options) {
    if (options) {
        convert.maxConversionSize = options.settings.maxConversionSize || 1000000;
    }
    return convert;
};

/***/ }),

/***/ "./app/backend/controllers/esri-token-auth.js":
/*!****************************************************!*\
  !*** ./app/backend/controllers/esri-token-auth.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true, esnext: true */

var router = __webpack_require__(/*! express */ "express").Router();
var request = __webpack_require__(/*! request */ "request");
var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
var url = __webpack_require__(/*! url */ "url");

module.exports = function(options) {
    if (!options || !options.servers) {
        return;
    }

    // The maximum size of the JSON data.
    let postSizeLimit = options.postSizeLimit || '1024';

    let tokenServers = parseUrls(options.servers);
    tokenServers = validateServerConfig(tokenServers);

    router.use(bodyParser.json({limit:postSizeLimit, type:'application/json'}));
    router.post('/', function(req, res, next) {
        let parameters = req.body;

        if (!parameters.url) {
            return res.status(400).send('No URL specified.');
        }

        let targetUrl = parseUrl(parameters.url);
        if (!targetUrl || (targetUrl.length === 0) || (typeof targetUrl !== 'string')) {
            return res.status(400).send('Invalid URL specified.');
        }

        let tokenServer = tokenServers[targetUrl];
        if (!tokenServer) {
            return res.status(400).send('Unsupported URL specified.');
        }

        request({
            url: tokenServer.tokenUrl,
            method: 'POST',
            headers: {
                'User-Agent': 'TerriaJSESRITokenAuth',
            },
            form:{
                username: tokenServer.username,
                password: tokenServer.password,
                f: 'JSON'
            }
        }, function(error, response, body) {
            try {
                res.set('Content-Type', 'application/json');

                if (response.statusCode !== 200) {
                    return res.status(502).send('Token server failed.');
                } else {
                    let value = JSON.parse(response.body);
                    return res.status(200).send(JSON.stringify(value));
                }
            }
            catch (error) {
                return res.status(500).send('Error processing server response.');
            }
        });
    });

    return router;
};

function parseUrls(servers) {
    let result = {};

    Object.keys(servers).forEach(server => {
        let parsedUrl = parseUrl(server)
        if (parsedUrl) {
            result[parsedUrl] = servers[server];
        }
        else {
            console.error('Invalid configuration. The URL: \'' + server + '\' is not valid.');
        }
    });

    return result;
}

function parseUrl(urlString) {
    try {
        return url.format(url.parse(urlString));
    }
    catch (error) {
        return '';
    }
}

function validateServerConfig(servers)
{
    let result = {};

    Object.keys(servers).forEach(url => {
        let server = servers[url];
        if (server.username && server.password && server.tokenUrl) {
            result[url] = server;

            // Note: We should really only validate URLs that are HTTPS to save us from ourselves, but the current
            // servers we need to support don't support HTTPS :( so the best that we can do is warn against it.
            if (!isHttps(server.tokenUrl)) {
                console.error('All communications should be TLS but the URL \'' + server.tokenUrl + '\' does not use https.');
            }
        } else {
            console.error('Bad Configuration. \'' + url + '\' does not supply all of the required properties.');
        }
    });

    return result;
}

function isHttps(urlString){
    try {
        return (url.parse(urlString).protocol === 'https:')
    }
    catch (error)
    {
        return false;
    }
}


/***/ }),

/***/ "./app/backend/controllers/feedback.js":
/*!*********************************************!*\
  !*** ./app/backend/controllers/feedback.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true */


var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
var router = __webpack_require__(/*! express */ "express").Router();
var url = __webpack_require__(/*! url */ "url");
var request = __webpack_require__(/*! request */ "request");

module.exports = function(options) {
    if (!options || !options.issuesUrl || !options.accessToken) {
        return;
    }

    var parsedCreateIssueUrl = url.parse(options.issuesUrl, true);
    parsedCreateIssueUrl.query.access_token = options.accessToken;
    var createIssueUrl = url.format(parsedCreateIssueUrl);

    router.use(bodyParser.json());
    router.post('/', function(req, res, next) {
        var parameters = req.body;

        request({
            url: createIssueUrl,
            method: 'POST',
            headers: {
                'User-Agent': options.userAgent || 'TerriaBot (TerriaJS Feedback)',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                title: parameters.title ? parameters.title : 'User Feedback',
                body: formatBody(req, parameters, options.additionalParameters)
            })
        }, function(error, response, body) {
            res.set('Content-Type', 'application/json');
            if (response.statusCode < 200 || response.statusCode >= 300) {
                res.status(response.statusCode).send(JSON.stringify({result: 'FAILED'}));
            } else {
                res.status(200).send(JSON.stringify({result: 'SUCCESS'}));
            }
        });

    });

    return router;
};

function formatBody(request, parameters, additionalParameters) {
    var result = '';

    result += parameters.comment ? parameters.comment : 'No comment provided';
    result += '\n### User details\n';
    result += '* Name: '          + (parameters.name ? parameters.name : 'Not provided') + '\n';
    result += '* Email Address: ' + (parameters.email ? parameters.email : 'Not provided') + '\n';
    result += '* IP Address: '    + request.ip + '\n';
    result += '* User Agent: '    + request.header('User-Agent') + '\n';
    result += '* Referrer: '      + request.header('Referrer') + '\n';
    result += '* Share URL: '     + (parameters.shareLink ? parameters.shareLink : 'Not provided') + '\n';
    if (additionalParameters) {
        additionalParameters.forEach((parameter) => {
            result += `* ${parameter.descriptiveLabel}: ${parameters[parameter.name] || 'Not provided'}\n`;
        });
    }

    return result;
}


/***/ }),

/***/ "./app/backend/controllers/initfile.js":
/*!*********************************************!*\
  !*** ./app/backend/controllers/initfile.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true */

var express = __webpack_require__(/*! express */ "express");
var router = __webpack_require__(/*! express */ "express").Router();
var exists = __webpack_require__(/*! ../exists */ "./app/backend/exists.ts");
var path = __webpack_require__(/*! path */ "path");
/**
 * Special handling for /init/foo.json requests: look in initPaths, not just wwwroot/init
 * @param  {String[]} initPaths      Paths to look in, can be relative.
 * @param  {function} error404       Error page handler.
 * @param  {String} configFileBase   Directory to resolve relative paths from.
 * @return {Router}
 */
module.exports = function(initPaths, error404, configFileBase) {
    initPaths.forEach(function(initPath) {
        router.use(express.static(path.resolve(configFileBase, initPath)));
    });
    return router;
};

/***/ }),

/***/ "./app/backend/controllers/proj4lookup.js":
/*!************************************************!*\
  !*** ./app/backend/controllers/proj4lookup.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true */

var express = __webpack_require__(/*! express */ "express");
var router = express.Router();

var proj4 = __webpack_require__(/*! proj4 */ "proj4");

//TODO: check if this loads the file into each core and if so then,
__webpack_require__(/*! proj4js-defs/epsg */ "proj4js-defs/epsg")(proj4);


//provide REST service for proj4 definition strings
router.get('/:crs', function(req, res, next) {
    var epsg = proj4.defs[req.params.crs.toUpperCase()];
    if (epsg !== undefined) {
        res.status(200).send(epsg);
    } else {
        res.status(404).send('No proj4 definition available for this CRS.');
    }
});

module.exports = router;

/***/ }),

/***/ "./app/backend/controllers/proxy.js":
/*!******************************************!*\
  !*** ./app/backend/controllers/proxy.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true */


var basicAuth = __webpack_require__(/*! basic-auth */ "basic-auth");
var express = __webpack_require__(/*! express */ "express");
var defaultRequest = __webpack_require__(/*! request */ "request");
var url = __webpack_require__(/*! url */ "url");
var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
var rangeCheck = __webpack_require__(/*! range_check */ "range_check");

var DO_NOT_PROXY_REGEX = /^(?:Host|X-Forwarded-Host|Proxy-Connection|Connection|Keep-Alive|Transfer-Encoding|TE|Trailer|Proxy-Authorization|Proxy-Authenticate|Upgrade|Expires|pragma|Strict-Transport-Security)$/i;
var PROTOCOL_REGEX = /^\w+:\//;
var DURATION_REGEX = /^([\d.]+)(ms|s|m|h|d|w|y)$/;
var DURATION_UNITS = {
    ms: 1.0 / 1000,
    s: 1.0,
    m: 60.0,
    h: 60.0 * 60.0,
    d: 24.0 * 60.0 * 60.0,
    w: 7.0 * 24.0 * 60.0 * 60.0,
    y: 365 * 24.0 * 60.0 * 60.0
};
/** Age to override cache instructions with for proxied files */
var DEFAULT_MAX_AGE_SECONDS = 1209600; // two weeks

/**
 * Creates an express middleware that proxies calls to '/proxy/http://example' to 'http://example', while forcing them
 * to be cached by the browser and overrwriting CORS headers. A cache duration can be added with a URL like
 * /proxy/_5m/http://example which causes 'Cache-Control: public,max-age=300' to be added to the response headers.
 *
 * @param {Object} options
 * @param {Array[String]} options.proxyableDomains An array of domains to be proxied
 * @param {boolean} options.proxyAllDomains A boolean indicating whether or not we should proxy ALL domains - overrides
 *                      the configuration in options.proxyDomains
 * @param {String} options.proxyAuth A map of domains to tokens that will be passed to those domains via basic auth
 *                      when proxying through them.
 * @param {String} options.upstreamProxy Url of a standard upstream proxy that will be used to retrieve data.
 * @param {String} options.bypassUpstreamProxyHosts An object of hosts (as strings) to 'true' values.
 * @param {String} options.proxyPostSizeLimit The maximum size of a POST request that the proxy will allow through,
                        in bytes if no unit is specified, or some reasonable unit like 'kb' for kilobytes or 'mb' for megabytes.
 *
 * @returns {*} A middleware that can be used with express.
 */
module.exports = function(options) {
    var request = options.request || defaultRequest; //overridable for tests
    var proxyAllDomains = options.proxyAllDomains;
    var proxyDomains = options.proxyableDomains || [];
    var proxyAuth = options.proxyAuth || {};
    var proxyPostSizeLimit = options.proxyPostSizeLimit || '102400';
    
    // If you change this, also change the same list in serverconfig.json.example.
    // This page is helpful: https://en.wikipedia.org/wiki/Reserved_IP_addresses
    var blacklistedAddresses = options.blacklistedAddresses || [
        // loopback addresses
        '127.0.0.0/8',
        '::1/128',
        // link local addresses
        '169.254.0.0/16',
        'fe80::/10',
        // private network addresses
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16',
        'fc00::/7',
        // other
        '0.0.0.0/8',
        '100.64.0.0/10',
        '192.0.0.0/24',
        '192.0.2.0/24',
        '198.18.0.0/15',
        '192.88.99.0/24',
        '198.51.100.0/24',
        '203.0.113.0/24',
        '224.0.0.0/4',
        '240.0.0.0/4',
        '255.255.255.255/32',
        '::/128',
        '2001:db8::/32',
        'ff00::/8'
    ];

    //Non CORS hosts and domains we proxy to
    function proxyAllowedHost(host) {
        // Exclude hosts that are really IP addresses and are in our blacklist.
        if (rangeCheck.inRange(host, blacklistedAddresses)) {
            return false;
        }

        if (proxyAllDomains) {
            return true;
        }

        host = host.toLowerCase();
        //check that host is from one of these domains
        for (var i = 0; i < proxyDomains.length; i++) {
            if (host.indexOf(proxyDomains[i], host.length - proxyDomains[i].length) !== -1) {
                return true;
            }
        }
        return false;
    }

    function doProxy(req, res, next, retryWithoutAuth, callback) {
        var remoteUrlString = req.url.substring(1);

        if (!remoteUrlString || remoteUrlString.length === 0) {
            return res.status(400).send('No url specified.');
        }

        // Does the proxy URL include a max age?
        var maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS;
        if (remoteUrlString[0] === '_') {
            var slashIndex = remoteUrlString.indexOf('/');
            if (slashIndex < 0) {
                return res.status(400).send('No url specified.');
            }

            var maxAgeString = remoteUrlString.substring(1, slashIndex);
            remoteUrlString = remoteUrlString.substring(slashIndex + 1);

            if (remoteUrlString.length === 0) {
                return res.status(400).send('No url specified.');
            }

            // Interpret the max age as a duration in Varnish notation.
            // https://www.varnish-cache.org/docs/trunk/reference/vcl.html#durations
            var parsedMaxAge = DURATION_REGEX.exec(maxAgeString);
            if (!parsedMaxAge || parsedMaxAge.length < 3) {
                return res.status(400).send('Invalid duration.');
            }

            var value = parseFloat(parsedMaxAge[1]);
            if (value !== value) {
                return res.status(400).send('Invalid duration.');
            }

            var unitConversion = DURATION_UNITS[parsedMaxAge[2]];
            if (!unitConversion) {
                return res.status(400).send('Invalid duration unit ' + parsedMaxAge[2]);
            }

            maxAgeSeconds = value * unitConversion;
        }

        // Add http:// if no protocol is specified.
        var protocolMatch = PROTOCOL_REGEX.exec(remoteUrlString);
        if (!protocolMatch || protocolMatch.length < 1) {
            remoteUrlString = 'http://' + remoteUrlString;
        } else {
            var matchedPart = protocolMatch[0];

            // If the protocol portion of the URL only has a single slash after it, the extra slash was probably stripped off by someone
            // along the way (NGINX will do this).  Add it back.
            if (remoteUrlString[matchedPart.length] !== '/') {
                remoteUrlString = matchedPart + '/' + remoteUrlString.substring(matchedPart.length);
            }
        }

        var remoteUrl = url.parse(remoteUrlString);

        // Copy the query string
        remoteUrl.search = url.parse(req.url).search;

        if (!remoteUrl.protocol) {
            remoteUrl.protocol = 'http:';
        }

        var proxy;
        if (options.upstreamProxy && !((options.bypassUpstreamProxyHosts || {})[remoteUrl.host])) {
            proxy = options.upstreamProxy;
        }

        // Are we allowed to proxy for this host?
        if (!proxyAllowedHost(remoteUrl.host)) {
            res.status(403).send('Host is not in list of allowed hosts: ' + remoteUrl.host);
            return;
        }

        // encoding : null means "body" passed to the callback will be raw bytes

        var proxiedRequest;
        req.on('close', function() {
            if (proxiedRequest) {
                proxiedRequest.abort();
            }
        });

        var filteredReqHeaders = filterHeaders(req.headers);
        if (filteredReqHeaders['x-forwarded-for']) {
            filteredReqHeaders['x-forwarded-for'] = filteredReqHeaders['x-forwarded-for'] + ', ' + req.connection.remoteAddress;
        } else {
            filteredReqHeaders['x-forwarded-for'] = req.connection.remoteAddress;
        }

        // Remove the Authorization header if we used it to authenticate the request to terriajs-server.
        if (options.basicAuthentication && options.basicAuthentication.username && options.basicAuthentication.password) {
            delete filteredReqHeaders['authorization'];
        }

        if (!retryWithoutAuth) {
            var authRequired = proxyAuth[remoteUrl.host];
            if (authRequired) {
                if (authRequired.authorization) {
                    // http basic auth.
                    if (!filteredReqHeaders['authorization']) {
                        filteredReqHeaders['authorization'] = authRequired.authorization;
                    }
                }
                if (authRequired.headers) {
                    // a mechanism to pass arbitrary headers.
                    authRequired.headers.forEach(function(header) {
                        filteredReqHeaders[header.name] = header.value;
                    });
                }
            }
        }

        proxiedRequest = callback(remoteUrl, filteredReqHeaders, proxy, maxAgeSeconds);
    }

    function buildReqHandler(httpVerb) {
        function handler(req, res, next) {
            return doProxy(req, res, next, req.retryWithoutAuth, function(remoteUrl, filteredRequestHeaders, proxy, maxAgeSeconds) {
                try {
                    var proxiedRequest = request({
                        method: httpVerb,
                        url: url.format(remoteUrl),
                        headers: filteredRequestHeaders,
                        encoding: null,
                        proxy: proxy,
                        body: req.body,
                        followRedirect: function(response) {
                            var location = response.headers.location;
                            if (location && location.length > 0) {
                                var parsed = url.parse(location);
                                if (proxyAllowedHost(parsed.host)) {
                                    // redirect is ok
                                    return true;
                                }
                            }
                            // redirect is forbidden
                            return false;
                        }
                    }).on('socket', function(socket) {
                        socket.once('lookup', function(err, address, family, host) {
                            if (rangeCheck.inRange(address, blacklistedAddresses)) {
                                res.status(403).send('IP address is not allowed: ' + address);
                                res.end();
                                proxiedRequest.abort();
                            }
                        });
                    }).on('error', function(err) {
                        console.error(err);

                        // Ideally we would return an error to the client, but if headers have already been sent,
                        // attempting to set a status code here will fail. So in that case, we'll just end the response,
                        // for lack of a better option.
                        if (res.headersSent) {
                            res.end();
                        } else {
                            res.status(500).send('Proxy error');
                        }
                    }).on('response', function(response) {
                        if (!req.retryWithoutAuth && response.statusCode === 403 && proxyAuth[remoteUrl.host]) {
                            // We automatically added an authentication header to this request (e.g. from proxyauth.json),
                            // but got back a 403, indicating our credentials didn't authorize access to this resource.
                            // Try again without credentials in order to give the user the opportunity to supply
                            // their own.
                            req.retryWithoutAuth = true;
                            return handler(req, res, next);
                        }

                        res.status(response.statusCode);
                        res.header(processHeaders(response.headers, maxAgeSeconds));
                        response.on('data', function(chunk) {
                            res.write(chunk);
                        });
                        response.on('end', function() {
                            res.end();
                        });
                    });
                } catch (e) {
                    console.error(e.stack);
                    res.status(500).send('Proxy error');
                }

                return proxiedRequest;
            });
        }

        return handler;
    }

    var router = express.Router();
    router.get('/*', buildReqHandler('GET'));
    router.post('/*', bodyParser.raw({type: function() { return true;}, limit: proxyPostSizeLimit}), buildReqHandler('POST'));

    return router;
};

/**
 * Filters headers that are not matched by {@link DO_NOT_PROXY_REGEX} out of an object containing headers. This does not
 * mutate the original list.
 *
 * @param headers The headers to filter
 * @returns {Object} A new object with the filtered headers.
 */
function filterHeaders(headers) {
    var result = {};
    // filter out headers that are listed in the regex above
    Object.keys(headers).forEach(function(name) {
        if (!DO_NOT_PROXY_REGEX.test(name)) {
            result[name] = headers[name];
        }
    });

    return result;
}

/**
 * Filters out headers that shouldn't be proxied, overrides caching so files are retained for {@link DEFAULT_MAX_AGE_SECONDS},
 * and sets CORS headers to allow all origins
 *
 * @param headers The original object of headers. This is not mutated.
 * @param maxAgeSeconds the amount of time in seconds to cache for. This will override what the original server
 *          specified because we know better than they do.
 * @returns {Object} The new headers object.
 */
function processHeaders(headers, maxAgeSeconds) {
    var result = filterHeaders(headers);

    result['Cache-Control'] = 'public,max-age=' + maxAgeSeconds;
    result['Access-Control-Allow-Origin'] = '*';

    return result;
}


/***/ }),

/***/ "./app/backend/controllers/proxydomains.js":
/*!*************************************************!*\
  !*** ./app/backend/controllers/proxydomains.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true */

var router = __webpack_require__(/*! express */ "express").Router();

module.exports = function(options) {
    router.get('/', function(req, res, next) {
        res.status(200).send(options);
    });
    return router;
};

/***/ }),

/***/ "./app/backend/controllers/serverconfig.js":
/*!*************************************************!*\
  !*** ./app/backend/controllers/serverconfig.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true, esnext: true */

var express = __webpack_require__(/*! express */ "express");

// Expose a whitelisted set of configuration attributes to the world. This definitely doesn't include authorisation tokens, local file paths, etc.
// It mirrors the structure of the real config file.
module.exports = function(options) {
    var router = express.Router();
    var settings = Object.assign({}, options.settings), safeSettings = {};
    var safeAttributes = ['allowProxyFor', 'maxConversionSize', 'newShareUrlPrefix', 'proxyAllDomains'];
    safeAttributes.forEach(key => safeSettings[key] = settings[key]);
    safeSettings.version = __webpack_require__(/*! ../../../package.json */ "./package.json").version;
    if (typeof settings.shareUrlPrefixes === 'object') {
        safeSettings.shareUrlPrefixes = {};
        Object.keys(settings.shareUrlPrefixes).forEach(function(key) {
            safeSettings.shareUrlPrefixes[key] = { service: settings.shareUrlPrefixes[key].service };
        });
    }
    if (settings.feedback && settings.feedback.additionalParameters) {
        safeSettings.additionalFeedbackParameters = settings.feedback.additionalParameters;
    }

    router.get('/', function(req, res, next) {
        res.status(200).send(safeSettings);
    });
    return router;
};


/***/ }),

/***/ "./app/backend/controllers/share.js":
/*!******************************************!*\
  !*** ./app/backend/controllers/share.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node: true, esnext: true */


var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
var requestp = __webpack_require__(/*! request-promise */ "request-promise");
var rperrors = __webpack_require__(/*! request-promise/errors */ "request-promise/errors");

var gistAPI = 'https://api.github.com/gists';
var googleUrlShortenerAPI = 'https://www.googleapis.com/urlshortener/v1';

var prefixSeparator = '-'; // change the regex below if you change this
var splitPrefixRe = /^(([^-]+)-)?(.*)$/;

//You can test like this with httpie:
//echo '{ "test": "me" }' | http post localhost:3001/api/v1/share
function makeGist(serviceOptions, body) {
    var gistFile = {};
    gistFile[serviceOptions.gistFilename || 'usercatalog.json'] = { content: body };

    var headers = {
        'User-Agent': serviceOptions.userAgent || 'TerriaJS-Server',
        'Accept': 'application/vnd.github.v3+json'
    };
    if (serviceOptions.accessToken !== undefined) {
        headers['Authorization'] = 'token ' + serviceOptions.accessToken;
    }
    return requestp({
        url: gistAPI,
        method: 'POST',
        headers: headers,
        json: true,
        body: {
            files: gistFile,
            description: (serviceOptions.gistDescription || 'User-created catalog'),
            public: false
        }, transform: function(body, response) {
            if (response.statusCode === 201) {
                console.log('Created ID ' + response.body.id + ' using Gist service');
                return response.body.id;
            } else {
                return response;
            }
        }
    });
}

// Test: http localhost:3001/api/v1/share/g-98e01625db07a78d23b42c3dbe08fe20
function resolveGist(serviceOptions, id) {
    var headers = {
        'User-Agent': serviceOptions.userAgent || 'TerriaJS-Server',
        'Accept': 'application/vnd.github.v3+json'
    };
    if (serviceOptions.accessToken !== undefined) {
        headers['Authorization'] = 'token ' + serviceOptions.accessToken;
    }
    return requestp({
        url: gistAPI + '/' + id,
        headers: headers,
        json: true,
        transform: function(body, response) {
            if (response.statusCode >= 300) {
                return response;
            } else {
                return body.files[Object.keys(body.files)[0]].content; // find the contents of the first file in the gist
            }
        }
    });
}
/*
  Generate short ID by hashing body, converting to base62 then truncating.
 */
function shortId(body, length) {
    var hmac = __webpack_require__(/*! crypto */ "crypto").createHmac('sha1', body).digest();
    var base62 = __webpack_require__(/*! base-x */ "base-x")('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    var fullkey = base62.encode(hmac);
    return fullkey.slice(0, length); // if length undefined, return the whole thing
}

var _S3;

function S3(serviceOptions) {
    if (_S3) {
        return _S3;
    } else {
        var aws = __webpack_require__(/*! aws-sdk */ "aws-sdk");
        aws.config.setPromisesDependency(__webpack_require__(/*! when */ "when").Promise);
        aws.config.update({
            region: serviceOptions.region
        });
        // if no credentials provided, we assume that they're being provided as environment variables or in a file
        if (serviceOptions.accessKeyId) {
            aws.config.update({
                accessKeyId: serviceOptions.accessKeyId,
                secretAccessKey: serviceOptions.secretAccessKey
            });
        }
        _S3 = new aws.S3();
        return _S3;
    }
}

// We append some pseudo-dir prefixes into the actual object ID to avoid thousands of objects in a single pseudo-directory.
// MyRaNdoMkey => M/y/MyRaNdoMkey
const idToObject = (id) => id.replace(/^(.)(.)/, '$1/$2/$1$2');

function saveS3(serviceOptions, body) {
    var id = shortId(body, serviceOptions.keyLength);
    const params = {
        Bucket: serviceOptions.bucket,
        Key: idToObject(id),
        Body: body
    };

    return S3(serviceOptions).putObject(params).promise()
        .then(function(result) {
            console.log('Saved key ' + id + ' to S3 bucket ' + params.Bucket + ':' + params.Key + '. Etag: ' + result.ETag);
            return id;
        }).catch(function(e) {
            console.error(e);
            return e;
        });
}

function resolveS3(serviceOptions, id) {
    const params = {
        Bucket: serviceOptions.bucket,
        Key: idToObject(id)
    };
    return S3(serviceOptions).getObject(params).promise()
    .then(function(data) {
        return data.Body;
    }).catch(function(e) {
        throw {
            response: e,
            error: e.message
        };
    });
}


// Test: http localhost:3001/api/v1/share/q3nxPd
function resolveGoogleUrl(serviceOptions, id) {
    var shortUrl = 'http://goo.gl/' + id;
    console.log(shortUrl);
    return requestp({
        url: googleUrlShortenerAPI + '/url?key=' + serviceOptions.apikey + '&shortUrl=' + shortUrl,
        headers: {
            'User-Agent': serviceOptions.userAgent || 'TerriaJS-Server',
        },
        json: true,
        transform: function(body, response) {
            if (response.statusCode >= 300) {
                return response;
            } else {
                // Our Google URLs look like "http://nationalmap.gov.au/#share=%7B...%7D" but there might be other URL parameters before or after
                // We just want the encoded JSON (%7B..%7D), not the whole URL.
                return decodeURIComponent(body.longUrl.match(/(%7B.*%7D)(&.*)$/)[1]);
            }
        }
    });
}

module.exports = function(shareUrlPrefixes, newShareUrlPrefix, hostName, port) {
    if (!shareUrlPrefixes) {
        return;
    }

    var router = __webpack_require__(/*! express */ "express").Router();
    router.use(bodyParser.text({type: '*/*'}));

    // Requested creation of a new short URL.
    router.post('/', function(req, res, next) {
        if (newShareUrlPrefix === undefined || !shareUrlPrefixes[newShareUrlPrefix]) {
            return res.status(404).json({ message: "This server has not been configured to generate new share URLs." });
        }
        var serviceOptions = shareUrlPrefixes[newShareUrlPrefix];
        var minter = {
            'gist': makeGist,
            's3': saveS3
            }[serviceOptions.service.toLowerCase()];

        minter(serviceOptions, req.body).then(function(id) {
            id = newShareUrlPrefix + prefixSeparator + id;
            var resPath = req.baseUrl + '/' + id;
            // these properties won't behave correctly unless "trustProxy: true" is set in user's options file.
            // they may not behave correctly (especially port) when behind multiple levels of proxy
            var resUrl =
                req.protocol + '://' +
                req.hostname +
                (req.header('X-Forwarded-Port') || port) +
                resPath;
            res .location(resUrl)
                .status(201)
                .json({ id: id, path: resPath, url: resUrl });
        }).catch(rperrors.TransformError, function (reason) {
            console.error(JSON.stringify(reason, null, 2));
            res.status(500).json({ message: reason.cause.message });
        }).catch(function(reason) {
            console.warn(JSON.stringify(reason, null, 2));
            res.status(500) // probably safest if we always return a consistent error code
                .json({ message: reason.error });
        });
    });

    // Resolve an existing ID. We break off the prefix and use it to work out which resolver to use.
    router.get('/:id', function(req, res, next) {
        var prefix = req.params.id.match(splitPrefixRe)[2] || '';
        var id = req.params.id.match(splitPrefixRe)[3];
        var resolver;

        var serviceOptions = shareUrlPrefixes[prefix];
        if (!serviceOptions) {
            console.error('Share: Unknown prefix to resolve "' + prefix + '", id "' + id + '"');
            return res.status(400).send('Unknown share prefix "' + prefix + '"');
        } else {
            resolver = {
                'gist': resolveGist,
                'googleurlshortener': resolveGoogleUrl,
                's3': resolveS3
            }[serviceOptions.service.toLowerCase()];
        }
        resolver(serviceOptions, id).then(function(content) {
            res.send(content);
        }).catch(rperrors.TransformError, function (reason) {
            console.error(JSON.stringify(reason, null, 2));
            res.status(500).send(reason.cause.message);
        }).catch(function(reason) {
            console.warn(JSON.stringify(reason.response, null, 2));
            res.status(404) // probably safest if we always return 404 rather than whatever the upstream provider sets.
                .send(reason.error);
        });
    });
    return router;
};


/***/ }),

/***/ "./app/backend/database.ts":
/*!*********************************!*\
  !*** ./app/backend/database.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class database {
    constructor(type, host, username, password, connection) {
        this.type = type;
        this.host = host;
        this.username = username;
        this.password = password;
        this.connection = connection;
    }
    getStatus() {
        return this.connection.state;
    }
}
module.exports = database;


/***/ }),

/***/ "./app/backend/databases/mysql/mysql.js":
/*!**********************************************!*\
  !*** ./app/backend/databases/mysql/mysql.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mysql = __webpack_require__(/*! mysql */ "mysql");
var config = __webpack_require__(/*! ../../../dbconfig.json */ "./app/dbconfig.json");

var con = mysql.createConnection({
	host: config.database.host,
	user: config.database.username,
	password: config.database.password
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Database established. Status: " + con.state);
});

module.exports = con;

/***/ }),

/***/ "./app/backend/errorpage.ts":
/*!**********************************!*\
  !*** ./app/backend/errorpage.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports.error404 = function (show404, wwwroot, serveWwwRoot) {
    return function (req, res, next) {
        if (show404) {
            res.status(404).sendFile(wwwroot + '/404.html');
        }
        else if (serveWwwRoot) {
            // Redirect unknown pages back home.
            res.redirect(303, '/');
        }
        else {
            res.status(404).send('No TerriaJS website here.');
        }
    };
};
module.exports.error500 = function (show500, wwwroot) {
    return function (error, req, res, next) {
        console.error(error);
        if (show500) {
            res.status(500).sendFile(wwwroot + '/500.html');
        }
        else {
            res.status(500).send('500: Internal Server Error');
        }
    };
};


/***/ }),

/***/ "./app/backend/exists.ts":
/*!*******************************!*\
  !*** ./app/backend/exists.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fs = __webpack_require__(/*! fs */ "fs");
module.exports = function exists(pathName) {
    try {
        fs.statSync(pathName);
        return true;
    }
    catch (e) {
        return false;
    }
};


/***/ }),

/***/ "./app/backend/main.js":
/*!*****************************!*\
  !*** ./app/backend/main.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Test Example Plugin Module */

var fs = __webpack_require__(/*! fs */ "fs");
var cluster = __webpack_require__(/*! cluster */ "cluster");
var exists = __webpack_require__(/*! ./exists */ "./app/backend/exists.ts");
var app = __webpack_require__(/*! ./app */ "./app/backend/app.ts");

var framework = new app();
framework.init(); // Start application.

// Example framework calls

// var terriajs = require('terriajs');
// var catalog = terriajs.catalog;

// framework.loadModule(catalog); 


/***/ }),

/***/ "./app/backend/serveroptions.ts":
/*!**************************************!*\
  !*** ./app/backend/serveroptions.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var exists = __webpack_require__(/*! ./exists */ "./app/backend/exists.ts");
var fs = __webpack_require__(/*! fs */ "fs");
var json5 = __webpack_require__(/*! json5 */ "json5");
var path = __webpack_require__(/*! path */ "path");
class serveroptions {
    getFilePath(fileName, warn) {
        if (exists(fileName)) {
            return fileName;
        }
        else if (warn) {
            console.warn("Warning: Can\'t open '" + fileName + "'.");
        }
    }
    getConfigFile(argFileName, defaultFileName) {
        return argFileName ? this.getFilePath(argFileName, true) : this.getFilePath(defaultFileName, true);
    }
    /**
     * Gets a config file using require, logging a warning and defaulting to a backup value in the event of a failure.
     *
     * @param filePath The path to look for the config file.
     * @param configFileType What kind of config file is this? E.g. config, auth etc.
     * @param failureConsequence The consequence of using the defaultValue when this file fails to load - this will be logged
     *        as part of the warning
     * @returns {*} The config, either from the filePath or a default.
     */
    getConfig(filePath, configFileType, failureConsequence, quiet) {
        var config;
        try {
            var fileContents = fs.readFileSync(filePath, 'utf8');
            // Strip comments formatted as lines starting with a #, before parsing as JSON5. #-initial comments are deprecated, will be removed in version 3.
            config = json5.parse(fileContents.replace(/^\s*#.*$/mg, ''));
            if (!quiet) {
                console.log('Using ' + configFileType + ' file "' + fs.realpathSync(filePath) + '".');
            }
        }
        catch (e) {
            if (!quiet) {
                var loggedFilePath = filePath ? ' "' + filePath + '"' : '';
                if (!(loggedFilePath === '' && configFileType === 'proxyAuth')) {
                    console.warn('Warning: Can\'t open ' + configFileType + ' file' + loggedFilePath + '. ' + failureConsequence + '.\n');
                }
            }
            config = {};
        }
        return config;
    }
    loadCommandLine() {
        var yargs = __webpack_require__(/*! yargs */ "yargs")
            .usage('$0 [options] [path/to/wwwroot]')
            .strict()
            .options({
            'port': {
                'description': 'Port to listen on.                [default: 3001]',
                number: true,
            },
            'public': {
                'type': 'boolean',
                'default': true,
                'description': 'Run a public server that listens on all interfaces.'
            },
            'config-file': {
                'description': 'File containing settings such as allowed domains to proxy. See serverconfig.json.example'
            },
            'proxy-auth': {
                'description': 'File containing auth information for proxied domains. See proxyauth.json.example'
            },
            'verbose': {
                'description': 'Produce more output and logging.',
                'type': 'boolean',
                'default': false
            },
            'help': {
                'alias': 'h',
                'type': 'boolean',
                'description': 'Show this help.'
            }
        });
        if (yargs.argv.help) {
            yargs.showHelp();
            process.exit();
        }
        // Yargs unhelpfully turns "--option foo --option bar" into { option: ["foo", "bar"] }.
        // Hence replace arrays with the rightmost value. This matters when `npm run` has options
        // built into it, and the user wants to override them with `npm run -- --port 3005` or something.
        // Yargs also seems to have setters, hence why we have to make a shallow copy.
        var argv = Object.assign({}, yargs.argv);
        Object.keys(argv).forEach(function (k) {
            if (k !== '_' && Array.isArray(argv[k])) {
                argv[k] = argv[k][argv[k].length - 1];
            }
        });
        return argv;
    }
    init(quiet) {
        var argv = this.loadCommandLine();
        this.listenHost = argv.public ? undefined : 'localhost';
        this.configFile = this.getConfigFile(argv.configFile, 'serverconfig.json');
        this.settings = this.getConfig(this.configFile, 'config', 'ALL proxy requests will be accepted.', quiet);
        this.proxyAuthFile = this.getConfigFile(argv.proxyAuth, 'proxyauth.json');
        this.proxyAuth = this.getConfig(this.proxyAuthFile, 'proxyAuth', 'Proxying to servers that require authentication will fail', quiet);
        if (!this.proxyAuth || Object.keys(this.proxyAuth).length === 0) {
            this.proxyAuth = this.settings.proxyAuth || {};
        }
        this.port = argv.port || this.settings.port || 3001;
        this.wwwroot = argv._.length > 0 ? argv._[0] : process.cwd() + '/wwwroot';
        this.configDir = argv.configFile ? path.dirname(argv.configFile) : '.';
        this.verbose = argv.verbose;
        this.hostName = this.listenHost || this.settings.hostName || 'localhost';
        this.settings.proxyAllDomains = this.settings.proxyAllDomains || typeof this.settings.allowProxyFor === 'undefined';
    }
}
module.exports = serveroptions;


/***/ }),

/***/ "./app/dbconfig.json":
/*!***************************!*\
  !*** ./app/dbconfig.json ***!
  \***************************/
/*! exports provided: database, default */
/***/ (function(module) {

module.exports = {"database":{"type":"mysql","host":"localhost","username":"","password":""}};

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, license, engines, repository, dependencies, config, devDependencies, scripts, default */
/***/ (function(module) {

module.exports = {"name":"terriajs-map","version":"0.0.1","description":"Geospatial catalog explorer based on TerriaJS.","license":"Apache-2.0","engines":{"node":">= 5.1.0","npm":">= 3.0.0"},"repository":{"type":"git","url":"http://github.com/TerriaJS/TerriaMap"},"dependencies":{"@types/node":"^10.12.18","terriajs-server":"^2.7.4","webpack":"^4.28.2"},"config":{"awsProfile":"terria","awsS3PackagesPath":"s3://terria-apps/map","awsRegion":"ap-southeast-2","awsEc2InstanceType":"t2.small","awsEc2ImageId":"ami-0d9ca8d416482590e","awsKeyName":"terria-kring","awsS3ServerConfigOverridePath":"s3://terria-apps/map/privateserverconfig-2016-08-31.json","awsS3ClientConfigOverridePath":"s3://terria-apps/map/privateclientconfig-2018-11-19.json","docker":{"name":"data61/terria-terriamap","include":"wwwroot node_modules devserverconfig.json index.js package.json version.js"}},"devDependencies":{"@webpack-cli/migrate":"^0.1.2","babel-eslint":"^7.0.0","babel-loader":"^7.0.0","babel-plugin-jsx-control-statements":"^3.2.8","babel-preset-env":"^1.6.1","babel-preset-react":"^6.5.0","css-loader":"^0.28.0","ejs":"^2.5.2","eslint":"^4.9.0","eslint-plugin-jsx-control-statements":"^2.2.0","eslint-plugin-react":"^7.2.1","extract-text-webpack-plugin":"^3.0.0","file-loader":"^1.1.5","fs-extra":"^4.0.0","generate-terriajs-schema":"^1.3.0","gulp":"^3.9.1","gulp-util":"^3.0.7","json5":"^0.5.0","mini-css-extract-plugin":"^0.5.0","mysql":"^2.16.0","node-notifier":"^5.1.2","node-sass":"^4.0.0","prop-types":"^15.6.0","raw-loader":"^0.5.1","react":"^16.3.2","react-dom":"^16.3.2","redbox-react":"^1.3.6","resolve-url-loader":"^2.0.2","sass-loader":"^6.0.3","semver":"^5.0.0","style-loader":"^0.19.1","svg-sprite-loader":"^3.4.0","terriajs":"6.3.6","terriajs-catalog-editor":"^0.2.0","terriajs-cesium":"1.51.0","terriajs-schema":"latest","ts-loader":"^5.3.2","typescript":"^3.2.2","typings-for-css-modules-loader":"^1.7.0","urijs":"^1.18.12","url-loader":"^0.5.7","webpack-node-externals":"^1.7.2","yargs":"^11.0.0"},"scripts":{"gulp-frontend":"gulp build-frontend","gulp-backend":"gulp build-backend","start-frontend":"./node_modules/.bin/webpack-dev-server --config webpack-frontend.config.js --open","start":"bash start-framework.sh --config-file serverconfig.json --public false app","stop":"bash stop-framework.sh","docker-build-local":"node ./deploy/docker/create-docker-context-for-node-components.js --build --push --tag auto --local","docker-build-prod":"node ./deploy/docker/create-docker-context-for-node-components.js --build --push --tag auto","docker-build-ci":"node ./deploy/docker/create-docker-context-for-node-components.js --build","postinstall":"echo 'Installation successful. What to do next:\\n  npm start       # Starts the server on port 3001\\n  gulp watch      # Builds TerriaMap and dependencies, and rebuilds if files change.'","hot":"webpack-dev-server --inline --config buildprocess/webpack.config.hot.js --hot --host 0.0.0.0","deploy":"rm -rf node_modules && npm install && npm run deploy-without-reinstall","deploy-without-reinstall":"gulp clean && gulp release && npm run deploy-current","deploy-current":"npm run get-deploy-overrides && gulp make-package --serverConfigOverride ./privateserverconfig.json --clientConfigOverride ./wwwroot/privateconfig.json && cd deploy/aws && ./stack create && cd ../..","get-deploy-overrides":"aws s3 --profile $npm_package_config_awsProfile cp $npm_package_config_awsS3ServerConfigOverridePath ./privateserverconfig.json && aws s3 --profile $npm_package_config_awsProfile cp $npm_package_config_awsS3ClientConfigOverridePath ./wwwroot/privateconfig.json"}};

/***/ }),

/***/ 0:
/*!***********************************!*\
  !*** multi ./app/backend/main.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app/backend/main.js */"./app/backend/main.js");


/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),

/***/ "base-x":
/*!*************************!*\
  !*** external "base-x" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("base-x");

/***/ }),

/***/ "basic-auth":
/*!*****************************!*\
  !*** external "basic-auth" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("basic-auth");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-brute":
/*!********************************!*\
  !*** external "express-brute" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-brute");

/***/ }),

/***/ "formidable":
/*!*****************************!*\
  !*** external "formidable" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("formidable");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "json5":
/*!************************!*\
  !*** external "json5" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("json5");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "proj4":
/*!************************!*\
  !*** external "proj4" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("proj4");

/***/ }),

/***/ "proj4js-defs/epsg":
/*!************************************!*\
  !*** external "proj4js-defs/epsg" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("proj4js-defs/epsg");

/***/ }),

/***/ "range_check":
/*!******************************!*\
  !*** external "range_check" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("range_check");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "request-promise":
/*!**********************************!*\
  !*** external "request-promise" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request-promise");

/***/ }),

/***/ "request-promise/errors":
/*!*****************************************!*\
  !*** external "request-promise/errors" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request-promise/errors");

/***/ }),

/***/ "terriajs-ogr2ogr":
/*!***********************************!*\
  !*** external "terriajs-ogr2ogr" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("terriajs-ogr2ogr");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "when":
/*!***********************!*\
  !*** external "when" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("when");

/***/ }),

/***/ "yargs":
/*!************************!*\
  !*** external "yargs" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwL2JhY2tlbmQvYXBwLnRzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL2NvbmZpZ3VyZWRhdGFiYXNlLnRzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL2NvbmZpZ3VyZXNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9jb250cm9sbGVycy9jb252ZXJ0LmpzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL2NvbnRyb2xsZXJzL2VzcmktdG9rZW4tYXV0aC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9jb250cm9sbGVycy9mZWVkYmFjay5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9jb250cm9sbGVycy9pbml0ZmlsZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9jb250cm9sbGVycy9wcm9qNGxvb2t1cC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9jb250cm9sbGVycy9wcm94eS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9jb250cm9sbGVycy9wcm94eWRvbWFpbnMuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2JhY2tlbmQvY29udHJvbGxlcnMvc2VydmVyY29uZmlnLmpzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL2NvbnRyb2xsZXJzL3NoYXJlLmpzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL2RhdGFiYXNlLnRzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL2RhdGFiYXNlcy9teXNxbC9teXNxbC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvYmFja2VuZC9lcnJvcnBhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2JhY2tlbmQvZXhpc3RzLnRzIiwid2VicGFjazovLy8uL2FwcC9iYWNrZW5kL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2JhY2tlbmQvc2VydmVyb3B0aW9ucy50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhd3Mtc2RrXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYmFzZS14XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYmFzaWMtYXV0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzLWJydXRlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZm9ybWlkYWJsZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cHNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqc29uNVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vcmdhblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm15c3FsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibmV0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicHJvajRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwcm9qNGpzLWRlZnMvZXBzZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJhbmdlX2NoZWNrXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVxdWVzdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlcXVlc3QtcHJvbWlzZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlcXVlc3QtcHJvbWlzZS9lcnJvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0ZXJyaWFqcy1vZ3Iyb2dyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwid2hlblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInlhcmdzXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsd0ZBQXdGO0FBQ3hGLHFGQUFxRjtBQUNyRiwyRUFBMkU7QUFDM0UsOENBQThDO0FBRTlDLElBQUksRUFBRSxHQUFHLG1CQUFPLENBQUMsY0FBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxPQUFPLEdBQUcsbUJBQU8sQ0FBQyx3QkFBUyxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyx5Q0FBVSxDQUFDLENBQUM7QUFDakMsSUFBSSxhQUFhLEdBQUcsbUJBQU8sQ0FBQyx1REFBaUIsQ0FBQyxDQUFDO0FBQy9DLElBQUksZUFBZSxHQUFHLG1CQUFPLENB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhFQUE4RTtBQUM5RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtB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OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLDhDOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDRDOzs7Ozs7Ozs7OztBQ0FBLG1EOzs7Ozs7Ozs7OztBQ0FBLDZDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGtDIiwiZmlsZSI6ImJ1bmRsZS1iYWNrZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLy8gVXNpbmcgcmVxdWlyZSBhcyBpdCBpcyBzaW1wbGVyIGluc3RlYWQgb2YgdHlwZXNjcmlwdCdzIGltcG9ydC9leHBvcnQgZGVyaXZlZCBzeW50YXguIFxuLy8gU2VlIHR5cGVzY3JpcHQncyBcImV4cG9ydCA9IGFuZCBpbXBvcnQgPSByZXF1aXJlKClcIiBtb2R1bGVzIGRvY3VtZW50YXRpb24gc2VjdGlvbi4gXG4vLyBEb2N1bWVudGF0aW9uOiBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9tb2R1bGVzLmh0bWxcbi8vIFRoaXMgd29ya3Mgd2VsbCB3aXRoIHRoZSBleGlzdGluZyBjb2RlYmFzZS5cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBjbHVzdGVyID0gcmVxdWlyZSgnY2x1c3RlcicpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vZXhpc3RzJyk7XG52YXIgc2VydmVyb3B0aW9ucyA9IHJlcXVpcmUoJy4vc2VydmVyb3B0aW9ucycpO1xudmFyIGNvbmZpZ3VyZXNlcnZlciA9IHJlcXVpcmUoJy4vY29uZmlndXJlc2VydmVyJyk7XG52YXIgY29uZmlndXJlZGF0YWJhc2UgPSByZXF1aXJlKCcuL2NvbmZpZ3VyZWRhdGFiYXNlJyk7XG5cbmNsYXNzIGFwcCB7XG5cbiAgICBwdWJsaWMgc2VydmVyOiBhbnk7XG4gICAgcHVibGljIGRiOiBhbnk7IFxuICAgIHB1YmxpYyBvcHRpb25zOiBhbnk7XG5cbiAgICBwdWJsaWMgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgc2VydmVyb3B0aW9ucygpO1xuICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdCgpO1xuXG4gICAgICAgIGlmIChjbHVzdGVyLmlzTWFzdGVyKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICgnVGVycmlhSlMgU2VydmVyICcgKyByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uKTsgLy8gVGhlIG1hc3RlciBwcm9jZXNzIGp1c3Qgc3BpbnMgdXAgYSBmZXcgd29ya2VycyBhbmQgcXVpdHMuXG5cbiAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKCd0ZXJyaWFqcy5waWQnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMud2FybignVGVycmlhSlMtU2VydmVyIHNlZW1zIHRvIGJlIHJ1bm5pbmcgYWxyZWFkeS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucG9ydEluVXNlKHRoaXMub3B0aW9ucy5wb3J0LCB0aGlzLm9wdGlvbnMubGlzdGVuSG9zdCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5saXN0ZW5Ib3N0ICE9PSAnbG9jYWxob3N0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMucnVuTWFzdGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRTZXJ2ZXIodGhpcy5vcHRpb25zKTtcbiAgICAgICAgICAgIH0gICAgIFxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBhIGZvcmtlZCBwcm9jZXNzLlxuICAgICAgICAgICAgdGhpcy5zdGFydFNlcnZlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgcG9ydEluVXNlKHBvcnQsIGhvc3QpIHtcblxuICAgICAgICB2YXIgc2VydmVyID0gcmVxdWlyZSgnbmV0JykuY3JlYXRlU2VydmVyKCk7XG5cbiAgICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCBob3N0KTtcbiAgICAgICAgc2VydmVyLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3J0ICcgKyBwb3J0ICsgJyBpcyBpbiB1c2UuIEV4aXQgc2VydmVyIHVzaW5nIHBvcnQgMzAwMSBhbmQgdHJ5IGFnYWluLicpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHNlcnZlci5vbignbGlzdGVuaW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgZXJyb3IobWVzc2FnZSkge1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnICsgbWVzc2FnZSk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyB3YXJuKG1lc3NhZ2UpIHtcblxuICAgICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6ICcgKyBtZXNzYWdlKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVFeGl0KCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCcoVGVycmlhSlMtU2VydmVyIGV4aXRpbmcuKScpO1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYygndGVycmlhanMucGlkJykpIHtcbiAgICAgICAgICAgIGZzLnVubGlua1N5bmMoJ3RlcnJpYWpzLnBpZCcpO1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBydW5NYXN0ZXIoKSB7XG5cbiAgICAgICAgdmFyIGNwdUNvdW50ID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoO1xuXG4gICAgICAgIC8vIExldCdzIGVxdWF0ZSBub24tcHVibGljLCBsb2NhbGhvc3QgbW9kZSB3aXRoIFwic2luZ2xlLWNwdSwgZG9uJ3QgcmVzdGFydFwiLlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxpc3Rlbkhvc3QgPT09ICdsb2NhbGhvc3QnKSB7XG4gICAgICAgICAgICBjcHVDb3VudCA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnU2VydmluZyBkaXJlY3RvcnkgXCInICsgdGhpcy5vcHRpb25zLnd3d3Jvb3QgKyAnXCIgb24gcG9ydCAnICsgdGhpcy5vcHRpb25zLnBvcnQgKyAnIHRvICcgKyAodGhpcy5vcHRpb25zLmxpc3Rlbkhvc3QgPyB0aGlzLm9wdGlvbnMubGlzdGVuSG9zdDogJ3RoZSB3b3JsZCcpICsgJy4nKTtcbiAgICAgICAgcmVxdWlyZSgnLi9jb250cm9sbGVycy9jb252ZXJ0JykoKS50ZXN0R2RhbCgpO1xuXG4gICAgICAgIGlmICghZXhpc3RzKHRoaXMub3B0aW9ucy53d3dyb290KSkge1xuICAgICAgICAgICAgdGhpcy53YXJuKCdcIicgKyB0aGlzLm9wdGlvbnMud3d3cm9vdCArICdcIiBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICAgICAgfSBlbHNlIGlmICghZXhpc3RzKHRoaXMub3B0aW9ucy53d3dyb290ICsgJy9pbmRleC5odG1sJykpIHtcbiAgICAgICAgICAgIHRoaXMud2FybignXCInICsgdGhpcy5vcHRpb25zLnd3d3Jvb3QgKyAnXCIgaXMgbm90IGEgVGVycmlhSlMgd3d3cm9vdCBkaXJlY3RvcnkuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWV4aXN0cyh0aGlzLm9wdGlvbnMud3d3cm9vdCArICcvYnVpbGQnKSkge1xuICAgICAgICAgICAgdGhpcy53YXJuKCdcIicgKyB0aGlzLm9wdGlvbnMud3d3cm9vdCArICdcIiBoYXMgbm90IGJlZW4gYnVpbHQuIFlvdSBzaG91bGQgZG8gdGhpczpcXG5cXG4nICtcbiAgICAgICAgICAgICAgICAnPiBjZCAnICsgdGhpcy5vcHRpb25zLnd3d3Jvb3QgKyAnLy4uXFxuJyArXG4gICAgICAgICAgICAgICAgJz4gZ3VscFxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuc2V0dGluZ3MuYWxsb3dQcm94eUZvciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMud2FybignVGhlIGNvbmZpZ3VyYXRpb24gZG9lcyBub3QgY29udGFpbiBhIFwiYWxsb3dQcm94eUZvclwiIGxpc3QuICBUaGUgc2VydmVyIHdpbGwgcHJveHkgX2FueV8gcmVxdWVzdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb2Nlc3Mub24oJ1NJR1RFUk0nLCB0aGlzLmhhbmRsZUV4aXQpO1xuXG4gICAgICAgIC8vIExpc3RlbiBmb3IgZHlpbmcgd29ya2Vyc1xuICAgICAgICBjbHVzdGVyLm9uKCdleGl0JywgZnVuY3Rpb24gKHdvcmtlcikge1xuICAgICAgICAgICAgaWYgKCF3b3JrZXIuc3VpY2lkZSkge1xuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGRlYWQgd29ya2VyIGlmIG5vdCBhIHN0YXJ0dXAgZXJyb3IgbGlrZSBwb3J0IGluIHVzZS5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxpc3Rlbkhvc3QgPT09ICdsb2NhbGhvc3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdXb3JrZXIgJyArIHdvcmtlci5pZCArICcgZGllZC4gTm90IHJlcGxhY2luZyBpdCBhcyB3ZVxcJ3JlIHJ1bm5pbmcgaW4gbm9uLXB1YmxpYyBtb2RlLicpOyAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnV29ya2VyICcgKyB3b3JrZXIuaWQgKyAnIGRpZWQuIFJlcGxhY2luZyBpdC4nKTtcbiAgICAgICAgICAgICAgICAgICAgY2x1c3Rlci5mb3JrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0ZXJyaWFqcy5waWQnLCBwcm9jZXNzLnBpZC50b1N0cmluZygpKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnKFRlcnJpYUpTLVNlcnZlciBydW5uaW5nIHdpdGggcGlkICcgKyBwcm9jZXNzLnBpZCArICcpJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXVuY2hpbmcgJyArICBjcHVDb3VudCArICcgd29ya2VyIHByb2Nlc3Nlcy4nKTtcblxuICAgICAgICAvLyBDcmVhdGUgYSB3b3JrZXIgZm9yIGVhY2ggQ1BVXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3B1Q291bnQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2x1c3Rlci5mb3JrKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydFNlcnZlcihvcHRpb25zKSB7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBjb25maWd1cmVzZXJ2ZXIuc3RhcnQob3B0aW9ucyk7IC8vIFNldCBzZXJ2ZXIgY29uZmlndXJhdGlvbnMgYW5kIGdlbmVyYXRlIHNlcnZlci4gV2UgcmVwbGFjZSBhcHAgaGVyZSB3aXRoIHRoZSBhY3R1YWwgYXBwbGljYXRpb24gc2VydmVyIGZvciBwcm9wZXIgbmFtaW5nIGNvbnZlbnRpb25zLlxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXJ2ZXIubGlzdGVuKG9wdGlvbnMucG9ydCwgb3B0aW9ucy5saXN0ZW5Ib3N0LCAoKSA9PiBjb25zb2xlLmxvZyhgVGVycmlhIGZyYW1ld29yayBydW5uaW5nIG9uICR7b3B0aW9ucy5wb3J0fSFgKSk7IC8vIFN0YXJ0IEhUVFAvcyBzZXJ2ZXIgd2l0aCBleHByZXNzanMgbWlkZGxld2FyZS5cbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGIgPSBjb25maWd1cmVkYXRhYmFzZS5zdGFydCgpOyAvLyBSdW4gZGF0YWJhc2UgY29uZmlndXJhdGlvbiBhbmQgZ2V0IGRhdGFiYXNlIG9iamVjdCBmb3IgdGhlIGZyYW1ld29yay5cblxuICAgIH1cblxufVxuXG5leHBvcnQgPSBhcHA7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkYXRhYmFzZSA9IHJlcXVpcmUoJy4vZGF0YWJhc2UnKTtcblxuY2xhc3MgY29uZmlndXJlZGF0YWJhc2Uge1xuXG5cdHN0YXRpYyBzdGFydCgpOiBhbnkge1xuXG5cdFx0dmFyIGNvbm5lY3Rpb247XG5cblx0XHR2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vZGJjb25maWcuanNvbicpO1xuXHRcblx0XHRzd2l0Y2goY29uZmlnLmRhdGFiYXNlLnR5cGUpIHtcblx0XHRjYXNlICdteXNxbCc6XG5cdFx0XHRjb25uZWN0aW9uID0gcmVxdWlyZSgnLi9kYXRhYmFzZXMvbXlzcWwvbXlzcWwuanMnKTtcblx0XHQvKiBPdGhlciBkYXRhYmFzZSBleGFtcGxlXG5cdFx0Y2FzZSAnbXNzcWwnOlxuXHRcdFx0dGVycmlhZGIgPSByZXF1aXJlKCcuL2RhdGFiYXNlcy9tc3NxbC9tc3NxbC5qcycpO1xuXHRcdCovXG5cdFx0LyogT3RoZXIgZGF0YWJhc2UgZXhhbXBsZVxuXHRcdGNhc2UgJ21vbmdvZGInOlxuXHRcdFx0dGVycmlhZGIgPSByZXF1aXJlKCcuL2RhdGFiYXNlcy9tb25nb2RiL21vbmdvZGIuanMnKTtcblx0XHQqL1xuXHRcdC8qIEN1c3RvbSBleGFtcGxlXG5cdFx0Y2FzZSAnY3VzdG9tZGInOlxuXHRcdFx0dGVycmlhZGIgPSByZXF1aXJlKCcuL2RhdGFiYXNlcy9jdXN0b21kYi9jdXN0b21kYi5qcycpO1xuXHRcdCovXG5cdFx0ZGVmYXVsdDogXG5cdFx0XHRjb25uZWN0aW9uID0gcmVxdWlyZSgnLi9kYXRhYmFzZXMvbXlzcWwvbXlzcWwuanMnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IGRhdGFiYXNlKGNvbmZpZy5kYXRhYmFzZS50eXBlLCBjb25maWcuZGF0YWJhc2UuaG9zdCwgY29uZmlnLmRhdGFiYXNlLnVzZXJuYW1lLCBjb25maWcuZGF0YWJhc2UucGFzc3dvcmQsIGNvbm5lY3Rpb24pOyAvLyBSZXR1cm4gZGF0YWJhc2Ugb2JqZWN0XG5cblx0fVxuXG59XG5cbmV4cG9ydCA9IGNvbmZpZ3VyZWRhdGFiYXNlOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgY29ycyA9IHJlcXVpcmUoJ2NvcnMnKTtcbnZhciBjbHVzdGVyID0gcmVxdWlyZSgnY2x1c3RlcicpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vZXhpc3RzJyk7XG52YXIgYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBFeHByZXNzQnJ1dGUgPSByZXF1aXJlKCdleHByZXNzLWJydXRlJyk7XG5cbi8vIFRoaXMgaXMgYSBzdGF0aWMgY2xhc3Mgd2l0aCBzdGF0aWMgcHJvcGVydGllcyB0byBjb25maWd1cmUgdGhlIHNlcnZlci4gXG4vLyBDcmVhdGVzIGFuZCByZXR1cm5zIGEgc2luZ2xlIGV4cHJlc3Mgc2VydmVyLlxuLy8gSXQgZG9lcyBub3QgbmVlZCB0byBiZSBpbnN0YW50aWF0ZWQuIFxuY2xhc3MgY29uZmlndXJlc2VydmVyIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgYXBwOiBhbnk7XG4gICAgcHVibGljIHN0YXRpYyBvcHRpb25zOiBhbnk7XG5cbiAgICBzdGF0aWMgc3RhcnQob3B0aW9ucyk6IGFueSB7XG4gICAgICAgIC8vIGV2ZW50dWFsbHkgdGhpcyBtaW1lIHR5cGUgY29uZmlndXJhdGlvbiB3aWxsIG5lZWQgdG8gY2hhbmdlXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9zZW5kL2NvbW1pdC9kMmNiNTQ2NThjZTY1OTQ4YjBlZDZlNWZiNWRlNjlkMDIyYmVmOTQxXG4gICAgICAgIHZhciBtaW1lID0gZXhwcmVzcy5zdGF0aWMubWltZTtcbiAgICAgICAgbWltZS5kZWZpbmUoe1xuICAgICAgICAgICAgJ3RoaXMuYXBwbGljYXRpb24vanNvbicgOiBbJ2N6bWwnLCAnanNvbicsICdnZW9qc29uJ10sXG4gICAgICAgICAgICAndGV4dC9wbGFpbicgOiBbJ2dsc2wnXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIC8vIGluaXRpYWxpc2UgdGhpcy5hcHAgd2l0aCBzdGFuZGFyZCBtaWRkbGV3YXJlc1xuICAgICAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcbiAgICAgICAgdGhpcy5hcHAudXNlKGNvbXByZXNzaW9uKCkpO1xuICAgICAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcbiAgICAgICAgdGhpcy5hcHAuZGlzYWJsZSgnZXRhZycpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwLnVzZShyZXF1aXJlKCdtb3JnYW4nKSgnZGV2JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNldHRpbmdzLnRydXN0UHJveHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmFwcC5zZXQoJ3RydXN0IHByb3h5Jywgb3B0aW9ucy5zZXR0aW5ncy50cnVzdFByb3h5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKCdMaXN0ZW5pbmcgb24gdGhlc2UgdGhpcy5lbmRwb2ludHM6JywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVuZHBvaW50KCcvcGluZycsIGZ1bmN0aW9uKHJlcSwgcmVzKXtcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCgnT0snKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2UgZG8gdGhpcyBhZnRlciB0aGUgL3Bpbmcgc2VydmljZSBhYm92ZSBzbyB0aGF0IHBpbmcgY2FuIGJlIHVzZWQgdW5hdXRoZW50aWNhdGVkIGFuZCB3aXRob3V0IFRMUyBmb3IgaGVhbHRoIGNoZWNrcy5cblxuICAgICAgICBpZiAob3B0aW9ucy5zZXR0aW5ncy5yZWRpcmVjdFRvSHR0cHMpIHtcbiAgICAgICAgICAgIHZhciBodHRwQWxsb3dlZEhvc3RzID0gb3B0aW9ucy5zZXR0aW5ncy5odHRwQWxsb3dlZEhvc3RzIHx8IFtcImxvY2FsaG9zdFwiXTtcbiAgICAgICAgICAgIHRoaXMuYXBwLnVzZShmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChodHRwQWxsb3dlZEhvc3RzLmluZGV4T2YocmVxLmhvc3RuYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlcS5wcm90b2NvbCAhPT0gJ2h0dHBzJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vJyArIHJlcS5ob3N0bmFtZSArIHJlcS51cmw7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWRpcmVjdCgzMDEsIHVybCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGF1dGggPSBvcHRpb25zLnNldHRpbmdzLmJhc2ljQXV0aGVudGljYXRpb247XG5cbiAgICAgICAgaWYgKGF1dGggJiYgYXV0aC51c2VybmFtZSAmJiBhdXRoLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICB2YXIgc3RvcmUgPSBuZXcgRXhwcmVzc0JydXRlLk1lbW9yeVN0b3JlKCk7XG4gICAgICAgICAgICB2YXIgcmF0ZUxpbWl0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBmcmVlUmV0cmllczogMixcbiAgICAgICAgICAgICAgICBtaW5XYWl0OiAyMDAsXG4gICAgICAgICAgICAgICAgbWF4V2FpdDogNjAwMDAsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2V0dGluZ3MucmF0ZUxpbWl0ICYmIG9wdGlvbnMuc2V0dGluZ3MucmF0ZUxpbWl0LmZyZWVSZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByYXRlTGltaXRPcHRpb25zLmZyZWVSZXRyaWVzID0gb3B0aW9ucy5zZXR0aW5ncy5yYXRlTGltaXQuZnJlZVJldHJpZXM7XG4gICAgICAgICAgICAgICAgcmF0ZUxpbWl0T3B0aW9ucy5taW5XYWl0ID0gb3B0aW9ucy5zZXR0aW5ncy5yYXRlTGltaXQubWluV2FpdDtcbiAgICAgICAgICAgICAgICByYXRlTGltaXRPcHRpb25zLm1heFdhaXQgPSBvcHRpb25zLnNldHRpbmdzLnJhdGVMaW1pdC5tYXhXYWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJydXRlZm9yY2UgPSBuZXcgRXhwcmVzc0JydXRlKHN0b3JlLCByYXRlTGltaXRPcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYXBwLnVzZShicnV0ZWZvcmNlLnByZXZlbnQsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSBiYXNpY0F1dGgocmVxKTtcbiAgICAgICAgICAgICAgICBpZiAodXNlciAmJiB1c2VyLm5hbWUgPT09IGF1dGgudXNlcm5hbWUgJiYgdXNlci5wYXNzID09PSBhdXRoLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24sIHJlc2V0IHJhdGUgbGltaXRpbmcuXG4gICAgICAgICAgICAgICAgICAgIHJlcS5icnV0ZS5yZXNldChuZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignV1dXLUF1dGhlbnRpY2F0ZScsICdCYXNpYyByZWFsbT1cInRlcnJpYWpzLXNlcnZlclwiJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoJ1VuYXV0aG9yaXplZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VydmUgdGhlIGJ1bGsgb2Ygb3VyIHRoaXMuYXBwbGljYXRpb24gYXMgYSBzdGF0aWMgd2ViIGRpcmVjdG9yeS5cbiAgICAgICAgdmFyIHNlcnZlV3d3Um9vdCA9IGV4aXN0cyhvcHRpb25zLnd3d3Jvb3QgKyAnL2luZGV4Lmh0bWwnKTtcbiAgICAgICAgaWYgKHNlcnZlV3d3Um9vdCkge1xuICAgICAgICAgICAgdGhpcy5hcHAudXNlKGV4cHJlc3Muc3RhdGljKG9wdGlvbnMud3d3cm9vdCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJveHkgZm9yIHNlcnZlcnMgdGhhdCBkb24ndCBzdXBwb3J0IENPUlNcbiAgICAgICAgdmFyIGJ5cGFzc1Vwc3RyZWFtUHJveHlIb3N0c01hcCA9IChvcHRpb25zLnNldHRpbmdzLmJ5cGFzc1Vwc3RyZWFtUHJveHlIb3N0cyB8fCBbXSkucmVkdWNlKGZ1bmN0aW9uKG1hcCwgaG9zdCkge1xuICAgICAgICAgICAgICAgIGlmIChob3N0ICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBtYXBbaG9zdC50b0xvd2VyQ2FzZSgpXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgdGhpcy5lbmRwb2ludCgnL3Byb3h5JywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9wcm94eScpKHtcbiAgICAgICAgICAgIHByb3h5YWJsZURvbWFpbnM6IG9wdGlvbnMuc2V0dGluZ3MuYWxsb3dQcm94eUZvcixcbiAgICAgICAgICAgIHByb3h5QWxsRG9tYWluczogb3B0aW9ucy5zZXR0aW5ncy5wcm94eUFsbERvbWFpbnMsXG4gICAgICAgICAgICBwcm94eUF1dGg6IG9wdGlvbnMucHJveHlBdXRoLFxuICAgICAgICAgICAgcHJveHlQb3N0U2l6ZUxpbWl0OiBvcHRpb25zLnNldHRpbmdzLnByb3h5UG9zdFNpemVMaW1pdCxcbiAgICAgICAgICAgIHVwc3RyZWFtUHJveHk6IG9wdGlvbnMuc2V0dGluZ3MudXBzdHJlYW1Qcm94eSxcbiAgICAgICAgICAgIGJ5cGFzc1Vwc3RyZWFtUHJveHlIb3N0czogYnlwYXNzVXBzdHJlYW1Qcm94eUhvc3RzTWFwLFxuICAgICAgICAgICAgYmFzaWNBdXRoZW50aWNhdGlvbjogb3B0aW9ucy5zZXR0aW5ncy5iYXNpY0F1dGhlbnRpY2F0aW9uLFxuICAgICAgICAgICAgYmxhY2tsaXN0ZWRBZGRyZXNzZXM6IG9wdGlvbnMuc2V0dGluZ3MuYmxhY2tsaXN0ZWRBZGRyZXNzZXNcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHZhciBlc3JpVG9rZW5BdXRoID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9lc3JpLXRva2VuLWF1dGgnKShvcHRpb25zLnNldHRpbmdzLmVzcmlUb2tlbkF1dGgpO1xuICAgICAgICBpZiAoZXNyaVRva2VuQXV0aCkge1xuICAgICAgICAgICAgdGhpcy5lbmRwb2ludCgnL2VzcmktdG9rZW4tYXV0aCcsIGVzcmlUb2tlbkF1dGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbmRwb2ludCgnL3Byb2o0ZGVmJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9wcm9qNGxvb2t1cCcpKTsgICAgICAgICAgICAvLyBQcm9qNGRlZiBsb29rdXAgc2VydmljZSwgdG8gYXZvaWQgZG93bmxvYWRpbmcgYWxsIGRlZmluaXRpb25zIGludG8gdGhlIGNsaWVudC5cbiAgICAgICAgdGhpcy5lbmRwb2ludCgnL2NvbnZlcnQnLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2NvbnZlcnQnKShvcHRpb25zKS5yb3V0ZXIpOyAvLyBPR1IyT0dSIHdydGhpcy5hcHBlciB0byBhbGxvdyBzdXBwb3J0aW5nIGZpbGUgdHlwZXMgbGlrZSBTaGFwZWZpbGUuXG4gICAgICAgIHRoaXMuZW5kcG9pbnQoJy9wcm94eWFibGVkb21haW5zJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9wcm94eWRvbWFpbnMnKSh7ICAgLy8gUmV0dXJucyBKU09OIGxpc3Qgb2YgZG9tYWlucyB3ZSdyZSB3aWxsaW5nIHRvIHByb3h5IGZvclxuICAgICAgICAgICAgcHJveHlhYmxlRG9tYWluczogb3B0aW9ucy5zZXR0aW5ncy5hbGxvd1Byb3h5Rm9yLFxuICAgICAgICAgICAgcHJveHlBbGxEb21haW5zOiAhIW9wdGlvbnMuc2V0dGluZ3MucHJveHlBbGxEb21haW5zLFxuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMuZW5kcG9pbnQoJy9zZXJ2ZXJjb25maWcnLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3NlcnZlcmNvbmZpZycpKG9wdGlvbnMpKTtcblxuICAgICAgICB2YXIgZXJyb3JQYWdlID0gcmVxdWlyZSgnLi9lcnJvcnBhZ2UnKTtcbiAgICAgICAgdmFyIHNob3c0MDQgPSBzZXJ2ZVd3d1Jvb3QgJiYgZXhpc3RzKG9wdGlvbnMud3d3cm9vdCArICcvNDA0Lmh0bWwnKTtcbiAgICAgICAgdmFyIGVycm9yNDA0ID0gZXJyb3JQYWdlLmVycm9yNDA0KHNob3c0MDQsIG9wdGlvbnMud3d3cm9vdCwgc2VydmVXd3dSb290KTtcbiAgICAgICAgdmFyIHNob3c1MDAgPSBzZXJ2ZVd3d1Jvb3QgJiYgZXhpc3RzKG9wdGlvbnMud3d3cm9vdCArICcvNTAwLmh0bWwnKTtcbiAgICAgICAgdmFyIGVycm9yNTAwID0gZXJyb3JQYWdlLmVycm9yNTAwKHNob3c1MDAsIG9wdGlvbnMud3d3cm9vdCk7XG4gICAgICAgIHZhciBpbml0UGF0aHMgPSBvcHRpb25zLnNldHRpbmdzLmluaXRQYXRocyB8fCBbXTtcblxuICAgICAgICBpZiAoc2VydmVXd3dSb290KSB7XG4gICAgICAgICAgICBpbml0UGF0aHMucHVzaChwYXRoLmpvaW4ob3B0aW9ucy53d3dyb290LCAnaW5pdCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBwLnVzZSgnL2luaXQnLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2luaXRmaWxlJykoaW5pdFBhdGhzLCBlcnJvcjQwNCwgb3B0aW9ucy5jb25maWdEaXIpKTtcblxuICAgICAgICB2YXIgZmVlZGJhY2tTZXJ2aWNlID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9mZWVkYmFjaycpKG9wdGlvbnMuc2V0dGluZ3MuZmVlZGJhY2spO1xuICAgICAgICBpZiAoZmVlZGJhY2tTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50KCcvZmVlZGJhY2snLCBmZWVkYmFja1NlcnZpY2UpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXIgc2hhcmVTZXJ2aWNlID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9zaGFyZScpKG9wdGlvbnMuc2V0dGluZ3Muc2hhcmVVcmxQcmVmaXhlcywgb3B0aW9ucy5zZXR0aW5ncy5uZXdTaGFyZVVybFByZWZpeCwgb3B0aW9ucy5ob3N0TmFtZSwgb3B0aW9ucy5wb3J0KTtcbiAgICAgICAgaWYgKHNoYXJlU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy5lbmRwb2ludCgnL3NoYXJlJywgc2hhcmVTZXJ2aWNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBwLnVzZShlcnJvcjQwNCk7XG4gICAgICAgIHRoaXMuYXBwLnVzZShlcnJvcjUwMCk7XG4gICAgICAgIHZhciBzZXJ2ZXIgPSB0aGlzLmFwcDtcbiAgICAgICAgdmFyIG9zaCA9IG9wdGlvbnMuc2V0dGluZ3MuaHR0cHM7XG4gICAgICAgIGlmIChvc2ggJiYgb3NoLmtleSAmJiBvc2guY2VydCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xhdW5jaGluZyBpbiBIVFRQUyBtb2RlLicpO1xuICAgICAgICAgICAgdmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbiAgICAgICAgICAgIHNlcnZlciA9IGh0dHBzLmNyZWF0ZVNlcnZlcih7XG4gICAgICAgICAgICAgICAga2V5OiBmcy5yZWFkRmlsZVN5bmMob3NoLmtleSksXG4gICAgICAgICAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKG9zaC5jZXJ0KVxuICAgICAgICAgICAgfSwgdGhpcy5hcHApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrID8gZXJyLnN0YWNrIDogZXJyKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcblxuICAgIH1cblxuICAgIHN0YXRpYyBsb2cobWVzc2FnZSwgd29ya2VyMW9ubHkpIHtcblxuICAgICAgICBpZiAoIXdvcmtlcjFvbmx5IHx8IGNsdXN0ZXIuaXNXb3JrZXIgJiYgY2x1c3Rlci53b3JrZXIuaWQgPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZW5kcG9pbnQocGF0aCxyb3V0ZXIpIHtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKCdodHRwOi8vJyArIHRoaXMub3B0aW9ucy5ob3N0TmFtZSArICc6JyArIHRoaXMub3B0aW9ucy5wb3J0ICsgJy9hcGkvdjEnICsgcGF0aCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGggIT09ICdwcm94eWFibGVkb21haW5zJykge1xuICAgICAgICAgICAgLy8gZGVwcmVjYXRlZCB0aGlzLmVuZHBvaW50IHRoYXQgaXNuJ3QgcGFydCBvZiBWMVxuICAgICAgICAgICAgdGhpcy5hcHAudXNlKCcvYXBpL3YxJyArIHBhdGgsIHJvdXRlcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVwcmVjYXRlZCB0aGlzLmVuZHBvaW50IGF0IGAvYFxuICAgICAgICB0aGlzLmFwcC51c2UocGF0aCwgcm91dGVyKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgPSBjb25maWd1cmVzZXJ2ZXI7IiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIG9ncjJvZ3IgPSByZXF1aXJlKCd0ZXJyaWFqcy1vZ3Iyb2dyJyk7XG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcbnZhciBmb3JtaWRhYmxlID0gcmVxdWlyZSgnZm9ybWlkYWJsZScpO1xuXG52YXIgY29udmVydCA9IHt9O1xuXG5jb252ZXJ0LnRlc3RHZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gdGVzdCBkb2luZyAnc29tZXRoaW5nJyB3aXRoIGFuIGVtcHR5IEdlb0pTT04gb2JqZWN0LiBJdCB3aWxsIGVpdGhlciBmYWlsIHdpdGggRU5PRU5ULCBvciBmYWlsIHdpdGggT0dSMk9HUiBvdXRwdXQuXG4gICAgb2dyMm9ncih7fSkuZXhlYyhmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBpZiAoKGVycm9yICE9PSB1bmRlZmluZWQpICYmIGVycm9yLm1lc3NhZ2UubWF0Y2goL0VOT0VOVC8pKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29udmVydCB3YXJuaW5nOiBvZ3Iyb2dyIChnZGFsKSBpcyBub3QgaW5zdGFsbGVkIG9yIGluYWNjZXNzaWJsZSwgc28gdGhlIGZvcm1hdCBjb252ZXJzaW9uIHNlcnZpY2Ugd2lsbCBmYWlsLicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gR0RBTCBpcyBpbnN0YWxsZWQgb2suXG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHRvb0JpZ0Vycm9yKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gICAgcmVzcG9uc2UuaGVhZGVyKCdDb25uZWN0aW9uJywgJ2Nsb3NlJyk7IC8vIHN0b3AgdGhlIGNsaWVudCBmcm9tIHNlbmRpbmcgYWRkaXRpb25hbCBkYXRhLlxuICAgIHJlc3BvbnNlLnN0YXR1cyg0MTMpIC8vIFBheWxvYWQgVG9vIExhcmdlXG4gICAgICAgICAgICAuc2VuZCgnVGhpcyBmaWxlIGlzIHRvbyBiaWcgdG8gY29udmVydC4gTWF4aW11bSBhbGxvd2VkIHNpemU6ICcgKyBjb252ZXJ0Lm1heENvbnZlcnNpb25TaXplICsgJyBieXRlcycpO1xuICAgIGNvbnNvbGUubG9nKCdDb252ZXJ0OiB1cGxvYWRlZCBmaWxlIGV4Y2VlZHMgbGltaXQgb2YgJyArIGNvbnZlcnQubWF4Q29udmVyc2lvblNpemUgKyAnIGJ5dGVzLiBBYm9ydGluZy4nKTtcbn1cblxuLy8gRXh0cmFjdCBmaWxlIG5hbWUgYW5kIHBhdGggb3V0IG9mIHRoZSBwcm92aWRlZCBIVFRQIFBPU1QgZm9ybVxuZnVuY3Rpb24gcGFyc2VGb3JtKHJlcSwgcmVzLCBjYWxsYmFjaykge1xuICAgIHZhciBmb3JtID0gbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKCk7XG4gICAgZm9ybS5vbigncHJvZ3Jlc3MnLCBmdW5jdGlvbihieXRlc1JlY2VpdmVkLCBieXRlc0V4cGVjdGVkKSB7XG4gICAgICAgIC8vIEFsbG93IGRvdWJsZSBiZWNhdXNlIGJ5dGVzUmVjZWl2ZWQgaXMgdGhlIGVudGlyZSBmb3JtLCBub3QganVzdCB0aGUgZmlsZS5cbiAgICAgICAgaWYgKGJ5dGVzUmVjZWl2ZWQgPiBjb252ZXJ0Lm1heENvbnZlcnNpb25TaXplICogMikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRvb0JpZ0Vycm9yKHJlcSwgcmVzKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBmaWxlcyBhbHJlYWR5IHVwbG9hZGVkXG4gICAgICAgICAgICAoZm9ybS5vcGVuZWRGaWxlcyB8fCBbXSkuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZnMudW5saW5rKGZpbGUucGF0aCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBmb3JtLnBhcnNlKHJlcSwgZnVuY3Rpb24oZXJyLCBmaWVsZHMsIGZpbGVzKSB7XG4gICAgICAgIGlmIChmaWVsZHMuaW5wdXRfdXJsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZHMuaW5wdXRfdXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZpZWxkcy5pbnB1dF91cmwsIGZpZWxkcy5pbnB1dF91cmwsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmaWxlcy5pbnB1dF9maWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChmaWxlcy5pbnB1dF9maWxlLnNpemUgPD0gY29udmVydC5tYXhDb252ZXJzaW9uU2l6ZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZpbGVzLmlucHV0X2ZpbGUucGF0aCwgZmlsZXMuaW5wdXRfZmlsZS5uYW1lLCByZXEsIHJlcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLnVubGluayhmaWxlcy5pbnB1dF9maWxlLnBhdGgpOyAvLyB3ZSBoYXZlIHRvIGRlbGV0ZSB0aGUgdXBsb2FkIG91cnNlbHZlcy5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9vQmlnRXJyb3IocmVxLCByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIFBhc3MgYSBzdHJlYW0gdG8gdGhlIE9HUjJPR1IgbGlicmFyeSwgcmV0dXJuaW5nIGEgR2VvSlNPTiByZXN1bHQuXG5mdW5jdGlvbiBjb252ZXJ0U3RyZWFtKHN0cmVhbSwgcmVxLCByZXMsIGhpbnQsIGZwYXRoKSB7XG4gICAgdmFyIG9nciA9IG9ncjJvZ3Ioc3RyZWFtLCBoaW50KVxuICAgICAgICAgICAgICAgICAgICAuc2tpcGZhaWx1cmVzKClcbiAgICAgICAgICAgICAgICAgICAgLm9wdGlvbnMoWyctdF9zcnMnLCAnRVBTRzo0MzI2J10pO1xuXG4gICAgb2dyLmV4ZWMoZnVuY3Rpb24gKGVyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29udmVydCBlcnJvcjogJyArIGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQxNSkuIC8vIFVuc3VwcG9ydGVkIE1lZGlhIFR5cGVcbiAgICAgICAgICAgICAgICBzZW5kKCdVbmFibGUgdG8gY29udmVydCB0aGlzIGRhdGEgZmlsZS4gRm9yIGEgbGlzdCBvZiBmb3JtYXRzIHN1cHBvcnRlZCBieSBUZXJyaWEsIHNlZSBodHRwOi8vd3d3LmdkYWwub3JnL29ncl9mb3JtYXRzLmh0bWwgLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcGF0aCkge1xuICAgICAgICAgICAgZnMudW5saW5rKGZwYXRoKTsgLy8gY2xlYW4gdXAgdGhlIHRlbXBvcmFyeSBmaWxlIG9uIGRpc2tcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDb250ZW50IChmcGF0aCwgZm5hbWUsIHJlcSwgcmVzKSB7XG4gICAgaWYgKCFmcGF0aCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ05vIGZpbGUgcHJvdmlkZWQgdG8gY29udmVydC4nKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ0NvbnZlcnQ6IHJlY2VpdmluZyBmaWxlIG5hbWVkICcsIGZuYW1lKTtcblxuICAgIHZhciBoaW50ID0gJyc7XG4gICAgLy9zaW1wbGUgaGludCBmb3Igbm93LCBtaWdodCBuZWVkIHRvIGNyYWNrIHppcCBmaWxlcyBnb2luZyBmb3J3YXJkXG4gICAgaWYgKGZuYW1lLm1hdGNoKC9cXC56aXAkLykpIHtcbiAgICAgICAgaGludCA9ICdzaHAnO1xuICAgIH1cbiAgICBpZiAoZnBhdGguaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgIHZhciBodHRwU3RyZWFtLCBhYm9ydCA9IGZhbHNlO1xuICAgICAgICAvLyBSZWFkIGZpbGUgY29udGVudCBieSBvcGVuaW5nIHRoZSBVUkwgZ2l2ZW4gdG8gdXNcbiAgICAgICAgaHR0cFN0cmVhbSA9IHJlcXVlc3QuZ2V0KHt1cmw6IGZwYXRofSk7XG4gICAgICAgIGh0dHBTdHJlYW0ub24oJ3Jlc3BvbnNlJywgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gdGhpcywgbGVuID0gMDtcbiAgICAgICAgICAgIGNvbnZlcnRTdHJlYW0ocmVzcG9uc2UsIHJlcSwgcmVzLCBoaW50KTtcbiAgICAgICAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICAgICAgICAgICAgbGVuICs9IGNodW5rLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoIWFib3J0ICYmIGxlbiA+IGNvbnZlcnQubWF4Q29udmVyc2lvblNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vQmlnRXJyb3IocmVxdWVzdCwgcmVzKTtcbiAgICAgICAgICAgICAgICAgICAgYWJvcnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBodHRwU3RyZWFtLmFib3J0KCk7IC8vIGF2b2lkIGZldGNoaW5nIHRoZSBlbnRpcmUgZmlsZSBvbmNlIHdlIGtub3cgaXQncyB0b28gYmlnLiBXZSdsbCBwcm9iYWJseSBnZXQgb25lIG9yIHR3byBjaHVua3MgdG9vIG1hbnkuXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3BvbnNlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29udmVydDogcmVjZWl2ZWQgZmlsZSBvZiAnICsgbGVuICsgJyBieXRlcycgKyAoYWJvcnQgPyAnICh3aGljaCB3ZVxcJ3JlIGRpc2NhcmRpbmcpLicgOiAnLicpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZWFkIGZpbGUgY29udGVudCBlbWJlZGRlZCBkaXJlY3RseSBpbiBQT1NUIGRhdGFcbiAgICAgICAgY29udmVydFN0cmVhbShmcy5jcmVhdGVSZWFkU3RyZWFtKGZwYXRoKSwgcmVxLCByZXMsIGhpbnQsIGZwYXRoKTtcbiAgICB9XG59XG5cbi8vIHByb3ZpZGUgY29udmVyc2lvbiB0byBnZW9qc29uIHNlcnZpY2Vcbi8vIHJlZ3VpcmVzIGluc3RhbGwgb2YgZ2RhbCBvbiBzZXJ2ZXI6XG4vLyAgIHN1ZG8gYXB0LWdldCBpbnN0YWxsIGdkYWwtYmluXG5jb252ZXJ0LnJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCkucG9zdCgnLycsICBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHBhcnNlRm9ybShyZXEsIHJlcywgaGFuZGxlQ29udGVudCk7XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgICBjb252ZXJ0Lm1heENvbnZlcnNpb25TaXplID0gb3B0aW9ucy5zZXR0aW5ncy5tYXhDb252ZXJzaW9uU2l6ZSB8fCAxMDAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gY29udmVydDtcbn07IiwiLyoganNoaW50IG5vZGU6IHRydWUsIGVzbmV4dDogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgcm91dGVyID0gcmVxdWlyZSgnZXhwcmVzcycpLlJvdXRlcigpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJyk7XG52YXIgdXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5zZXJ2ZXJzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgbWF4aW11bSBzaXplIG9mIHRoZSBKU09OIGRhdGEuXG4gICAgbGV0IHBvc3RTaXplTGltaXQgPSBvcHRpb25zLnBvc3RTaXplTGltaXQgfHwgJzEwMjQnO1xuXG4gICAgbGV0IHRva2VuU2VydmVycyA9IHBhcnNlVXJscyhvcHRpb25zLnNlcnZlcnMpO1xuICAgIHRva2VuU2VydmVycyA9IHZhbGlkYXRlU2VydmVyQ29uZmlnKHRva2VuU2VydmVycyk7XG5cbiAgICByb3V0ZXIudXNlKGJvZHlQYXJzZXIuanNvbih7bGltaXQ6cG9zdFNpemVMaW1pdCwgdHlwZTonYXBwbGljYXRpb24vanNvbid9KSk7XG4gICAgcm91dGVyLnBvc3QoJy8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBsZXQgcGFyYW1ldGVycyA9IHJlcS5ib2R5O1xuXG4gICAgICAgIGlmICghcGFyYW1ldGVycy51cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgnTm8gVVJMIHNwZWNpZmllZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0YXJnZXRVcmwgPSBwYXJzZVVybChwYXJhbWV0ZXJzLnVybCk7XG4gICAgICAgIGlmICghdGFyZ2V0VXJsIHx8ICh0YXJnZXRVcmwubGVuZ3RoID09PSAwKSB8fCAodHlwZW9mIHRhcmdldFVybCAhPT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ0ludmFsaWQgVVJMIHNwZWNpZmllZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0b2tlblNlcnZlciA9IHRva2VuU2VydmVyc1t0YXJnZXRVcmxdO1xuICAgICAgICBpZiAoIXRva2VuU2VydmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ1Vuc3VwcG9ydGVkIFVSTCBzcGVjaWZpZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0KHtcbiAgICAgICAgICAgIHVybDogdG9rZW5TZXJ2ZXIudG9rZW5VcmwsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnVXNlci1BZ2VudCc6ICdUZXJyaWFKU0VTUklUb2tlbkF1dGgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm06e1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB0b2tlblNlcnZlci51c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdG9rZW5TZXJ2ZXIucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgZjogJ0pTT04nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDIpLnNlbmQoJ1Rva2VuIHNlcnZlciBmYWlsZWQuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5zZW5kKCdFcnJvciBwcm9jZXNzaW5nIHNlcnZlciByZXNwb25zZS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xufTtcblxuZnVuY3Rpb24gcGFyc2VVcmxzKHNlcnZlcnMpIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhzZXJ2ZXJzKS5mb3JFYWNoKHNlcnZlciA9PiB7XG4gICAgICAgIGxldCBwYXJzZWRVcmwgPSBwYXJzZVVybChzZXJ2ZXIpXG4gICAgICAgIGlmIChwYXJzZWRVcmwpIHtcbiAgICAgICAgICAgIHJlc3VsdFtwYXJzZWRVcmxdID0gc2VydmVyc1tzZXJ2ZXJdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBjb25maWd1cmF0aW9uLiBUaGUgVVJMOiBcXCcnICsgc2VydmVyICsgJ1xcJyBpcyBub3QgdmFsaWQuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVXJsKHVybFN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB1cmwuZm9ybWF0KHVybC5wYXJzZSh1cmxTdHJpbmcpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlU2VydmVyQ29uZmlnKHNlcnZlcnMpXG57XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc2VydmVycykuZm9yRWFjaCh1cmwgPT4ge1xuICAgICAgICBsZXQgc2VydmVyID0gc2VydmVyc1t1cmxdO1xuICAgICAgICBpZiAoc2VydmVyLnVzZXJuYW1lICYmIHNlcnZlci5wYXNzd29yZCAmJiBzZXJ2ZXIudG9rZW5VcmwpIHtcbiAgICAgICAgICAgIHJlc3VsdFt1cmxdID0gc2VydmVyO1xuXG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBzaG91bGQgcmVhbGx5IG9ubHkgdmFsaWRhdGUgVVJMcyB0aGF0IGFyZSBIVFRQUyB0byBzYXZlIHVzIGZyb20gb3Vyc2VsdmVzLCBidXQgdGhlIGN1cnJlbnRcbiAgICAgICAgICAgIC8vIHNlcnZlcnMgd2UgbmVlZCB0byBzdXBwb3J0IGRvbid0IHN1cHBvcnQgSFRUUFMgOiggc28gdGhlIGJlc3QgdGhhdCB3ZSBjYW4gZG8gaXMgd2FybiBhZ2FpbnN0IGl0LlxuICAgICAgICAgICAgaWYgKCFpc0h0dHBzKHNlcnZlci50b2tlblVybCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBbGwgY29tbXVuaWNhdGlvbnMgc2hvdWxkIGJlIFRMUyBidXQgdGhlIFVSTCBcXCcnICsgc2VydmVyLnRva2VuVXJsICsgJ1xcJyBkb2VzIG5vdCB1c2UgaHR0cHMuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWQgQ29uZmlndXJhdGlvbi4gXFwnJyArIHVybCArICdcXCcgZG9lcyBub3Qgc3VwcGx5IGFsbCBvZiB0aGUgcmVxdWlyZWQgcHJvcGVydGllcy4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaXNIdHRwcyh1cmxTdHJpbmcpe1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAodXJsLnBhcnNlKHVybFN0cmluZykucHJvdG9jb2wgPT09ICdodHRwczonKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpXG4gICAge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpO1xudmFyIHJvdXRlciA9IHJlcXVpcmUoJ2V4cHJlc3MnKS5Sb3V0ZXIoKTtcbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuaXNzdWVzVXJsIHx8ICFvcHRpb25zLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFyc2VkQ3JlYXRlSXNzdWVVcmwgPSB1cmwucGFyc2Uob3B0aW9ucy5pc3N1ZXNVcmwsIHRydWUpO1xuICAgIHBhcnNlZENyZWF0ZUlzc3VlVXJsLnF1ZXJ5LmFjY2Vzc190b2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgdmFyIGNyZWF0ZUlzc3VlVXJsID0gdXJsLmZvcm1hdChwYXJzZWRDcmVhdGVJc3N1ZVVybCk7XG5cbiAgICByb3V0ZXIudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbiAgICByb3V0ZXIucG9zdCgnLycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHZhciBwYXJhbWV0ZXJzID0gcmVxLmJvZHk7XG5cbiAgICAgICAgcmVxdWVzdCh7XG4gICAgICAgICAgICB1cmw6IGNyZWF0ZUlzc3VlVXJsLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ1VzZXItQWdlbnQnOiBvcHRpb25zLnVzZXJBZ2VudCB8fCAnVGVycmlhQm90IChUZXJyaWFKUyBGZWVkYmFjayknLFxuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52Mytqc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogcGFyYW1ldGVycy50aXRsZSA/IHBhcmFtZXRlcnMudGl0bGUgOiAnVXNlciBGZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgYm9keTogZm9ybWF0Qm9keShyZXEsIHBhcmFtZXRlcnMsIG9wdGlvbnMuYWRkaXRpb25hbFBhcmFtZXRlcnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCBmdW5jdGlvbihlcnJvciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDIwMCB8fCByZXNwb25zZS5zdGF0dXNDb2RlID49IDMwMCkge1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMocmVzcG9uc2Uuc3RhdHVzQ29kZSkuc2VuZChKU09OLnN0cmluZ2lmeSh7cmVzdWx0OiAnRkFJTEVEJ30pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoSlNPTi5zdHJpbmdpZnkoe3Jlc3VsdDogJ1NVQ0NFU1MnfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbn07XG5cbmZ1bmN0aW9uIGZvcm1hdEJvZHkocmVxdWVzdCwgcGFyYW1ldGVycywgYWRkaXRpb25hbFBhcmFtZXRlcnMpIHtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgICByZXN1bHQgKz0gcGFyYW1ldGVycy5jb21tZW50ID8gcGFyYW1ldGVycy5jb21tZW50IDogJ05vIGNvbW1lbnQgcHJvdmlkZWQnO1xuICAgIHJlc3VsdCArPSAnXFxuIyMjIFVzZXIgZGV0YWlsc1xcbic7XG4gICAgcmVzdWx0ICs9ICcqIE5hbWU6ICcgICAgICAgICAgKyAocGFyYW1ldGVycy5uYW1lID8gcGFyYW1ldGVycy5uYW1lIDogJ05vdCBwcm92aWRlZCcpICsgJ1xcbic7XG4gICAgcmVzdWx0ICs9ICcqIEVtYWlsIEFkZHJlc3M6ICcgKyAocGFyYW1ldGVycy5lbWFpbCA/IHBhcmFtZXRlcnMuZW1haWwgOiAnTm90IHByb3ZpZGVkJykgKyAnXFxuJztcbiAgICByZXN1bHQgKz0gJyogSVAgQWRkcmVzczogJyAgICArIHJlcXVlc3QuaXAgKyAnXFxuJztcbiAgICByZXN1bHQgKz0gJyogVXNlciBBZ2VudDogJyAgICArIHJlcXVlc3QuaGVhZGVyKCdVc2VyLUFnZW50JykgKyAnXFxuJztcbiAgICByZXN1bHQgKz0gJyogUmVmZXJyZXI6ICcgICAgICArIHJlcXVlc3QuaGVhZGVyKCdSZWZlcnJlcicpICsgJ1xcbic7XG4gICAgcmVzdWx0ICs9ICcqIFNoYXJlIFVSTDogJyAgICAgKyAocGFyYW1ldGVycy5zaGFyZUxpbmsgPyBwYXJhbWV0ZXJzLnNoYXJlTGluayA6ICdOb3QgcHJvdmlkZWQnKSArICdcXG4nO1xuICAgIGlmIChhZGRpdGlvbmFsUGFyYW1ldGVycykge1xuICAgICAgICBhZGRpdGlvbmFsUGFyYW1ldGVycy5mb3JFYWNoKChwYXJhbWV0ZXIpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBgKiAke3BhcmFtZXRlci5kZXNjcmlwdGl2ZUxhYmVsfTogJHtwYXJhbWV0ZXJzW3BhcmFtZXRlci5uYW1lXSB8fCAnTm90IHByb3ZpZGVkJ31cXG5gO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcbnZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIHJvdXRlciA9IHJlcXVpcmUoJ2V4cHJlc3MnKS5Sb3V0ZXIoKTtcbnZhciBleGlzdHMgPSByZXF1aXJlKCcuLi9leGlzdHMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuLyoqXG4gKiBTcGVjaWFsIGhhbmRsaW5nIGZvciAvaW5pdC9mb28uanNvbiByZXF1ZXN0czogbG9vayBpbiBpbml0UGF0aHMsIG5vdCBqdXN0IHd3d3Jvb3QvaW5pdFxuICogQHBhcmFtICB7U3RyaW5nW119IGluaXRQYXRocyAgICAgIFBhdGhzIHRvIGxvb2sgaW4sIGNhbiBiZSByZWxhdGl2ZS5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBlcnJvcjQwNCAgICAgICBFcnJvciBwYWdlIGhhbmRsZXIuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNvbmZpZ0ZpbGVCYXNlICAgRGlyZWN0b3J5IHRvIHJlc29sdmUgcmVsYXRpdmUgcGF0aHMgZnJvbS5cbiAqIEByZXR1cm4ge1JvdXRlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbml0UGF0aHMsIGVycm9yNDA0LCBjb25maWdGaWxlQmFzZSkge1xuICAgIGluaXRQYXRocy5mb3JFYWNoKGZ1bmN0aW9uKGluaXRQYXRoKSB7XG4gICAgICAgIHJvdXRlci51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5yZXNvbHZlKGNvbmZpZ0ZpbGVCYXNlLCBpbml0UGF0aCkpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm91dGVyO1xufTsiLCIvKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbnZhciByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG52YXIgcHJvajQgPSByZXF1aXJlKCdwcm9qNCcpO1xuXG4vL1RPRE86IGNoZWNrIGlmIHRoaXMgbG9hZHMgdGhlIGZpbGUgaW50byBlYWNoIGNvcmUgYW5kIGlmIHNvIHRoZW4sXG5yZXF1aXJlKCdwcm9qNGpzLWRlZnMvZXBzZycpKHByb2o0KTtcblxuXG4vL3Byb3ZpZGUgUkVTVCBzZXJ2aWNlIGZvciBwcm9qNCBkZWZpbml0aW9uIHN0cmluZ3NcbnJvdXRlci5nZXQoJy86Y3JzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZXBzZyA9IHByb2o0LmRlZnNbcmVxLnBhcmFtcy5jcnMudG9VcHBlckNhc2UoKV07XG4gICAgaWYgKGVwc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcHNnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnTm8gcHJvajQgZGVmaW5pdGlvbiBhdmFpbGFibGUgZm9yIHRoaXMgQ1JTLicpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjsiLCIvKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBiYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJyk7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbnZhciBkZWZhdWx0UmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKTtcbnZhciByYW5nZUNoZWNrID0gcmVxdWlyZSgncmFuZ2VfY2hlY2snKTtcblxudmFyIERPX05PVF9QUk9YWV9SRUdFWCA9IC9eKD86SG9zdHxYLUZvcndhcmRlZC1Ib3N0fFByb3h5LUNvbm5lY3Rpb258Q29ubmVjdGlvbnxLZWVwLUFsaXZlfFRyYW5zZmVyLUVuY29kaW5nfFRFfFRyYWlsZXJ8UHJveHktQXV0aG9yaXphdGlvbnxQcm94eS1BdXRoZW50aWNhdGV8VXBncmFkZXxFeHBpcmVzfHByYWdtYXxTdHJpY3QtVHJhbnNwb3J0LVNlY3VyaXR5KSQvaTtcbnZhciBQUk9UT0NPTF9SRUdFWCA9IC9eXFx3KzpcXC8vO1xudmFyIERVUkFUSU9OX1JFR0VYID0gL14oW1xcZC5dKykobXN8c3xtfGh8ZHx3fHkpJC87XG52YXIgRFVSQVRJT05fVU5JVFMgPSB7XG4gICAgbXM6IDEuMCAvIDEwMDAsXG4gICAgczogMS4wLFxuICAgIG06IDYwLjAsXG4gICAgaDogNjAuMCAqIDYwLjAsXG4gICAgZDogMjQuMCAqIDYwLjAgKiA2MC4wLFxuICAgIHc6IDcuMCAqIDI0LjAgKiA2MC4wICogNjAuMCxcbiAgICB5OiAzNjUgKiAyNC4wICogNjAuMCAqIDYwLjBcbn07XG4vKiogQWdlIHRvIG92ZXJyaWRlIGNhY2hlIGluc3RydWN0aW9ucyB3aXRoIGZvciBwcm94aWVkIGZpbGVzICovXG52YXIgREVGQVVMVF9NQVhfQUdFX1NFQ09ORFMgPSAxMjA5NjAwOyAvLyB0d28gd2Vla3NcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGV4cHJlc3MgbWlkZGxld2FyZSB0aGF0IHByb3hpZXMgY2FsbHMgdG8gJy9wcm94eS9odHRwOi8vZXhhbXBsZScgdG8gJ2h0dHA6Ly9leGFtcGxlJywgd2hpbGUgZm9yY2luZyB0aGVtXG4gKiB0byBiZSBjYWNoZWQgYnkgdGhlIGJyb3dzZXIgYW5kIG92ZXJyd3JpdGluZyBDT1JTIGhlYWRlcnMuIEEgY2FjaGUgZHVyYXRpb24gY2FuIGJlIGFkZGVkIHdpdGggYSBVUkwgbGlrZVxuICogL3Byb3h5L181bS9odHRwOi8vZXhhbXBsZSB3aGljaCBjYXVzZXMgJ0NhY2hlLUNvbnRyb2w6IHB1YmxpYyxtYXgtYWdlPTMwMCcgdG8gYmUgYWRkZWQgdG8gdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXlbU3RyaW5nXX0gb3B0aW9ucy5wcm94eWFibGVEb21haW5zIEFuIGFycmF5IG9mIGRvbWFpbnMgdG8gYmUgcHJveGllZFxuICogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLnByb3h5QWxsRG9tYWlucyBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB3ZSBzaG91bGQgcHJveHkgQUxMIGRvbWFpbnMgLSBvdmVycmlkZXNcbiAqICAgICAgICAgICAgICAgICAgICAgIHRoZSBjb25maWd1cmF0aW9uIGluIG9wdGlvbnMucHJveHlEb21haW5zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wcm94eUF1dGggQSBtYXAgb2YgZG9tYWlucyB0byB0b2tlbnMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aG9zZSBkb21haW5zIHZpYSBiYXNpYyBhdXRoXG4gKiAgICAgICAgICAgICAgICAgICAgICB3aGVuIHByb3h5aW5nIHRocm91Z2ggdGhlbS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVwc3RyZWFtUHJveHkgVXJsIG9mIGEgc3RhbmRhcmQgdXBzdHJlYW0gcHJveHkgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmV0cmlldmUgZGF0YS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ5cGFzc1Vwc3RyZWFtUHJveHlIb3N0cyBBbiBvYmplY3Qgb2YgaG9zdHMgKGFzIHN0cmluZ3MpIHRvICd0cnVlJyB2YWx1ZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wcm94eVBvc3RTaXplTGltaXQgVGhlIG1heGltdW0gc2l6ZSBvZiBhIFBPU1QgcmVxdWVzdCB0aGF0IHRoZSBwcm94eSB3aWxsIGFsbG93IHRocm91Z2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbiBieXRlcyBpZiBubyB1bml0IGlzIHNwZWNpZmllZCwgb3Igc29tZSByZWFzb25hYmxlIHVuaXQgbGlrZSAna2InIGZvciBraWxvYnl0ZXMgb3IgJ21iJyBmb3IgbWVnYWJ5dGVzLlxuICpcbiAqIEByZXR1cm5zIHsqfSBBIG1pZGRsZXdhcmUgdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGV4cHJlc3MuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciByZXF1ZXN0ID0gb3B0aW9ucy5yZXF1ZXN0IHx8IGRlZmF1bHRSZXF1ZXN0OyAvL292ZXJyaWRhYmxlIGZvciB0ZXN0c1xuICAgIHZhciBwcm94eUFsbERvbWFpbnMgPSBvcHRpb25zLnByb3h5QWxsRG9tYWlucztcbiAgICB2YXIgcHJveHlEb21haW5zID0gb3B0aW9ucy5wcm94eWFibGVEb21haW5zIHx8IFtdO1xuICAgIHZhciBwcm94eUF1dGggPSBvcHRpb25zLnByb3h5QXV0aCB8fCB7fTtcbiAgICB2YXIgcHJveHlQb3N0U2l6ZUxpbWl0ID0gb3B0aW9ucy5wcm94eVBvc3RTaXplTGltaXQgfHwgJzEwMjQwMCc7XG4gICAgXG4gICAgLy8gSWYgeW91IGNoYW5nZSB0aGlzLCBhbHNvIGNoYW5nZSB0aGUgc2FtZSBsaXN0IGluIHNlcnZlcmNvbmZpZy5qc29uLmV4YW1wbGUuXG4gICAgLy8gVGhpcyBwYWdlIGlzIGhlbHBmdWw6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Jlc2VydmVkX0lQX2FkZHJlc3Nlc1xuICAgIHZhciBibGFja2xpc3RlZEFkZHJlc3NlcyA9IG9wdGlvbnMuYmxhY2tsaXN0ZWRBZGRyZXNzZXMgfHwgW1xuICAgICAgICAvLyBsb29wYmFjayBhZGRyZXNzZXNcbiAgICAgICAgJzEyNy4wLjAuMC84JyxcbiAgICAgICAgJzo6MS8xMjgnLFxuICAgICAgICAvLyBsaW5rIGxvY2FsIGFkZHJlc3Nlc1xuICAgICAgICAnMTY5LjI1NC4wLjAvMTYnLFxuICAgICAgICAnZmU4MDo6LzEwJyxcbiAgICAgICAgLy8gcHJpdmF0ZSBuZXR3b3JrIGFkZHJlc3Nlc1xuICAgICAgICAnMTAuMC4wLjAvOCcsXG4gICAgICAgICcxNzIuMTYuMC4wLzEyJyxcbiAgICAgICAgJzE5Mi4xNjguMC4wLzE2JyxcbiAgICAgICAgJ2ZjMDA6Oi83JyxcbiAgICAgICAgLy8gb3RoZXJcbiAgICAgICAgJzAuMC4wLjAvOCcsXG4gICAgICAgICcxMDAuNjQuMC4wLzEwJyxcbiAgICAgICAgJzE5Mi4wLjAuMC8yNCcsXG4gICAgICAgICcxOTIuMC4yLjAvMjQnLFxuICAgICAgICAnMTk4LjE4LjAuMC8xNScsXG4gICAgICAgICcxOTIuODguOTkuMC8yNCcsXG4gICAgICAgICcxOTguNTEuMTAwLjAvMjQnLFxuICAgICAgICAnMjAzLjAuMTEzLjAvMjQnLFxuICAgICAgICAnMjI0LjAuMC4wLzQnLFxuICAgICAgICAnMjQwLjAuMC4wLzQnLFxuICAgICAgICAnMjU1LjI1NS4yNTUuMjU1LzMyJyxcbiAgICAgICAgJzo6LzEyOCcsXG4gICAgICAgICcyMDAxOmRiODo6LzMyJyxcbiAgICAgICAgJ2ZmMDA6Oi84J1xuICAgIF07XG5cbiAgICAvL05vbiBDT1JTIGhvc3RzIGFuZCBkb21haW5zIHdlIHByb3h5IHRvXG4gICAgZnVuY3Rpb24gcHJveHlBbGxvd2VkSG9zdChob3N0KSB7XG4gICAgICAgIC8vIEV4Y2x1ZGUgaG9zdHMgdGhhdCBhcmUgcmVhbGx5IElQIGFkZHJlc3NlcyBhbmQgYXJlIGluIG91ciBibGFja2xpc3QuXG4gICAgICAgIGlmIChyYW5nZUNoZWNrLmluUmFuZ2UoaG9zdCwgYmxhY2tsaXN0ZWRBZGRyZXNzZXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJveHlBbGxEb21haW5zKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhvc3QgPSBob3N0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIC8vY2hlY2sgdGhhdCBob3N0IGlzIGZyb20gb25lIG9mIHRoZXNlIGRvbWFpbnNcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm94eURvbWFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChob3N0LmluZGV4T2YocHJveHlEb21haW5zW2ldLCBob3N0Lmxlbmd0aCAtIHByb3h5RG9tYWluc1tpXS5sZW5ndGgpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkb1Byb3h5KHJlcSwgcmVzLCBuZXh0LCByZXRyeVdpdGhvdXRBdXRoLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVtb3RlVXJsU3RyaW5nID0gcmVxLnVybC5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCFyZW1vdGVVcmxTdHJpbmcgfHwgcmVtb3RlVXJsU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCdObyB1cmwgc3BlY2lmaWVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG9lcyB0aGUgcHJveHkgVVJMIGluY2x1ZGUgYSBtYXggYWdlP1xuICAgICAgICB2YXIgbWF4QWdlU2Vjb25kcyA9IERFRkFVTFRfTUFYX0FHRV9TRUNPTkRTO1xuICAgICAgICBpZiAocmVtb3RlVXJsU3RyaW5nWzBdID09PSAnXycpIHtcbiAgICAgICAgICAgIHZhciBzbGFzaEluZGV4ID0gcmVtb3RlVXJsU3RyaW5nLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICAgIGlmIChzbGFzaEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgnTm8gdXJsIHNwZWNpZmllZC4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1heEFnZVN0cmluZyA9IHJlbW90ZVVybFN0cmluZy5zdWJzdHJpbmcoMSwgc2xhc2hJbmRleCk7XG4gICAgICAgICAgICByZW1vdGVVcmxTdHJpbmcgPSByZW1vdGVVcmxTdHJpbmcuc3Vic3RyaW5nKHNsYXNoSW5kZXggKyAxKTtcblxuICAgICAgICAgICAgaWYgKHJlbW90ZVVybFN0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ05vIHVybCBzcGVjaWZpZWQuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEludGVycHJldCB0aGUgbWF4IGFnZSBhcyBhIGR1cmF0aW9uIGluIFZhcm5pc2ggbm90YXRpb24uXG4gICAgICAgICAgICAvLyBodHRwczovL3d3dy52YXJuaXNoLWNhY2hlLm9yZy9kb2NzL3RydW5rL3JlZmVyZW5jZS92Y2wuaHRtbCNkdXJhdGlvbnNcbiAgICAgICAgICAgIHZhciBwYXJzZWRNYXhBZ2UgPSBEVVJBVElPTl9SRUdFWC5leGVjKG1heEFnZVN0cmluZyk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlZE1heEFnZSB8fCBwYXJzZWRNYXhBZ2UubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgnSW52YWxpZCBkdXJhdGlvbi4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdChwYXJzZWRNYXhBZ2VbMV0pO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgnSW52YWxpZCBkdXJhdGlvbi4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVuaXRDb252ZXJzaW9uID0gRFVSQVRJT05fVU5JVFNbcGFyc2VkTWF4QWdlWzJdXTtcbiAgICAgICAgICAgIGlmICghdW5pdENvbnZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ0ludmFsaWQgZHVyYXRpb24gdW5pdCAnICsgcGFyc2VkTWF4QWdlWzJdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF4QWdlU2Vjb25kcyA9IHZhbHVlICogdW5pdENvbnZlcnNpb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgaHR0cDovLyBpZiBubyBwcm90b2NvbCBpcyBzcGVjaWZpZWQuXG4gICAgICAgIHZhciBwcm90b2NvbE1hdGNoID0gUFJPVE9DT0xfUkVHRVguZXhlYyhyZW1vdGVVcmxTdHJpbmcpO1xuICAgICAgICBpZiAoIXByb3RvY29sTWF0Y2ggfHwgcHJvdG9jb2xNYXRjaC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZW1vdGVVcmxTdHJpbmcgPSAnaHR0cDovLycgKyByZW1vdGVVcmxTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlZFBhcnQgPSBwcm90b2NvbE1hdGNoWzBdO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcHJvdG9jb2wgcG9ydGlvbiBvZiB0aGUgVVJMIG9ubHkgaGFzIGEgc2luZ2xlIHNsYXNoIGFmdGVyIGl0LCB0aGUgZXh0cmEgc2xhc2ggd2FzIHByb2JhYmx5IHN0cmlwcGVkIG9mZiBieSBzb21lb25lXG4gICAgICAgICAgICAvLyBhbG9uZyB0aGUgd2F5IChOR0lOWCB3aWxsIGRvIHRoaXMpLiAgQWRkIGl0IGJhY2suXG4gICAgICAgICAgICBpZiAocmVtb3RlVXJsU3RyaW5nW21hdGNoZWRQYXJ0Lmxlbmd0aF0gIT09ICcvJykge1xuICAgICAgICAgICAgICAgIHJlbW90ZVVybFN0cmluZyA9IG1hdGNoZWRQYXJ0ICsgJy8nICsgcmVtb3RlVXJsU3RyaW5nLnN1YnN0cmluZyhtYXRjaGVkUGFydC5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlbW90ZVVybCA9IHVybC5wYXJzZShyZW1vdGVVcmxTdHJpbmcpO1xuXG4gICAgICAgIC8vIENvcHkgdGhlIHF1ZXJ5IHN0cmluZ1xuICAgICAgICByZW1vdGVVcmwuc2VhcmNoID0gdXJsLnBhcnNlKHJlcS51cmwpLnNlYXJjaDtcblxuICAgICAgICBpZiAoIXJlbW90ZVVybC5wcm90b2NvbCkge1xuICAgICAgICAgICAgcmVtb3RlVXJsLnByb3RvY29sID0gJ2h0dHA6JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm94eTtcbiAgICAgICAgaWYgKG9wdGlvbnMudXBzdHJlYW1Qcm94eSAmJiAhKChvcHRpb25zLmJ5cGFzc1Vwc3RyZWFtUHJveHlIb3N0cyB8fCB7fSlbcmVtb3RlVXJsLmhvc3RdKSkge1xuICAgICAgICAgICAgcHJveHkgPSBvcHRpb25zLnVwc3RyZWFtUHJveHk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcmUgd2UgYWxsb3dlZCB0byBwcm94eSBmb3IgdGhpcyBob3N0P1xuICAgICAgICBpZiAoIXByb3h5QWxsb3dlZEhvc3QocmVtb3RlVXJsLmhvc3QpKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgnSG9zdCBpcyBub3QgaW4gbGlzdCBvZiBhbGxvd2VkIGhvc3RzOiAnICsgcmVtb3RlVXJsLmhvc3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW5jb2RpbmcgOiBudWxsIG1lYW5zIFwiYm9keVwiIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgd2lsbCBiZSByYXcgYnl0ZXNcblxuICAgICAgICB2YXIgcHJveGllZFJlcXVlc3Q7XG4gICAgICAgIHJlcS5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChwcm94aWVkUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIHByb3hpZWRSZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBmaWx0ZXJlZFJlcUhlYWRlcnMgPSBmaWx0ZXJIZWFkZXJzKHJlcS5oZWFkZXJzKTtcbiAgICAgICAgaWYgKGZpbHRlcmVkUmVxSGVhZGVyc1sneC1mb3J3YXJkZWQtZm9yJ10pIHtcbiAgICAgICAgICAgIGZpbHRlcmVkUmVxSGVhZGVyc1sneC1mb3J3YXJkZWQtZm9yJ10gPSBmaWx0ZXJlZFJlcUhlYWRlcnNbJ3gtZm9yd2FyZGVkLWZvciddICsgJywgJyArIHJlcS5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFJlcUhlYWRlcnNbJ3gtZm9yd2FyZGVkLWZvciddID0gcmVxLmNvbm5lY3Rpb24ucmVtb3RlQWRkcmVzcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgQXV0aG9yaXphdGlvbiBoZWFkZXIgaWYgd2UgdXNlZCBpdCB0byBhdXRoZW50aWNhdGUgdGhlIHJlcXVlc3QgdG8gdGVycmlhanMtc2VydmVyLlxuICAgICAgICBpZiAob3B0aW9ucy5iYXNpY0F1dGhlbnRpY2F0aW9uICYmIG9wdGlvbnMuYmFzaWNBdXRoZW50aWNhdGlvbi51c2VybmFtZSAmJiBvcHRpb25zLmJhc2ljQXV0aGVudGljYXRpb24ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBmaWx0ZXJlZFJlcUhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmV0cnlXaXRob3V0QXV0aCkge1xuICAgICAgICAgICAgdmFyIGF1dGhSZXF1aXJlZCA9IHByb3h5QXV0aFtyZW1vdGVVcmwuaG9zdF07XG4gICAgICAgICAgICBpZiAoYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dGhSZXF1aXJlZC5hdXRob3JpemF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHAgYmFzaWMgYXV0aC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWx0ZXJlZFJlcUhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRSZXFIZWFkZXJzWydhdXRob3JpemF0aW9uJ10gPSBhdXRoUmVxdWlyZWQuYXV0aG9yaXphdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXV0aFJlcXVpcmVkLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBtZWNoYW5pc20gdG8gcGFzcyBhcmJpdHJhcnkgaGVhZGVycy5cbiAgICAgICAgICAgICAgICAgICAgYXV0aFJlcXVpcmVkLmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkUmVxSGVhZGVyc1toZWFkZXIubmFtZV0gPSBoZWFkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3hpZWRSZXF1ZXN0ID0gY2FsbGJhY2socmVtb3RlVXJsLCBmaWx0ZXJlZFJlcUhlYWRlcnMsIHByb3h5LCBtYXhBZ2VTZWNvbmRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZFJlcUhhbmRsZXIoaHR0cFZlcmIpIHtcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvUHJveHkocmVxLCByZXMsIG5leHQsIHJlcS5yZXRyeVdpdGhvdXRBdXRoLCBmdW5jdGlvbihyZW1vdGVVcmwsIGZpbHRlcmVkUmVxdWVzdEhlYWRlcnMsIHByb3h5LCBtYXhBZ2VTZWNvbmRzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3hpZWRSZXF1ZXN0ID0gcmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGh0dHBWZXJiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwuZm9ybWF0KHJlbW90ZVVybCksXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBmaWx0ZXJlZFJlcXVlc3RIZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2Rpbmc6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eTogcHJveHksXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiByZXEuYm9keSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGxvd1JlZGlyZWN0OiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHJlc3BvbnNlLmhlYWRlcnMubG9jYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uICYmIGxvY2F0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlZCA9IHVybC5wYXJzZShsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm94eUFsbG93ZWRIb3N0KHBhcnNlZC5ob3N0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVkaXJlY3QgaXMgb2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlZGlyZWN0IGlzIGZvcmJpZGRlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkub24oJ3NvY2tldCcsIGZ1bmN0aW9uKHNvY2tldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0Lm9uY2UoJ2xvb2t1cCcsIGZ1bmN0aW9uKGVyciwgYWRkcmVzcywgZmFtaWx5LCBob3N0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlQ2hlY2suaW5SYW5nZShhZGRyZXNzLCBibGFja2xpc3RlZEFkZHJlc3NlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ0lQIGFkZHJlc3MgaXMgbm90IGFsbG93ZWQ6ICcgKyBhZGRyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94aWVkUmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KS5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWRlYWxseSB3ZSB3b3VsZCByZXR1cm4gYW4gZXJyb3IgdG8gdGhlIGNsaWVudCwgYnV0IGlmIGhlYWRlcnMgaGF2ZSBhbHJlYWR5IGJlZW4gc2VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF0dGVtcHRpbmcgdG8gc2V0IGEgc3RhdHVzIGNvZGUgaGVyZSB3aWxsIGZhaWwuIFNvIGluIHRoYXQgY2FzZSwgd2UnbGwganVzdCBlbmQgdGhlIHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGxhY2sgb2YgYSBiZXR0ZXIgb3B0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoJ1Byb3h5IGVycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLm9uKCdyZXNwb25zZScsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcS5yZXRyeVdpdGhvdXRBdXRoICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDQwMyAmJiBwcm94eUF1dGhbcmVtb3RlVXJsLmhvc3RdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgYXV0b21hdGljYWxseSBhZGRlZCBhbiBhdXRoZW50aWNhdGlvbiBoZWFkZXIgdG8gdGhpcyByZXF1ZXN0IChlLmcuIGZyb20gcHJveHlhdXRoLmpzb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBnb3QgYmFjayBhIDQwMywgaW5kaWNhdGluZyBvdXIgY3JlZGVudGlhbHMgZGlkbid0IGF1dGhvcml6ZSBhY2Nlc3MgdG8gdGhpcyByZXNvdXJjZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcnkgYWdhaW4gd2l0aG91dCBjcmVkZW50aWFscyBpbiBvcmRlciB0byBnaXZlIHRoZSB1c2VyIHRoZSBvcHBvcnR1bml0eSB0byBzdXBwbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVpciBvd24uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLnJldHJ5V2l0aG91dEF1dGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVyKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyhyZXNwb25zZS5zdGF0dXNDb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5oZWFkZXIocHJvY2Vzc0hlYWRlcnMocmVzcG9uc2UuaGVhZGVycywgbWF4QWdlU2Vjb25kcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy53cml0ZShjaHVuayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCgnUHJveHkgZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJveGllZFJlcXVlc3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoYW5kbGVyO1xuICAgIH1cblxuICAgIHZhciByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIHJvdXRlci5nZXQoJy8qJywgYnVpbGRSZXFIYW5kbGVyKCdHRVQnKSk7XG4gICAgcm91dGVyLnBvc3QoJy8qJywgYm9keVBhcnNlci5yYXcoe3R5cGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTt9LCBsaW1pdDogcHJveHlQb3N0U2l6ZUxpbWl0fSksIGJ1aWxkUmVxSGFuZGxlcignUE9TVCcpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG59O1xuXG4vKipcbiAqIEZpbHRlcnMgaGVhZGVycyB0aGF0IGFyZSBub3QgbWF0Y2hlZCBieSB7QGxpbmsgRE9fTk9UX1BST1hZX1JFR0VYfSBvdXQgb2YgYW4gb2JqZWN0IGNvbnRhaW5pbmcgaGVhZGVycy4gVGhpcyBkb2VzIG5vdFxuICogbXV0YXRlIHRoZSBvcmlnaW5hbCBsaXN0LlxuICpcbiAqIEBwYXJhbSBoZWFkZXJzIFRoZSBoZWFkZXJzIHRvIGZpbHRlclxuICogQHJldHVybnMge09iamVjdH0gQSBuZXcgb2JqZWN0IHdpdGggdGhlIGZpbHRlcmVkIGhlYWRlcnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckhlYWRlcnMoaGVhZGVycykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAvLyBmaWx0ZXIgb3V0IGhlYWRlcnMgdGhhdCBhcmUgbGlzdGVkIGluIHRoZSByZWdleCBhYm92ZVxuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBpZiAoIURPX05PVF9QUk9YWV9SRUdFWC50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBoZWFkZXJzW25hbWVdO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZpbHRlcnMgb3V0IGhlYWRlcnMgdGhhdCBzaG91bGRuJ3QgYmUgcHJveGllZCwgb3ZlcnJpZGVzIGNhY2hpbmcgc28gZmlsZXMgYXJlIHJldGFpbmVkIGZvciB7QGxpbmsgREVGQVVMVF9NQVhfQUdFX1NFQ09ORFN9LFxuICogYW5kIHNldHMgQ09SUyBoZWFkZXJzIHRvIGFsbG93IGFsbCBvcmlnaW5zXG4gKlxuICogQHBhcmFtIGhlYWRlcnMgVGhlIG9yaWdpbmFsIG9iamVjdCBvZiBoZWFkZXJzLiBUaGlzIGlzIG5vdCBtdXRhdGVkLlxuICogQHBhcmFtIG1heEFnZVNlY29uZHMgdGhlIGFtb3VudCBvZiB0aW1lIGluIHNlY29uZHMgdG8gY2FjaGUgZm9yLiBUaGlzIHdpbGwgb3ZlcnJpZGUgd2hhdCB0aGUgb3JpZ2luYWwgc2VydmVyXG4gKiAgICAgICAgICBzcGVjaWZpZWQgYmVjYXVzZSB3ZSBrbm93IGJldHRlciB0aGFuIHRoZXkgZG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbmV3IGhlYWRlcnMgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBwcm9jZXNzSGVhZGVycyhoZWFkZXJzLCBtYXhBZ2VTZWNvbmRzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGZpbHRlckhlYWRlcnMoaGVhZGVycyk7XG5cbiAgICByZXN1bHRbJ0NhY2hlLUNvbnRyb2wnXSA9ICdwdWJsaWMsbWF4LWFnZT0nICsgbWF4QWdlU2Vjb25kcztcbiAgICByZXN1bHRbJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiddID0gJyonO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8qIGpzaGludCBub2RlOiB0cnVlICovXG4ndXNlIHN0cmljdCc7XG52YXIgcm91dGVyID0gcmVxdWlyZSgnZXhwcmVzcycpLlJvdXRlcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICByb3V0ZXIuZ2V0KCcvJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQob3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdXRlcjtcbn07IiwiLyoganNoaW50IG5vZGU6IHRydWUsIGVzbmV4dDogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcblxuLy8gRXhwb3NlIGEgd2hpdGVsaXN0ZWQgc2V0IG9mIGNvbmZpZ3VyYXRpb24gYXR0cmlidXRlcyB0byB0aGUgd29ybGQuIFRoaXMgZGVmaW5pdGVseSBkb2Vzbid0IGluY2x1ZGUgYXV0aG9yaXNhdGlvbiB0b2tlbnMsIGxvY2FsIGZpbGUgcGF0aHMsIGV0Yy5cbi8vIEl0IG1pcnJvcnMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVhbCBjb25maWcgZmlsZS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIHZhciBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMuc2V0dGluZ3MpLCBzYWZlU2V0dGluZ3MgPSB7fTtcbiAgICB2YXIgc2FmZUF0dHJpYnV0ZXMgPSBbJ2FsbG93UHJveHlGb3InLCAnbWF4Q29udmVyc2lvblNpemUnLCAnbmV3U2hhcmVVcmxQcmVmaXgnLCAncHJveHlBbGxEb21haW5zJ107XG4gICAgc2FmZUF0dHJpYnV0ZXMuZm9yRWFjaChrZXkgPT4gc2FmZVNldHRpbmdzW2tleV0gPSBzZXR0aW5nc1trZXldKTtcbiAgICBzYWZlU2V0dGluZ3MudmVyc2lvbiA9IHJlcXVpcmUoJy4uLy4uLy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG4gICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5zaGFyZVVybFByZWZpeGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBzYWZlU2V0dGluZ3Muc2hhcmVVcmxQcmVmaXhlcyA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncy5zaGFyZVVybFByZWZpeGVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgc2FmZVNldHRpbmdzLnNoYXJlVXJsUHJlZml4ZXNba2V5XSA9IHsgc2VydmljZTogc2V0dGluZ3Muc2hhcmVVcmxQcmVmaXhlc1trZXldLnNlcnZpY2UgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5mZWVkYmFjayAmJiBzZXR0aW5ncy5mZWVkYmFjay5hZGRpdGlvbmFsUGFyYW1ldGVycykge1xuICAgICAgICBzYWZlU2V0dGluZ3MuYWRkaXRpb25hbEZlZWRiYWNrUGFyYW1ldGVycyA9IHNldHRpbmdzLmZlZWRiYWNrLmFkZGl0aW9uYWxQYXJhbWV0ZXJzO1xuICAgIH1cblxuICAgIHJvdXRlci5nZXQoJy8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChzYWZlU2V0dGluZ3MpO1xuICAgIH0pO1xuICAgIHJldHVybiByb3V0ZXI7XG59O1xuIiwiLyoganNoaW50IG5vZGU6IHRydWUsIGVzbmV4dDogdHJ1ZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJyk7XG52YXIgcmVxdWVzdHAgPSByZXF1aXJlKCdyZXF1ZXN0LXByb21pc2UnKTtcbnZhciBycGVycm9ycyA9IHJlcXVpcmUoJ3JlcXVlc3QtcHJvbWlzZS9lcnJvcnMnKTtcblxudmFyIGdpc3RBUEkgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9naXN0cyc7XG52YXIgZ29vZ2xlVXJsU2hvcnRlbmVyQVBJID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3VybHNob3J0ZW5lci92MSc7XG5cbnZhciBwcmVmaXhTZXBhcmF0b3IgPSAnLSc7IC8vIGNoYW5nZSB0aGUgcmVnZXggYmVsb3cgaWYgeW91IGNoYW5nZSB0aGlzXG52YXIgc3BsaXRQcmVmaXhSZSA9IC9eKChbXi1dKyktKT8oLiopJC87XG5cbi8vWW91IGNhbiB0ZXN0IGxpa2UgdGhpcyB3aXRoIGh0dHBpZTpcbi8vZWNobyAneyBcInRlc3RcIjogXCJtZVwiIH0nIHwgaHR0cCBwb3N0IGxvY2FsaG9zdDozMDAxL2FwaS92MS9zaGFyZVxuZnVuY3Rpb24gbWFrZUdpc3Qoc2VydmljZU9wdGlvbnMsIGJvZHkpIHtcbiAgICB2YXIgZ2lzdEZpbGUgPSB7fTtcbiAgICBnaXN0RmlsZVtzZXJ2aWNlT3B0aW9ucy5naXN0RmlsZW5hbWUgfHwgJ3VzZXJjYXRhbG9nLmpzb24nXSA9IHsgY29udGVudDogYm9keSB9O1xuXG4gICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgICdVc2VyLUFnZW50Jzogc2VydmljZU9wdGlvbnMudXNlckFnZW50IHx8ICdUZXJyaWFKUy1TZXJ2ZXInLFxuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvbidcbiAgICB9O1xuICAgIGlmIChzZXJ2aWNlT3B0aW9ucy5hY2Nlc3NUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICd0b2tlbiAnICsgc2VydmljZU9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgfVxuICAgIHJldHVybiByZXF1ZXN0cCh7XG4gICAgICAgIHVybDogZ2lzdEFQSSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIGZpbGVzOiBnaXN0RmlsZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAoc2VydmljZU9wdGlvbnMuZ2lzdERlc2NyaXB0aW9uIHx8ICdVc2VyLWNyZWF0ZWQgY2F0YWxvZycpLFxuICAgICAgICAgICAgcHVibGljOiBmYWxzZVxuICAgICAgICB9LCB0cmFuc2Zvcm06IGZ1bmN0aW9uKGJvZHksIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAxKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0ZWQgSUQgJyArIHJlc3BvbnNlLmJvZHkuaWQgKyAnIHVzaW5nIEdpc3Qgc2VydmljZScpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5ib2R5LmlkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gVGVzdDogaHR0cCBsb2NhbGhvc3Q6MzAwMS9hcGkvdjEvc2hhcmUvZy05OGUwMTYyNWRiMDdhNzhkMjNiNDJjM2RiZTA4ZmUyMFxuZnVuY3Rpb24gcmVzb2x2ZUdpc3Qoc2VydmljZU9wdGlvbnMsIGlkKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgICdVc2VyLUFnZW50Jzogc2VydmljZU9wdGlvbnMudXNlckFnZW50IHx8ICdUZXJyaWFKUy1TZXJ2ZXInLFxuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvbidcbiAgICB9O1xuICAgIGlmIChzZXJ2aWNlT3B0aW9ucy5hY2Nlc3NUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICd0b2tlbiAnICsgc2VydmljZU9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgfVxuICAgIHJldHVybiByZXF1ZXN0cCh7XG4gICAgICAgIHVybDogZ2lzdEFQSSArICcvJyArIGlkLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKGJvZHksIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSAzMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBib2R5LmZpbGVzW09iamVjdC5rZXlzKGJvZHkuZmlsZXMpWzBdXS5jb250ZW50OyAvLyBmaW5kIHRoZSBjb250ZW50cyBvZiB0aGUgZmlyc3QgZmlsZSBpbiB0aGUgZ2lzdFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG4vKlxuICBHZW5lcmF0ZSBzaG9ydCBJRCBieSBoYXNoaW5nIGJvZHksIGNvbnZlcnRpbmcgdG8gYmFzZTYyIHRoZW4gdHJ1bmNhdGluZy5cbiAqL1xuZnVuY3Rpb24gc2hvcnRJZChib2R5LCBsZW5ndGgpIHtcbiAgICB2YXIgaG1hYyA9IHJlcXVpcmUoJ2NyeXB0bycpLmNyZWF0ZUhtYWMoJ3NoYTEnLCBib2R5KS5kaWdlc3QoKTtcbiAgICB2YXIgYmFzZTYyID0gcmVxdWlyZShcImJhc2UteFwiKSgnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonKTtcbiAgICB2YXIgZnVsbGtleSA9IGJhc2U2Mi5lbmNvZGUoaG1hYyk7XG4gICAgcmV0dXJuIGZ1bGxrZXkuc2xpY2UoMCwgbGVuZ3RoKTsgLy8gaWYgbGVuZ3RoIHVuZGVmaW5lZCwgcmV0dXJuIHRoZSB3aG9sZSB0aGluZ1xufVxuXG52YXIgX1MzO1xuXG5mdW5jdGlvbiBTMyhzZXJ2aWNlT3B0aW9ucykge1xuICAgIGlmIChfUzMpIHtcbiAgICAgICAgcmV0dXJuIF9TMztcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYXdzID0gcmVxdWlyZSgnYXdzLXNkaycpO1xuICAgICAgICBhd3MuY29uZmlnLnNldFByb21pc2VzRGVwZW5kZW5jeShyZXF1aXJlKCd3aGVuJykuUHJvbWlzZSk7XG4gICAgICAgIGF3cy5jb25maWcudXBkYXRlKHtcbiAgICAgICAgICAgIHJlZ2lvbjogc2VydmljZU9wdGlvbnMucmVnaW9uXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBpZiBubyBjcmVkZW50aWFscyBwcm92aWRlZCwgd2UgYXNzdW1lIHRoYXQgdGhleSdyZSBiZWluZyBwcm92aWRlZCBhcyBlbnZpcm9ubWVudCB2YXJpYWJsZXMgb3IgaW4gYSBmaWxlXG4gICAgICAgIGlmIChzZXJ2aWNlT3B0aW9ucy5hY2Nlc3NLZXlJZCkge1xuICAgICAgICAgICAgYXdzLmNvbmZpZy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGFjY2Vzc0tleUlkOiBzZXJ2aWNlT3B0aW9ucy5hY2Nlc3NLZXlJZCxcbiAgICAgICAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IHNlcnZpY2VPcHRpb25zLnNlY3JldEFjY2Vzc0tleVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgX1MzID0gbmV3IGF3cy5TMygpO1xuICAgICAgICByZXR1cm4gX1MzO1xuICAgIH1cbn1cblxuLy8gV2UgYXBwZW5kIHNvbWUgcHNldWRvLWRpciBwcmVmaXhlcyBpbnRvIHRoZSBhY3R1YWwgb2JqZWN0IElEIHRvIGF2b2lkIHRob3VzYW5kcyBvZiBvYmplY3RzIGluIGEgc2luZ2xlIHBzZXVkby1kaXJlY3RvcnkuXG4vLyBNeVJhTmRvTWtleSA9PiBNL3kvTXlSYU5kb01rZXlcbmNvbnN0IGlkVG9PYmplY3QgPSAoaWQpID0+IGlkLnJlcGxhY2UoL14oLikoLikvLCAnJDEvJDIvJDEkMicpO1xuXG5mdW5jdGlvbiBzYXZlUzMoc2VydmljZU9wdGlvbnMsIGJvZHkpIHtcbiAgICB2YXIgaWQgPSBzaG9ydElkKGJvZHksIHNlcnZpY2VPcHRpb25zLmtleUxlbmd0aCk7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBCdWNrZXQ6IHNlcnZpY2VPcHRpb25zLmJ1Y2tldCxcbiAgICAgICAgS2V5OiBpZFRvT2JqZWN0KGlkKSxcbiAgICAgICAgQm9keTogYm9keVxuICAgIH07XG5cbiAgICByZXR1cm4gUzMoc2VydmljZU9wdGlvbnMpLnB1dE9iamVjdChwYXJhbXMpLnByb21pc2UoKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlZCBrZXkgJyArIGlkICsgJyB0byBTMyBidWNrZXQgJyArIHBhcmFtcy5CdWNrZXQgKyAnOicgKyBwYXJhbXMuS2V5ICsgJy4gRXRhZzogJyArIHJlc3VsdC5FVGFnKTtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVMzKHNlcnZpY2VPcHRpb25zLCBpZCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgQnVja2V0OiBzZXJ2aWNlT3B0aW9ucy5idWNrZXQsXG4gICAgICAgIEtleTogaWRUb09iamVjdChpZClcbiAgICB9O1xuICAgIHJldHVybiBTMyhzZXJ2aWNlT3B0aW9ucykuZ2V0T2JqZWN0KHBhcmFtcykucHJvbWlzZSgpXG4gICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5Cb2R5O1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgcmVzcG9uc2U6IGUsXG4gICAgICAgICAgICBlcnJvcjogZS5tZXNzYWdlXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cblxuLy8gVGVzdDogaHR0cCBsb2NhbGhvc3Q6MzAwMS9hcGkvdjEvc2hhcmUvcTNueFBkXG5mdW5jdGlvbiByZXNvbHZlR29vZ2xlVXJsKHNlcnZpY2VPcHRpb25zLCBpZCkge1xuICAgIHZhciBzaG9ydFVybCA9ICdodHRwOi8vZ29vLmdsLycgKyBpZDtcbiAgICBjb25zb2xlLmxvZyhzaG9ydFVybCk7XG4gICAgcmV0dXJuIHJlcXVlc3RwKHtcbiAgICAgICAgdXJsOiBnb29nbGVVcmxTaG9ydGVuZXJBUEkgKyAnL3VybD9rZXk9JyArIHNlcnZpY2VPcHRpb25zLmFwaWtleSArICcmc2hvcnRVcmw9JyArIHNob3J0VXJsLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnVXNlci1BZ2VudCc6IHNlcnZpY2VPcHRpb25zLnVzZXJBZ2VudCB8fCAnVGVycmlhSlMtU2VydmVyJyxcbiAgICAgICAgfSxcbiAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbihib2R5LCByZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPj0gMzAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdXIgR29vZ2xlIFVSTHMgbG9vayBsaWtlIFwiaHR0cDovL25hdGlvbmFsbWFwLmdvdi5hdS8jc2hhcmU9JTdCLi4uJTdEXCIgYnV0IHRoZXJlIG1pZ2h0IGJlIG90aGVyIFVSTCBwYXJhbWV0ZXJzIGJlZm9yZSBvciBhZnRlclxuICAgICAgICAgICAgICAgIC8vIFdlIGp1c3Qgd2FudCB0aGUgZW5jb2RlZCBKU09OICglN0IuLiU3RCksIG5vdCB0aGUgd2hvbGUgVVJMLlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYm9keS5sb25nVXJsLm1hdGNoKC8oJTdCLiolN0QpKCYuKikkLylbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hhcmVVcmxQcmVmaXhlcywgbmV3U2hhcmVVcmxQcmVmaXgsIGhvc3ROYW1lLCBwb3J0KSB7XG4gICAgaWYgKCFzaGFyZVVybFByZWZpeGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcm91dGVyID0gcmVxdWlyZSgnZXhwcmVzcycpLlJvdXRlcigpO1xuICAgIHJvdXRlci51c2UoYm9keVBhcnNlci50ZXh0KHt0eXBlOiAnKi8qJ30pKTtcblxuICAgIC8vIFJlcXVlc3RlZCBjcmVhdGlvbiBvZiBhIG5ldyBzaG9ydCBVUkwuXG4gICAgcm91dGVyLnBvc3QoJy8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBpZiAobmV3U2hhcmVVcmxQcmVmaXggPT09IHVuZGVmaW5lZCB8fCAhc2hhcmVVcmxQcmVmaXhlc1tuZXdTaGFyZVVybFByZWZpeF0pIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiVGhpcyBzZXJ2ZXIgaGFzIG5vdCBiZWVuIGNvbmZpZ3VyZWQgdG8gZ2VuZXJhdGUgbmV3IHNoYXJlIFVSTHMuXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlcnZpY2VPcHRpb25zID0gc2hhcmVVcmxQcmVmaXhlc1tuZXdTaGFyZVVybFByZWZpeF07XG4gICAgICAgIHZhciBtaW50ZXIgPSB7XG4gICAgICAgICAgICAnZ2lzdCc6IG1ha2VHaXN0LFxuICAgICAgICAgICAgJ3MzJzogc2F2ZVMzXG4gICAgICAgICAgICB9W3NlcnZpY2VPcHRpb25zLnNlcnZpY2UudG9Mb3dlckNhc2UoKV07XG5cbiAgICAgICAgbWludGVyKHNlcnZpY2VPcHRpb25zLCByZXEuYm9keSkudGhlbihmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgaWQgPSBuZXdTaGFyZVVybFByZWZpeCArIHByZWZpeFNlcGFyYXRvciArIGlkO1xuICAgICAgICAgICAgdmFyIHJlc1BhdGggPSByZXEuYmFzZVVybCArICcvJyArIGlkO1xuICAgICAgICAgICAgLy8gdGhlc2UgcHJvcGVydGllcyB3b24ndCBiZWhhdmUgY29ycmVjdGx5IHVubGVzcyBcInRydXN0UHJveHk6IHRydWVcIiBpcyBzZXQgaW4gdXNlcidzIG9wdGlvbnMgZmlsZS5cbiAgICAgICAgICAgIC8vIHRoZXkgbWF5IG5vdCBiZWhhdmUgY29ycmVjdGx5IChlc3BlY2lhbGx5IHBvcnQpIHdoZW4gYmVoaW5kIG11bHRpcGxlIGxldmVscyBvZiBwcm94eVxuICAgICAgICAgICAgdmFyIHJlc1VybCA9XG4gICAgICAgICAgICAgICAgcmVxLnByb3RvY29sICsgJzovLycgK1xuICAgICAgICAgICAgICAgIHJlcS5ob3N0bmFtZSArXG4gICAgICAgICAgICAgICAgKHJlcS5oZWFkZXIoJ1gtRm9yd2FyZGVkLVBvcnQnKSB8fCBwb3J0KSArXG4gICAgICAgICAgICAgICAgcmVzUGF0aDtcbiAgICAgICAgICAgIHJlcyAubG9jYXRpb24ocmVzVXJsKVxuICAgICAgICAgICAgICAgIC5zdGF0dXMoMjAxKVxuICAgICAgICAgICAgICAgIC5qc29uKHsgaWQ6IGlkLCBwYXRoOiByZXNQYXRoLCB1cmw6IHJlc1VybCB9KTtcbiAgICAgICAgfSkuY2F0Y2gocnBlcnJvcnMuVHJhbnNmb3JtRXJyb3IsIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkocmVhc29uLCBudWxsLCAyKSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IHJlYXNvbi5jYXVzZS5tZXNzYWdlIH0pO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihKU09OLnN0cmluZ2lmeShyZWFzb24sIG51bGwsIDIpKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKSAvLyBwcm9iYWJseSBzYWZlc3QgaWYgd2UgYWx3YXlzIHJldHVybiBhIGNvbnNpc3RlbnQgZXJyb3IgY29kZVxuICAgICAgICAgICAgICAgIC5qc29uKHsgbWVzc2FnZTogcmVhc29uLmVycm9yIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFJlc29sdmUgYW4gZXhpc3RpbmcgSUQuIFdlIGJyZWFrIG9mZiB0aGUgcHJlZml4IGFuZCB1c2UgaXQgdG8gd29yayBvdXQgd2hpY2ggcmVzb2x2ZXIgdG8gdXNlLlxuICAgIHJvdXRlci5nZXQoJy86aWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICB2YXIgcHJlZml4ID0gcmVxLnBhcmFtcy5pZC5tYXRjaChzcGxpdFByZWZpeFJlKVsyXSB8fCAnJztcbiAgICAgICAgdmFyIGlkID0gcmVxLnBhcmFtcy5pZC5tYXRjaChzcGxpdFByZWZpeFJlKVszXTtcbiAgICAgICAgdmFyIHJlc29sdmVyO1xuXG4gICAgICAgIHZhciBzZXJ2aWNlT3B0aW9ucyA9IHNoYXJlVXJsUHJlZml4ZXNbcHJlZml4XTtcbiAgICAgICAgaWYgKCFzZXJ2aWNlT3B0aW9ucykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcmU6IFVua25vd24gcHJlZml4IHRvIHJlc29sdmUgXCInICsgcHJlZml4ICsgJ1wiLCBpZCBcIicgKyBpZCArICdcIicpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCdVbmtub3duIHNoYXJlIHByZWZpeCBcIicgKyBwcmVmaXggKyAnXCInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmVyID0ge1xuICAgICAgICAgICAgICAgICdnaXN0JzogcmVzb2x2ZUdpc3QsXG4gICAgICAgICAgICAgICAgJ2dvb2dsZXVybHNob3J0ZW5lcic6IHJlc29sdmVHb29nbGVVcmwsXG4gICAgICAgICAgICAgICAgJ3MzJzogcmVzb2x2ZVMzXG4gICAgICAgICAgICB9W3NlcnZpY2VPcHRpb25zLnNlcnZpY2UudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZXIoc2VydmljZU9wdGlvbnMsIGlkKS50aGVuKGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgICAgICAgICAgIHJlcy5zZW5kKGNvbnRlbnQpO1xuICAgICAgICB9KS5jYXRjaChycGVycm9ycy5UcmFuc2Zvcm1FcnJvciwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShyZWFzb24sIG51bGwsIDIpKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKHJlYXNvbi5jYXVzZS5tZXNzYWdlKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oSlNPTi5zdHJpbmdpZnkocmVhc29uLnJlc3BvbnNlLCBudWxsLCAyKSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwNCkgLy8gcHJvYmFibHkgc2FmZXN0IGlmIHdlIGFsd2F5cyByZXR1cm4gNDA0IHJhdGhlciB0aGFuIHdoYXRldmVyIHRoZSB1cHN0cmVhbSBwcm92aWRlciBzZXRzLlxuICAgICAgICAgICAgICAgIC5zZW5kKHJlYXNvbi5lcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByb3V0ZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBkYXRhYmFzZSB7XG5cblx0cHVibGljIHR5cGU6IHN0cmluZztcblx0cHVibGljIGhvc3Q6IHN0cmluZztcblx0cHJpdmF0ZSB1c2VybmFtZTogc3RyaW5nO1xuXHRwcml2YXRlIHBhc3N3b3JkOiBzdHJpbmc7XG5cdHB1YmxpYyBjb25uZWN0aW9uOiBhbnk7XG5cblx0Y29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBob3N0OiBzdHJpbmcsIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGNvbm5lY3Rpb246IGFueSkge1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy5ob3N0ID0gaG9zdDtcblx0XHR0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWU7XG5cdFx0dGhpcy5wYXNzd29yZCA9IHBhc3N3b3JkO1xuXHRcdHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG5cdH1cblxuXHRnZXRTdGF0dXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zdGF0ZTtcblx0fVxuXG59XG5cbmV4cG9ydCA9IGRhdGFiYXNlOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi8uLi8uLi9kYmNvbmZpZy5qc29uJyk7XG5cbnZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcblx0aG9zdDogY29uZmlnLmRhdGFiYXNlLmhvc3QsXG5cdHVzZXI6IGNvbmZpZy5kYXRhYmFzZS51c2VybmFtZSxcblx0cGFzc3dvcmQ6IGNvbmZpZy5kYXRhYmFzZS5wYXNzd29yZFxufSk7XG5cbmNvbi5jb25uZWN0KGZ1bmN0aW9uKGVycikge1xuXHRpZiAoZXJyKSB0aHJvdyBlcnI7XG5cdGNvbnNvbGUubG9nKFwiRGF0YWJhc2UgZXN0YWJsaXNoZWQuIFN0YXR1czogXCIgKyBjb24uc3RhdGUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29uOyIsIm1vZHVsZS5leHBvcnRzLmVycm9yNDA0ID0gZnVuY3Rpb24oc2hvdzQwNCwgd3d3cm9vdCwgc2VydmVXd3dSb290KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBpZiAoc2hvdzQwNCkge1xuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmRGaWxlKHd3d3Jvb3QgKyAnLzQwNC5odG1sJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VydmVXd3dSb290KSB7XG4gICAgICAgICAgICAvLyBSZWRpcmVjdCB1bmtub3duIHBhZ2VzIGJhY2sgaG9tZS5cbiAgICAgICAgICAgIHJlcy5yZWRpcmVjdCgzMDMsICcvJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnTm8gVGVycmlhSlMgd2Vic2l0ZSBoZXJlLicpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmVycm9yNTAwID0gZnVuY3Rpb24oc2hvdzUwMCwgd3d3cm9vdCkge1xuICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgcmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIGlmIChzaG93NTAwKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZEZpbGUod3d3cm9vdCArICcvNTAwLmh0bWwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKCc1MDA6IEludGVybmFsIFNlcnZlciBFcnJvcicpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5leHBvcnQgPSBmdW5jdGlvbiBleGlzdHMocGF0aE5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgICBmcy5zdGF0U3luYyhwYXRoTmFtZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07IiwiLyogVGVzdCBFeGFtcGxlIFBsdWdpbiBNb2R1bGUgKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBjbHVzdGVyID0gcmVxdWlyZSgnY2x1c3RlcicpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vZXhpc3RzJyk7XG52YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcblxudmFyIGZyYW1ld29yayA9IG5ldyBhcHAoKTtcbmZyYW1ld29yay5pbml0KCk7IC8vIFN0YXJ0IGFwcGxpY2F0aW9uLlxuXG4vLyBFeGFtcGxlIGZyYW1ld29yayBjYWxsc1xuXG4vLyB2YXIgdGVycmlhanMgPSByZXF1aXJlKCd0ZXJyaWFqcycpO1xuLy8gdmFyIGNhdGFsb2cgPSB0ZXJyaWFqcy5jYXRhbG9nO1xuXG4vLyBmcmFtZXdvcmsubG9hZE1vZHVsZShjYXRhbG9nKTsgXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBleGlzdHMgPSByZXF1aXJlKCcuL2V4aXN0cycpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBqc29uNSA9IHJlcXVpcmUoJ2pzb241Jyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuY2xhc3Mgc2VydmVyb3B0aW9ucyB7XG5cbiAgICBwdWJsaWMgbGlzdGVuSG9zdDogYW55O1xuICAgIHB1YmxpYyBjb25maWdGaWxlOiBhbnk7XG4gICAgcHVibGljIHNldHRpbmdzOiBhbnk7XG4gICAgcHVibGljIHByb3h5QXV0aEZpbGU6IGFueTtcbiAgICBwdWJsaWMgcHJveHlBdXRoOiBhbnk7XG4gICAgcHVibGljIHBvcnQ6IG51bWJlcjtcbiAgICBwdWJsaWMgd3d3cm9vdDogYW55O1xuICAgIHB1YmxpYyBjb25maWdEaXI6IGFueTtcbiAgICBwdWJsaWMgdmVyYm9zZTogYW55O1xuICAgIHB1YmxpYyBob3N0TmFtZTogYW55O1xuXG4gICAgZ2V0RmlsZVBhdGgoZmlsZU5hbWUsIHdhcm4pIHtcbiAgICAgICAgaWYgKGV4aXN0cyhmaWxlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlTmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh3YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBDYW5cXCd0IG9wZW4gJ1wiICsgZmlsZU5hbWUgKyBcIicuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q29uZmlnRmlsZShhcmdGaWxlTmFtZSwgZGVmYXVsdEZpbGVOYW1lKTogYW55IHtcbiAgICAgICAgcmV0dXJuIGFyZ0ZpbGVOYW1lID8gIHRoaXMuZ2V0RmlsZVBhdGgoYXJnRmlsZU5hbWUsIHRydWUpIDogdGhpcy5nZXRGaWxlUGF0aChkZWZhdWx0RmlsZU5hbWUsIHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBjb25maWcgZmlsZSB1c2luZyByZXF1aXJlLCBsb2dnaW5nIGEgd2FybmluZyBhbmQgZGVmYXVsdGluZyB0byBhIGJhY2t1cCB2YWx1ZSBpbiB0aGUgZXZlbnQgb2YgYSBmYWlsdXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZpbGVQYXRoIFRoZSBwYXRoIHRvIGxvb2sgZm9yIHRoZSBjb25maWcgZmlsZS5cbiAgICAgKiBAcGFyYW0gY29uZmlnRmlsZVR5cGUgV2hhdCBraW5kIG9mIGNvbmZpZyBmaWxlIGlzIHRoaXM/IEUuZy4gY29uZmlnLCBhdXRoIGV0Yy5cbiAgICAgKiBAcGFyYW0gZmFpbHVyZUNvbnNlcXVlbmNlIFRoZSBjb25zZXF1ZW5jZSBvZiB1c2luZyB0aGUgZGVmYXVsdFZhbHVlIHdoZW4gdGhpcyBmaWxlIGZhaWxzIHRvIGxvYWQgLSB0aGlzIHdpbGwgYmUgbG9nZ2VkXG4gICAgICogICAgICAgIGFzIHBhcnQgb2YgdGhlIHdhcm5pbmdcbiAgICAgKiBAcmV0dXJucyB7Kn0gVGhlIGNvbmZpZywgZWl0aGVyIGZyb20gdGhlIGZpbGVQYXRoIG9yIGEgZGVmYXVsdC5cbiAgICAgKi9cbiAgICBnZXRDb25maWcoZmlsZVBhdGgsIGNvbmZpZ0ZpbGVUeXBlLCBmYWlsdXJlQ29uc2VxdWVuY2UsIHF1aWV0KTogYW55IHtcbiAgICAgICAgdmFyIGNvbmZpZztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGZpbGVDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIC8vIFN0cmlwIGNvbW1lbnRzIGZvcm1hdHRlZCBhcyBsaW5lcyBzdGFydGluZyB3aXRoIGEgIywgYmVmb3JlIHBhcnNpbmcgYXMgSlNPTjUuICMtaW5pdGlhbCBjb21tZW50cyBhcmUgZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMy5cbiAgICAgICAgICAgIGNvbmZpZyA9IGpzb241LnBhcnNlKGZpbGVDb250ZW50cy5yZXBsYWNlKC9eXFxzKiMuKiQvbWcsJycpKTtcbiAgICAgICAgICAgIGlmICghcXVpZXQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXNpbmcgJyArIGNvbmZpZ0ZpbGVUeXBlICsgJyBmaWxlIFwiJyArIGZzLnJlYWxwYXRoU3luYyhmaWxlUGF0aCkgKyAnXCIuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICghcXVpZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9nZ2VkRmlsZVBhdGggPSBmaWxlUGF0aCA/ICcgXCInICsgZmlsZVBhdGggKyAnXCInIDogJyc7XG4gICAgICAgICAgICAgICAgaWYgKCEobG9nZ2VkRmlsZVBhdGggPT09ICcnICYmIGNvbmZpZ0ZpbGVUeXBlID09PSAncHJveHlBdXRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiBDYW5cXCd0IG9wZW4gJyArIGNvbmZpZ0ZpbGVUeXBlICsgJyBmaWxlJyArIGxvZ2dlZEZpbGVQYXRoICsgJy4gJyArIGZhaWx1cmVDb25zZXF1ZW5jZSArICcuXFxuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnID0ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29uZmlnOyAgICAgICAgXG4gICAgfVxuXG4gICAgbG9hZENvbW1hbmRMaW5lKCkge1xuICAgICAgICB2YXIgeWFyZ3MgPSByZXF1aXJlKCd5YXJncycpXG4gICAgICAgICAgICAudXNhZ2UoJyQwIFtvcHRpb25zXSBbcGF0aC90by93d3dyb290XScpXG4gICAgICAgICAgICAuc3RyaWN0KClcbiAgICAgICAgICAgIC5vcHRpb25zKHtcbiAgICAgICAgICAgICdwb3J0JyA6IHtcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nIDogJ1BvcnQgdG8gbGlzdGVuIG9uLiAgICAgICAgICAgICAgICBbZGVmYXVsdDogMzAwMV0nLFxuICAgICAgICAgICAgICAgIG51bWJlcjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncHVibGljJyA6IHtcbiAgICAgICAgICAgICAgICAndHlwZScgOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nIDogJ1J1biBhIHB1YmxpYyBzZXJ2ZXIgdGhhdCBsaXN0ZW5zIG9uIGFsbCBpbnRlcmZhY2VzLidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29uZmlnLWZpbGUnIDoge1xuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbicgOiAnRmlsZSBjb250YWluaW5nIHNldHRpbmdzIHN1Y2ggYXMgYWxsb3dlZCBkb21haW5zIHRvIHByb3h5LiBTZWUgc2VydmVyY29uZmlnLmpzb24uZXhhbXBsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncHJveHktYXV0aCcgOiB7XG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJyA6ICdGaWxlIGNvbnRhaW5pbmcgYXV0aCBpbmZvcm1hdGlvbiBmb3IgcHJveGllZCBkb21haW5zLiBTZWUgcHJveHlhdXRoLmpzb24uZXhhbXBsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndmVyYm9zZSc6IHtcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnUHJvZHVjZSBtb3JlIG91dHB1dCBhbmQgbG9nZ2luZy4nLFxuICAgICAgICAgICAgICAgICd0eXBlJzogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICdkZWZhdWx0JzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnaGVscCcgOiB7XG4gICAgICAgICAgICAgICAgJ2FsaWFzJyA6ICdoJyxcbiAgICAgICAgICAgICAgICAndHlwZScgOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJyA6ICdTaG93IHRoaXMgaGVscC4nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh5YXJncy5hcmd2LmhlbHApIHtcbiAgICAgICAgICAgIHlhcmdzLnNob3dIZWxwKCk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFlhcmdzIHVuaGVscGZ1bGx5IHR1cm5zIFwiLS1vcHRpb24gZm9vIC0tb3B0aW9uIGJhclwiIGludG8geyBvcHRpb246IFtcImZvb1wiLCBcImJhclwiXSB9LlxuICAgICAgICAvLyBIZW5jZSByZXBsYWNlIGFycmF5cyB3aXRoIHRoZSByaWdodG1vc3QgdmFsdWUuIFRoaXMgbWF0dGVycyB3aGVuIGBucG0gcnVuYCBoYXMgb3B0aW9uc1xuICAgICAgICAvLyBidWlsdCBpbnRvIGl0LCBhbmQgdGhlIHVzZXIgd2FudHMgdG8gb3ZlcnJpZGUgdGhlbSB3aXRoIGBucG0gcnVuIC0tIC0tcG9ydCAzMDA1YCBvciBzb21ldGhpbmcuXG4gICAgICAgIC8vIFlhcmdzIGFsc28gc2VlbXMgdG8gaGF2ZSBzZXR0ZXJzLCBoZW5jZSB3aHkgd2UgaGF2ZSB0byBtYWtlIGEgc2hhbGxvdyBjb3B5LlxuICAgICAgICB2YXIgYXJndiA9IE9iamVjdC5hc3NpZ24oe30sIHlhcmdzLmFyZ3YpO1xuICAgICAgICBPYmplY3Qua2V5cyhhcmd2KS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIGlmIChrICE9PSAnXycgJiYgQXJyYXkuaXNBcnJheShhcmd2W2tdKSkge1xuICAgICAgICAgICAgICAgIGFyZ3Zba10gPSBhcmd2W2tdW2FyZ3Zba10ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhcmd2O1xuICAgIH1cblxuICAgIGluaXQocXVpZXQ6IGJvb2xlYW4pIHtcblxuICAgICAgICB2YXIgYXJndiA9IHRoaXMubG9hZENvbW1hbmRMaW5lKCk7XG5cbiAgICAgICAgdGhpcy5saXN0ZW5Ib3N0ID0gYXJndi5wdWJsaWMgPyB1bmRlZmluZWQgOiAnbG9jYWxob3N0JztcbiAgICAgICAgdGhpcy5jb25maWdGaWxlID0gdGhpcy5nZXRDb25maWdGaWxlKGFyZ3YuY29uZmlnRmlsZSwgJ3NlcnZlcmNvbmZpZy5qc29uJyk7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLmdldENvbmZpZyh0aGlzLmNvbmZpZ0ZpbGUsICdjb25maWcnLCAnQUxMIHByb3h5IHJlcXVlc3RzIHdpbGwgYmUgYWNjZXB0ZWQuJywgcXVpZXQpO1xuICAgICAgICB0aGlzLnByb3h5QXV0aEZpbGUgPSB0aGlzLmdldENvbmZpZ0ZpbGUoYXJndi5wcm94eUF1dGgsICdwcm94eWF1dGguanNvbicpO1xuICAgICAgICB0aGlzLnByb3h5QXV0aCA9IHRoaXMuZ2V0Q29uZmlnKHRoaXMucHJveHlBdXRoRmlsZSwgJ3Byb3h5QXV0aCcsICdQcm94eWluZyB0byBzZXJ2ZXJzIHRoYXQgcmVxdWlyZSBhdXRoZW50aWNhdGlvbiB3aWxsIGZhaWwnLCBxdWlldCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXRoaXMucHJveHlBdXRoIHx8IE9iamVjdC5rZXlzKHRoaXMucHJveHlBdXRoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJveHlBdXRoID0gdGhpcy5zZXR0aW5ncy5wcm94eUF1dGggfHwge307XG4gICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgdGhpcy5wb3J0ID0gYXJndi5wb3J0IHx8IHRoaXMuc2V0dGluZ3MucG9ydCB8fCAzMDAxO1xuICAgICAgICB0aGlzLnd3d3Jvb3QgPSBhcmd2Ll8ubGVuZ3RoID4gMCA/IGFyZ3YuX1swXSA6IHByb2Nlc3MuY3dkKCkgKyAnL3d3d3Jvb3QnO1xuICAgICAgICB0aGlzLmNvbmZpZ0RpciA9IGFyZ3YuY29uZmlnRmlsZSA/IHBhdGguZGlybmFtZSAoYXJndi5jb25maWdGaWxlKSA6ICcuJztcbiAgICAgICAgdGhpcy52ZXJib3NlID0gYXJndi52ZXJib3NlO1xuICAgICAgICB0aGlzLmhvc3ROYW1lID0gdGhpcy5saXN0ZW5Ib3N0IHx8IHRoaXMuc2V0dGluZ3MuaG9zdE5hbWUgfHwgJ2xvY2FsaG9zdCc7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MucHJveHlBbGxEb21haW5zID0gdGhpcy5zZXR0aW5ncy5wcm94eUFsbERvbWFpbnMgfHwgdHlwZW9mIHRoaXMuc2V0dGluZ3MuYWxsb3dQcm94eUZvciA9PT0gJ3VuZGVmaW5lZCc7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0ID0gc2VydmVyb3B0aW9uczsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhd3Mtc2RrXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhc2UteFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYXNpYy1hdXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNsdXN0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tcHJlc3Npb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWJydXRlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZvcm1pZGFibGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbjVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9yZ2FuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm15c3FsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5ldFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInByb2o0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInByb2o0anMtZGVmcy9lcHNnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJhbmdlX2NoZWNrXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlcXVlc3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVxdWVzdC1wcm9taXNlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlcXVlc3QtcHJvbWlzZS9lcnJvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidGVycmlhanMtb2dyMm9nclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwid2hlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ5YXJnc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9