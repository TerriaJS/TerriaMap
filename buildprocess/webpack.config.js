'use strict';

/*global require*/
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var generateRoutes = require("./generate-init-routes");
var PrerenderSPAPlugin = require("prerender-spa-plugin");
var Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
var path = require('path');

module.exports = function(devMode, hot) {
    var config = {
        mode: devMode ? 'development' : 'production',
        entry: './entry.js',
        output: {
            path: path.resolve(__dirname, '..', 'wwwroot', 'build'),
            filename: 'TerriaMap.js',
            // work around chrome needing the full URL when using sourcemaps (http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809)
            publicPath: hot ? 'http://localhost:3003/build/' : 'build/',
            sourcePrefix: '', // to avoid breaking multi-line string literals by inserting extra tabs.
            globalObject: '(self || window)' // to avoid breaking in web worker (https://github.com/webpack/webpack/issues/6642)
        },
        devtool: devMode ? 'cheap-inline-source-map' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.html$/,
                    include: path.resolve(__dirname, '..', 'lib', 'Views'),
                    loader: 'raw-loader'
                },
                {
                    test: /\.(js|jsx)$/,
                    include: [
                        path.resolve(__dirname, '..', 'index.js'),
                        path.resolve(__dirname, '..', 'entry.js'),
                        path.resolve(__dirname, '..', 'lib')
                        
                    ],
                    loader: 'babel-loader',
                    options: {
                        sourceMap: false, // generated sourcemaps are currently bad, see https://phabricator.babeljs.io/T7257
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            'babel-plugin-jsx-control-statements',
                            '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    include: path.resolve(__dirname, '..', 'wwwroot', 'images'),
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                },
                {
                    test: /globe\.gif$/,
                    include: path.resolve(__dirname, '..', 'lib', 'Styles'),
                    loader: 'url-loader',
                    options: {
                        limit: 65536
                    }
                },
                {
                    test: /loader\.css$/,
                    include: [path.resolve(__dirname, '..', 'lib', 'Styles')],
                    loader: ['style-loader', 'css-loader']
                },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, '..', 'lib')],
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
                    ] : [
                        MiniCssExtractPlugin.loader,
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
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({filename: "TerriaMap.css", disable: hot, ignoreOrder: true, allChunks: true}),
            new PrerenderSPAPlugin({
                staticDir: path.resolve(__dirname, '..', "wwwroot/"),
                indexPath: path.resolve(__dirname, '..', "wwwroot/", 'index_prerender.html'),
                // routes: [
                //     "/",
                //     "/catalog/",
                //   "/catalog/Root%20Group%2FExample%20Datasets%2FChart%20examples%2FStar%20Stations",
                //   "/catalog/Root%20Group%2FExample%20Datasets%2FChart%20examples%2FTime%20series",
                // ],
                // routes: generateRoutes(require('../wwwroot/config.json')),
                routes: generateRoutes(["terria"]),
                renderer: new Renderer({
                  // renderAfterDocumentEvent: 'some terria catalog loaded event', 
                  // renderAfterElementExists: 'some element? instead of event?',
                //   renderAfterTime: 5000,
                    maxConcurrentRoutes: 4,
                //   headless: false, // set to false for debugging
                }),
              }),
        ],
       resolve: {
            alias: {},
            modules: ['node_modules']
        }
    };
    config.resolve.alias['terriajs-variables'] = require.resolve('../lib/Styles/variables.scss');
    return configureWebpackForTerriaJS(path.dirname(require.resolve('terriajs/package.json')), config, devMode, hot, MiniCssExtractPlugin);
};
