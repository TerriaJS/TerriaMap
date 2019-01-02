/* jshint node: true */
'use strict';
var router = require('express').Router();

module.exports = function(options) {
    router.get('/', function(req, res, next) {
        res.status(200).send(options);
    });
    return router;
};