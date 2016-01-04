"use strict";
var express = require('express');
var router = express.Router();
var request = require('request');
var configSettings = require('../wwwroot/config.json');
var url = require('url');


var proxyAuth = require('../proxyAuth.json');

var protocolRegex = /^\w+:\//;

//var upstreamProxy;
//var bypassUpstreamProxyHosts;

var dontProxyHeaderRegex = /^(?:Host|X-Forwarded-Host|Proxy-Connection|Connection|Keep-Alive|Transfer-Encoding|TE|Trailer|Proxy-Authorization|Proxy-Authenticate|Upgrade)$/i;

function filterHeaders(req, headers) {
    var result = {};
    // filter out headers that are listed in the regex above
    Object.keys(headers).forEach(function(name) {
        if (!dontProxyHeaderRegex.test(name)) {
            result[name] = headers[name];
        }
    });

    return result;
}

function filterResponseHeaders(req, headers, maxAgeSeconds) {
    var result = filterHeaders(req, headers);

    result['Cache-Control'] = 'public,max-age=' + maxAgeSeconds;
    result['Access-Control-Allow-Origin'] ='*';
    delete result['Expires'];
    delete result['pragma'];

    return result;
}

var proxyDomains = configSettings.proxyDomains;


//Non CORS hosts and domains we proxy to
function proxyAllowedHost(host) {
    host = host.toLowerCase();
    //check that host is from one of these domains
    for (var i = 0; i < proxyDomains.length; i++) {
        if (host.indexOf(proxyDomains[i], host.length - proxyDomains[i].length) !== -1) {
            return true;
        }
    }
    return false;
}

var durationRegex = /^([\d.]+)(ms|s|m|h|d|w|y)$/;

var durationUnits = {
    ms: 1.0 / 1000,
    s: 1.0,
    m: 60.0,
    h: 60.0 * 60.0,
    d: 24.0 * 60.0 * 60.0,
    w: 7.0 * 24.0 * 60.0 * 60.0,
    y: 365.0 * 24.0 * 60.0 * 60.0
};

function doProxy(req, res, next, callback) {
    var maxAgeSeconds = 1209600; // two weeks
    var remoteUrlString = req.params[0];

    if (!remoteUrlString || remoteUrlString.length === 0) {
        return res.status(400).send('No url specified.');
    }

    // Does the proxy URL include a max age?
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
        var parsedMaxAge = durationRegex.exec(maxAgeString);
        if (!parsedMaxAge || parsedMaxAge.length < 3) {
            return res.status(400).send('Invalid duration.');
        }

        var value = parseFloat(parsedMaxAge[1]);
        if (value !== value) {
            return res.status(400).send('Invalid duration.');
        }

        var unitConversion = durationUnits[parsedMaxAge[2]];
        if (!unitConversion) {
            return res.status(400).send('Invalid duration unit ' + parsedMaxAge[2]);
        }

        maxAgeSeconds = value * unitConversion;
    }

    // Add http:// if no protocol is specified.
    var protocolMatch = protocolRegex.exec(remoteUrlString);
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
    if (router._proxyOptions.upstreamProxy && !(remoteUrl.host in router._proxyOptions.bypassUpstreamProxyHosts)) {
        proxy = router._proxyOptions.upstreamProxy;
    }

    // Are we allowed to proxy for this host?
    if (!proxyAllowedHost(remoteUrl.host)) {
        res.status(400).send('Host is not in list of allowed hosts: ' + remoteUrl.host);
        return;
    }

    // encoding : null means "body" passed to the callback will be raw bytes

    var proxiedRequest;
    req.on('close', function() {
        if (proxiedRequest) {
            proxiedRequest.abort();
        }
    });

    var filteredReqHeaders = filterHeaders(req, req.headers);
    if (!filteredReqHeaders['x-forwarded-for']) {
        filteredReqHeaders['x-forwarded-for'] = req.connection.remoteAddress;
    }

    // http basic auth
    var authRequired = proxyAuth[remoteUrl.host];
    if (authRequired) {
        filteredReqHeaders['authorization'] = authRequired.authorization;
    }

    proxiedRequest = callback(remoteUrl, filteredReqHeaders, proxy, maxAgeSeconds);
}

router.get('/*', function(req, res, next) {
    doProxy(req, res, next, function(remoteUrl, filteredRequestHeaders, proxy, maxAgeSeconds) {
        return request.get({
            url : url.format(remoteUrl),
            headers : filteredRequestHeaders,
            encoding : null,
            proxy : proxy
        }, function(error, response, body) {
            var code = 500;

            if (response) {
                code = response.statusCode;
                res.header(filterResponseHeaders(req, response.headers, maxAgeSeconds));
            }

            res.status(code).send(body);
        });
    });
});

router.post('/*', function(req, res, next) {
    doProxy(req, res, next, function(remoteUrl, filteredRequestHeaders, proxy, maxAgeSeconds) {
        req.pipe(request.post({
            url : url.format(remoteUrl),
            headers : filteredRequestHeaders,
            encoding : null,
            proxy : proxy
        }, function(error, response, body) {
            var code = 500;

            if (response) {
                code = response.statusCode;
                res.header(filterResponseHeaders(req, response.headers, maxAgeSeconds));
            }

            res.status(code).send(body);
        }));
    });
});
module.exports = router;