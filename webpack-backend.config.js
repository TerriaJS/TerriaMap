'use strict';

var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

// This configurations are set for development environment by default. To view and set the production environment values - see the module.exports.
// Set target runtime environment to nodejs for host backend-server processing. Native modules such as Mysql can only run in a nodejs server environment.
// We can extend the terriajs-server and change the webpack configuration but since we are going to deal with the server a lot more and the client side altogether.
// I decided I'm having the backend-server files and client-side files separately together to build a wholistic javascript geospatial framework. 
// Should help lessen bugs and issues that comes with webpack dealing with nodejs native modules.
// I'll probably integrate the terriajs-server somehow later on just so I can use the codebase that's already been implemented.              
var config = { 
        mode: 'development',
        devtool: "inline-source-map",
        target: "node", 
        externals: [nodeExternals()], // We exclude the nodejs modules from bundling
        entry: {
                app: ["./app/index.js"]
        },
        output: {
                path: path.resolve(__dirname, './app', 'dist'),
                filename: "bundle-backend.js",
                sourcePrefix: ''
        },
        resolve: {
                extensions: [".ts", ".tsx", ".js", ".jsx", "*"] // Add '.ts' and '.tsx' as a resolvable extension.
        },
        module: {
                rules: [ 
                        {        
                                test: /\.tsx?$/, // All files with a '.ts' or '.tsx extension' will be handled by ts-loader.
                                loader: "ts-loader" 
                        },
                        {
                                test: /\.(png|jpg|svg|gif)$/,
                                include: path.resolve(__dirname, '..', 'app', 'images'),
                                loader: 'url-loader',
                                query: {
                                        limit: 8192
                                }
                        },
                        {
                                test: /\.scss$/,
                                include: [path.resolve(__dirname, './app', 'lib',)],
                                use: [  
                                        { 
                                                loader: "style-loader",
                                        },      
                                                {
                                                loader: "typings-for-css-modules-loader",
                                                options: {
                                                        namedexport: true,
                                                        camelcase: true,
                                                        modules: true
                                                }
                                        }, 
                                        {
                                                loader: "sass-loader",
                                                options: {
                                                        sourceMap: true,
                                                        implementation: require("node-sass")
                                                }
                                        }  
                                ]    
                        }
                ] 
        },
        plugins: [  // This is where we run webpack plugins for compilation
                new MiniCssExtractPlugin({
                        // Options similar to the same options in webpackOptions.output
                        // both options are optional
                        filename: "TerriaFramework.css",
                        chunkFilenane: "[id].css"
                })
        ]
};

module.exports = function (mode) { // Pass-in environment mode from gulpfile.

        // Configure values for production environment here
        if(mode === 'production') { 
                config.mode = 'production';
                devtool: 'source-map';
                config.module.rules[2].use[0].loader = MiniCssExtractPlugin.loader;
        }

        return config;

};


