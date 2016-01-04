"use strict";
var express = require('express');
var router = express.Router();

var fs = require('fs');
var ogr2ogr = require('ogr2ogr');
var request = require('request');
var formidable = require('formidable');

// provide conversion to geojson service
// reguires install of gdal on server: sudo apt-get install gdal-bin
router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var fname, fpath, inputStream;
        var maxSize = 1000000;

        if (fields.input_url !== undefined) {
            if (fields.input_url.indexOf('http') === 0) {
                fpath = fields.input_url;
                fname = fpath;
            }
        } else if (files.input_file !== undefined) {
            if (files.input_file.size <= maxSize) {
                fpath = files.input_file.path;
                fname = files.input_file.name;
            } else {
                console.log('Input file is too large', files.input_file.size);
            }
        }
        if (fpath === undefined) {
            res.status(500).send('Unable to convert data');
            return;
        }
        console.log('Converting', fname);

        var hint = '';
        //simple hint for now, might need to crack zip files going forward
        if (fname.toLowerCase().indexOf('.zip') === fname.length-4) {
            hint = 'shp';
        }

        if (fpath.indexOf('http') === 0) {
             inputStream = request.get({url: fpath}).on('response', function(response) {
                var request = this, len = 0;
                response.on('data', function (chunk) {
                    len += chunk.length;
                    if (len > maxSize) {
                        request.abort();
                    }
                });
                response.on('end', function() {
                    console.log('Convert download size', len);
                });
            });
        } else {
            inputStream = fs.createReadStream(fpath);
        }

        var ogr = ogr2ogr(inputStream, hint)
                        .skipfailures()
                        .options(['-t_srs', 'EPSG:4326']);

        ogr.exec(function (er, data) {
            if (er) {
                console.error(er);
            }
            if (data !== undefined) {
                res.status(200).send(JSON.stringify(data));
            } else {
                res.status(500).send('Unable to convert data');
            }
        });
    });
});

module.exports = router;