'use strict';

/*global require*/
var webpack = require("webpack");

module.exports = {
    entry: './index.js',
    output: {
        path: 'wwwroot/build',
        filename: 'nationalmap.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "transform?brfs"
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    plugins: [
    ]
};
