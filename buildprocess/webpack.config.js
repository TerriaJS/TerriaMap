'use strict';

/*global require*/
var webpack = require('webpack');
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = function(devMode, hot) {
    var config = {
        entry: './index.js',
        output: {
            path: 'wwwroot/build',
            filename: 'TerriaMap.js',
            // work around chrome needing the full URL when using sourcemaps (http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809)
            publicPath: hot ? 'http://localhost:3003/build/' : 'build/',
            sourcePrefix: '' // to avoid breaking multi-line string literals by inserting extra tabs.
        },
        devtool: devMode ? 'cheap-inline-source-map' : 'source-map',
        module: {
            loaders: [
                {
                    test: /\.html$/,
                    include: path.resolve(__dirname, '..', 'lib', 'Views'),
                    loader: require.resolve('raw-loader')
                },
                {
                    test: /\.(js|jsx)$/,
                    include: [
                        path.resolve(__dirname, '..', 'index.js'),
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
                },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    include: path.resolve(__dirname, '..', 'wwwroot', 'images'),
                    loader: require.resolve('url-loader'),
                    query: {
                        limit: 8192
                    }
                },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, '..', 'lib')],
                    loader: hot ?
                        require.resolve('style-loader') + '!' +
                        require.resolve('css-loader') + '?sourceMap&modules&camelCase&localIdentName=tm-[name]__[local]&importLoaders=2!' +
                        require.resolve('resolve-url-loader') + '?sourceMap!' +
                        require.resolve('sass-loader') + '?sourceMap'
                     : ExtractTextPlugin.extract(
                        require.resolve('css-loader') + '?sourceMap&modules&camelCase&localIdentName=tm-[name]__[local]&importLoaders=2!' +
                        require.resolve('resolve-url-loader') + '?sourceMap!' +
                        require.resolve('sass-loader') + '?sourceMap',
                        {
                            publicPath: ''
                        }
                    )
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': devMode ? '"development"' : '"production"'
                }
            }),
            new ExtractTextPlugin("TerriaMap.css", {disable: hot, ignoreOrder: true})
        ],
       resolve: {
            alias: {}
        }        
    };
    config.resolve.alias['terriajs-variables'] = require.resolve('../lib/Styles/variables.scss');
    return configureWebpackForTerriaJS(path.dirname(require.resolve('terriajs/package.json')), config, devMode, hot, ExtractTextPlugin);
};
