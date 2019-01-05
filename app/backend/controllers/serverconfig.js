/* jshint node: true, esnext: true */
"use strict";
var express = require('express');

// Expose a whitelisted set of configuration attributes to the world. This definitely doesn't include authorisation tokens, local file paths, etc.
// It mirrors the structure of the real config file.
module.exports = function(options) {
    var router = express.Router();
    var settings = Object.assign({}, options.settings), safeSettings = {};
    var safeAttributes = ['allowProxyFor', 'maxConversionSize', 'newShareUrlPrefix', 'proxyAllDomains'];
    safeAttributes.forEach(key => safeSettings[key] = settings[key]);
    safeSettings.version = require('../../../package.json').version;
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
