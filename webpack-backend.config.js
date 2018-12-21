'use strict';

var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
        // Set target runtime environment to nodejs for host backend-server processing. Native modules such as Mysql can only run in a nodejs server environment.
        // We can extend the terriajs-server and change the webpack configuration but since we are going to deal with the server a lot more and the client side altogether.
        // I decided I'm having the backend-server files and client-side files separately together to build a wholistic javascript geospatial framework. 
        // Should help lessen bugs and issues that comes with webpack dealing with nodejs native modules.
        // I'll probably integrate the terriajs-server somehow later on just so I can use the codebase that's been already implemented.
        target: "node", 
        entry: {
        app: ["./server.js"]
        },
        output: {
        path: path.resolve(__dirname, './app', 'dist'),
        filename: "bundle-backend.js",
        sourcePrefix: ''
        },
        externals: [nodeExternals()], // We do not bundle the node_modules into one js file on node apps unlike in the frontend webpack config.
};


