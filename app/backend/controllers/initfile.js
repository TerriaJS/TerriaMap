/* jshint node: true */
'use strict';
var express = require('express');
var router = require('express').Router();
var exists = require('../exists');
var path = require('path');
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