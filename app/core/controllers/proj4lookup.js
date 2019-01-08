/* jshint node: true */
"use strict";
var express = require('express');
var router = express.Router();

var proj4 = require('proj4');

//TODO: check if this loads the file into each core and if so then,
require('proj4js-defs/epsg')(proj4);


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