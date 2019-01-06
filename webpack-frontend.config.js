'use strict';

var webpack = require('webpack');
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = function(devMode, hot) {
    var config = {
        target: 'web', // Set target runtime environment to web browser for client browser-sided processing.
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, './app', 'dist'),
            filename: 'bundle-frontend.js',
            publicPath: hot ? 'http://localhost:3003/dist/' : 'dist/', // work around for google chrome browser needing sourcemaps
            sourcePrefix: '' // to avoid breaking multi-line string literals by inserting extra tabs.
        },
        devtool: devMode ? 'cheap-inline-source-map' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.html$/,
                    include: path.resolve(__dirname, './app', 'lib', 'Views'),
                    loader: 'raw-loader'
                },
                {
                    test: /\.(js|jsx)$/,
                    include: [
                        path.resolve(__dirname, '..', 'index.js'),
                        path.resolve(__dirname, './app', 'lib')
                    ],
                    loader: 'babel-loader',
                    options: {
                        sourceMap: false, // generated sourcemaps are currently bad, see https://phabricator.babeljs.io/T7257
                        presets: ['env', 'react'],
                        plugins: [
                            'jsx-control-statements'
                        ]
                    }
                },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    include: path.resolve(__dirname, '..', 'app', 'images'),
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, './app', 'lib')],
                    loader: hot ? [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: true,
                                camelCase: true,
                                localIdentName: 'tm-[name]__[local]',
                                importLoaders: 2
                            }
                        },
                        'resolve-url-loader?sourceMap',
                        'sass-loader?sourceMap'
                    ] : ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    modules: true,
                                    camelCase: true,
                                    localIdentName: 'tm-[name]__[local]',
                                    importLoaders: 2
                                }
                            },
                            'resolve-url-loader?sourceMap',
                            'sass-loader?sourceMap'
                        ],
                        publicPath: ''
                    })
                }
            ]
        },
        plugins: [ 
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': devMode ? '"development"' : '"production"'
                }
            }),
            new ExtractTextPlugin({filename: "TerriaMap.css", disable: hot, ignoreOrder: true, allChunks: true})
        ],
        resolve: {
            alias: {},
            modules: ['node_modules']
        },
    };
    config.resolve.alias['terriajs-variables'] = require.resolve('./app/lib/Styles/variables.scss');
    return configureWebpackForTerriaJS(path.dirname(require.resolve('terriajs/package.json')), config, devMode, hot, ExtractTextPlugin);
};
