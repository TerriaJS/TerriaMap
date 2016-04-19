'use strict';

/*global require*/
var webpack = require('webpack');
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');
var path = require('path');

module.exports = function(devMode) {
    var config = {
        entry: './index.js',
        output: {
            path: 'wwwroot/build',
            filename: 'nationalmap.js',
            publicPath: 'build/'
        },
        devtool: 'cheap-module-source-map',
        module: {
            loaders: [
                {
                    test: path.resolve(__dirname, '..', 'lib', 'Views'),
                    loader: require.resolve('raw-loader')
                },
                {
                    test: /\.jsx?$/,
                    include: [
                        path.resolve(__dirname, '..', 'index.js'),
                        path.resolve(__dirname, '..', 'UserInterface.jsx'),
                        path.resolve(__dirname, '..', 'lib')
                    ],
                    loader: require.resolve('babel-loader'),
                    query: {
                        sourceMap: false, // generated sourcemaps are currently bad, see https://phabricator.babeljs.io/T7257
                        presets: ['es2015', 'react'],
                        plugins: [
                            require.resolve('jsx-control-statements')
                        ]
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': devMode ? '"development"' : '"production"'
                }
            })
        ]
    };

    return configureWebpackForTerriaJS(path.dirname(require.resolve('terriajs/package.json')), config);
}