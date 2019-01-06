'use strict';

var express = require('express');
var compression = require('compression');
var path = require('path');
var cors = require('cors');
var cluster = require('cluster');
var exists = require('./exists');
var basicAuth = require('basic-auth');
var fs = require('fs');
var ExpressBrute = require('express-brute');

// This is a static class with static properties to configure the server. 
// Creates and returns a single express server.
// It does not need to be instantiated. 
class configureserver {

    public static app: any;
    public static options: any;

    static start(options): any {
        // eventually this mime type configuration will need to change
        // https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
        var mime = express.static.mime;
        mime.define({
            'this.application/json' : ['czml', 'json', 'geojson'],
            'text/plain' : ['glsl']
        });

        this.options = options;

        // initialise this.app with standard middlewares
        this.app = express();
        this.app.use(compression());
        this.app.use(cors());
        this.app.disable('etag');

        if (options.verbose) {
            this.app.use(require('morgan')('dev'));
        }

        if (typeof options.settings.trustProxy !== 'undefined') {
            this.app.set('trust proxy', options.settings.trustProxy);
        }

        if (options.verbose) {
            this.log('Listening on these this.endpoints:', true);
        }

        this.endpoint('/ping', function(req, res){
          res.status(200).send('OK');
        });

        // We do this after the /ping service above so that ping can be used unauthenticated and without TLS for health checks.

        if (options.settings.redirectToHttps) {
            var httpAllowedHosts = options.settings.httpAllowedHosts || ["localhost"];
            this.app.use(function(req, res, next) {
                if (httpAllowedHosts.indexOf(req.hostname) >= 0) {
                    return next();
                }

                if (req.protocol !== 'https') {
                    var url = 'https://' + req.hostname + req.url;
                    res.redirect(301, url);
                } else {
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
            this.app.use(bruteforce.prevent, function(req, res, next) {
                var user = basicAuth(req);
                if (user && user.name === auth.username && user.pass === auth.password) {
                    // Successful authentication, reset rate limiting.
                    req.brute.reset(next);
                } else {
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
        var bypassUpstreamProxyHostsMap = (options.settings.bypassUpstreamProxyHosts || []).reduce(function(map, host) {
                if (host !== '') {
                    map[host.toLowerCase()] = true;
                }
                return map;
            }, {});

        this.endpoint('/proxy', require('./controllers/proxy')({
            proxyableDomains: options.settings.allowProxyFor,
            proxyAllDomains: options.settings.proxyAllDomains,
            proxyAuth: options.proxyAuth,
            proxyPostSizeLimit: options.settings.proxyPostSizeLimit,
            upstreamProxy: options.settings.upstreamProxy,
            bypassUpstreamProxyHosts: bypassUpstreamProxyHostsMap,
            basicAuthentication: options.settings.basicAuthentication,
            blacklistedAddresses: options.settings.blacklistedAddresses
        }));

        var esriTokenAuth = require('./controllers/esri-token-auth')(options.settings.esriTokenAuth);
        if (esriTokenAuth) {
            this.endpoint('/esri-token-auth', esriTokenAuth);
        }

        this.endpoint('/proj4def', require('./controllers/proj4lookup'));            // Proj4def lookup service, to avoid downloading all definitions into the client.
        this.endpoint('/convert', require('./controllers/convert')(options).router); // OGR2OGR wrthis.apper to allow supporting file types like Shapefile.
        this.endpoint('/proxyabledomains', require('./controllers/proxydomains')({   // Returns JSON list of domains we're willing to proxy for
            proxyableDomains: options.settings.allowProxyFor,
            proxyAllDomains: !!options.settings.proxyAllDomains,
        }));
        this.endpoint('/serverconfig', require('./controllers/serverconfig')(options));

        var errorPage = require('./errorpage');
        var show404 = serveWwwRoot && exists(options.wwwroot + '/404.html');
        var error404 = errorPage.error404(show404, options.wwwroot, serveWwwRoot);
        var show500 = serveWwwRoot && exists(options.wwwroot + '/500.html');
        var error500 = errorPage.error500(show500, options.wwwroot);
        var initPaths = options.settings.initPaths || [];

        if (serveWwwRoot) {
            initPaths.push(path.join(options.wwwroot, 'init'));
        }

        this.app.use('/init', require('./controllers/initfile')(initPaths, error404, options.configDir));

        var feedbackService = require('./controllers/feedback')(options.settings.feedback);
        if (feedbackService) {
            this.endpoint('/feedback', feedbackService);
        }
        
        var shareService = require('./controllers/share')(options.settings.shareUrlPrefixes, options.settings.newShareUrlPrefix, options.hostName, options.port);
        if (shareService) {
            this.endpoint('/share', shareService);
        }

        this.app.use(error404);
        this.app.use(error500);
        var server = this.app;
        var osh = options.settings.https;
        if (osh && osh.key && osh.cert) {
            console.log('Launching in HTTPS mode.');
            var https = require('https');
            server = https.createServer({
                key: fs.readFileSync(osh.key),
                cert: fs.readFileSync(osh.cert)
            }, this.app);
        }

        process.on('uncaughtException', function(err) {
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

    static endpoint(path,router) {

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

export = configureserver;