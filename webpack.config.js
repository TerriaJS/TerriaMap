'use strict';

/*global require*/
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');
var path = require('path');

var config = {
    entry: './index.js',
    output: {
        path: 'wwwroot/build',
        filename: 'nationalmap.js',
        publicPath: 'build/'
    },
    module: {
        loaders: [
            {
                test: path.resolve(__dirname, 'lib', 'Views'),
                loader: require.resolve('raw-loader')
            }
        ]
    }
};

configureWebpackForTerriaJS(require.resolve('terriajs/package.json'), config);

module.exports = config;