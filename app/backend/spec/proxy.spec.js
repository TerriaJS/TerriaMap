"use strict";

var express = require('express');
var proxy = require('../lib/controllers/proxy');
var request = require('supertest');
var Stream = require('stream').Writable;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('proxy', function() {
    var fakeRequest;

    var openProxyOptions = {
        proxyAllDomains: true
    };

    beforeEach(function() {
        fakeRequest = jasmine.createSpy('request').and.callFake(requestFake);
    });

    describe('on get,', function() {
        doCommonTests('GET');
    });

    describe('on post,', function() {
        doCommonTests('POST');

        it('should pass the body through', function(done) {
            request(buildApp(openProxyOptions))
                .post('/example.com')
                .send('boaty mcboatface')
                .expect(200)
                .expect(function() {
                    expect(fakeRequest.calls.argsFor(0)[0].body).toEqual(new Buffer('boaty mcboatface'));
                })
                .end(assert(done));
        });
    });

    function doCommonTests(verb) {
        const methodName = verb.toLowerCase();

        it('should proxy through to the path that is given', function(done) {
            request(buildApp(openProxyOptions))[methodName]('/https://example.com/blah?query=value&otherQuery=otherValue')
                .expect(200)
                .expect(function() {
                    expect(fakeRequest.calls.argsFor(0)[0].url).toBe('https://example.com/blah?query=value&otherQuery=otherValue');
                    expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                })
                .end(assert(done));
        });

        it('should add http if it isn\'t provided', function(done) {
            request(buildApp(openProxyOptions))
                [methodName]('/example.com/')
                .expect(200)
                .expect(function(err) {
                    expect(fakeRequest.calls.argsFor(0)[0].url).toBe('http://example.com/');
                    expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                })
                .end(assert(done));
        });

        it('should add a trailing slash if it isn\'t provided', function(done) {
            request(buildApp(openProxyOptions))
                [methodName]('/example.com')
                .expect(200)
                .expect(function() {
                    expect(fakeRequest.calls.argsFor(0)[0].url).toBe('http://example.com/');
                    expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                })
                .end(assert(done));
        });

        it('should return 400 if no url is specified', function(done) {
            request(buildApp(openProxyOptions))
                [methodName]('/')
                .expect(400)
                .end(assert(done))
        });

        it('should stream back the body of the request made', function(done) {
            request(buildApp(openProxyOptions))
                [methodName]('/example.com')
                .expect(200, 'blahblah2')
                .end(assert(done));
        });

        it('should pass back headers from the proxied request', function(done) {
            request(buildApp(openProxyOptions))
                [methodName]('/example.com')
                .expect(200)
                .expect('fakeheader', 'fakevalue')
                .end(assert(done));
        });

        describe('should change headers', function() {
            it('to overwrite cache-control header to two weeks if no max age is specified in req', function(done) {
                request(buildApp(openProxyOptions))
                    [methodName]('/example.com')
                    .expect(200)
                    .expect('Cache-Control', 'public,max-age=1209600')
                    .end(assert(done));
            });

            it('to filter out disallowed ones passed in req', function(done) {
                request(buildApp(openProxyOptions))
                    [methodName]('/example.com')
                    .set('Proxy-Connection', 'delete me!')
                    .set('unfilteredheader', 'don\'t delete me!')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].headers['Proxy-Connection']).toBeUndefined();
                        expect(fakeRequest.calls.argsFor(0)[0].headers['unfilteredheader']).toBe('don\'t delete me!');
                    })
                    .end(assert(done));
            });

            it('to filter out disallowed ones that come back from the response', function(done) {
                request(buildApp(openProxyOptions))
                    [methodName]('/example.com')
                    .expect(200)
                    .expect(function(res) {
                        expect(res.headers['Proxy-Connection']).toBeUndefined();
                    })
                    .end(assert(done));
            });
        });

        describe('when specifying max age', function() {
            describe('should return 400 for', function() {
                it('a max-age specifying url with no actual url specified', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_3000ms')
                        .expect(400)
                        .end(assert(done));
                });

                it('a max-age specifying url with just \'/\' as a url', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_3000ms/')
                        .expect(400)
                        .end(assert(done));
                });

                it('a max-age specifying url with an invalid max-age value', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_FUBAR/example.com')
                        .expect(400)
                        .end(assert(done));
                });

                it('a max-age specifying url with an invalid unit for a max-age value', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_3000q/example.com')
                        .expect(400)
                        .end(assert(done));
                });
            });

            describe('should correctly interpret', function() {
                it('ms (millisecond)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_3000ms/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=3')
                        .end(assert(done));
                });

                it('s (second)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_3s/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=3')
                        .end(assert(done));
                });

                it('m (minute)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_2m/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=120')
                        .end(assert(done));
                });

                it('h (hour)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_2h/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=7200')
                        .end(assert(done));
                });

                it('d (day)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_2d/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=172800')
                        .end(assert(done));
                });

                it('w (week)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_2w/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=1209600')
                        .end(assert(done));
                });

                it('y (year)', function(done) {
                    request(buildApp(openProxyOptions))
                        [methodName]('/_2y/example.com')
                        .set('Cache-Control', 'no-cache')
                        .expect(200)
                        .expect('Cache-Control', 'public,max-age=63072000')
                        .end(assert(done));
                });
            });
        });

        describe('upstream proxy', function() {
            it('is used when one is specified', function(done) {
                request(buildApp({upstreamProxy: 'http://proxy/', proxyAllDomains: true}))
                    [methodName]('/https://example.com/blah')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].proxy).toBe('http://proxy/');
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });

            it('is not used when none is specified', function(done) {
                request(buildApp(openProxyOptions))
                    [methodName]('/https://example.com/blah')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].proxy).toBeUndefined();
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });

            it('is not used when host is in bypassUpstreamProxyHosts', function(done) {
                request(buildApp({
                    proxyAllDomains: true,
                    upstreamProxy: 'http://proxy/',
                    bypassUpstreamProxyHosts: {'example.com': true}
                }))[methodName]('/https://example.com/blah')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].proxy).toBeUndefined();
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });

            it('is still used when bypassUpstreamProxyHosts is defined but host is not in it', function(done) {
                request(buildApp({
                    proxyAllDomains: true,
                    upstreamProxy: 'http://proxy/',
                    bypassUpstreamProxyHosts: {'example2.com': true}
                }))[methodName]('/https://example.com/blah')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].proxy).toBe('http://proxy/');
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });
        });

        describe('when specifying an allowed list of domains to proxy', function() {
            it('should proxy a domain on that list', function(done) {
                request(buildApp({
                    proxyableDomains: ['example.com']
                }))[methodName]('/example.com/blah')
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].url).toBe('http://example.com/blah');
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .expect(200)
                    .end(assert(done));
            });

            it('should block a domain not on that list', function(done) {
                request(buildApp({
                    proxyableDomains: ['example.com']
                }))[methodName]('/example2.com/blah')
                    .expect(403)
                    .end(assert(done))
            });

            it('should not block a domain on the list if proxyAllDomains is true', function(done) {
                request(buildApp({
                    proxyableDomains: ['example.com'],
                    proxyAllDomains: true
                }))[methodName]('/example2.com/blah')
                    .expect(200)
                    .end(assert(done))
            });
        });

        describe('when domain has basic authentication specified', function() {
            it('should set an auth header for that domain', function(done) {
                request(buildApp({
                    proxyAllDomains: true,
                    proxyAuth: {
                        'example.com': {
                            authorization: 'blahfaceauth'
                        }
                    }
                }))[methodName]('/example.com/auth')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].headers.authorization).toBe('blahfaceauth');
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });

            it('should not set auth headers for other domains', function(done) {
                request(buildApp({
                    proxyAllDomains: true,
                    proxyAuth: {
                        'example2.com': {
                            authorization: 'blahfaceauth'
                        }
                    }
                }))[methodName]('/example.com/auth')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].headers.authorization).toBeUndefined();
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });
        });

        describe('when domain has other headers specified', function() {
            it('should set the header for that domain', function(done) {
                request(buildApp({
                    proxyAllDomains: true,
                    proxyAuth: {
                        'example.com': {
                            "headers": [{
                                 name: "Secret-Key",
                                 value: "ABCDE12345"
                             }, {
                                 name: "Another-Header",
                                 value: "XYZ"
                             }]
                        }
                    }
                }))[methodName]('/example.com/auth')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].headers['Secret-Key']).toBe('ABCDE12345');
                        expect(fakeRequest.calls.argsFor(0)[0].headers['Another-Header']).toBe('XYZ');
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });

            it('should not set the headers for other domains', function(done) {
                request(buildApp({
                    proxyAllDomains: true,
                    proxyAuth: {
                        'example2.com': {
                            "headers": [{
                                 name: "Secret-Key",
                                 value: "ABCDE12345"
                             }, {
                                 name: "Another-Header",
                                 value: "XYZ"
                             }]
                        }
                    }
                }))[methodName]('/example.com/auth')
                    .expect(200)
                    .expect(function() {
                        expect(fakeRequest.calls.argsFor(0)[0].headers['Secret-Key']).toBeUndefined();
                        expect(fakeRequest.calls.argsFor(0)[0].headers['Another-Header']).toBeUndefined();
                        expect(fakeRequest.calls.argsFor(0)[0].method).toBe(verb);
                    })
                    .end(assert(done));
            });
        });
    }

    function buildApp(options) {
        options.request = fakeRequest;
        var app = express();
        app.use(proxy(options));
        app.use(function(err, req, res, next) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
        return app;
    }

    function requestFake() {
        var request = {
            on: function(event, cb) {
                if (event === 'response') {
                    var dataCb, endCb;

                    var response = {
                        statusCode: 200,
                        headers: {
                            'fakeheader': 'fakevalue',
                            'Cache-Control': 'no-cache',
                            'Proxy-Connection': 'delete me'
                        },
                        on: function(event, cb) {
                            if (event === 'data') {
                                dataCb = cb;
                            } else if (event === 'end') {
                                endCb = cb;

                                // Now we've got all our callbacks, do a fake response
                                setTimeout(function() {
                                    // Two chunks of body
                                    dataCb('blah');
                                    dataCb('blah2');

                                    endCb();
                                }, 100);
                            }

                            return response;
                        }
                    };

                    cb(response);
                }

                return request;
            }
        };

        return request;
    }

    function assert(done) {
        return function(err) {
            if (err) {
                fail(err);
            }
            done();
        };
    }
});
