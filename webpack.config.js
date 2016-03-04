'use strict';

/*global require*/
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');

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
                test: require.resolve('./index.js'),
                loader: require.resolve('transform-loader/cacheable') + '?' + require.resolve('brfs')
            }
        ]
    }
};

configureWebpackForTerriaJS(require.resolve('terriajs/package.json'), config);

module.exports = config;