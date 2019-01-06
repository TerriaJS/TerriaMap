/* Test Example Plugin Module */

var fs = require('fs');
var cluster = require('cluster');
var exists = require('./exists');
var app = require('./app');

var framework = new app();
framework.init(); // Start application - At this point the framework should render the initial backgound and backend administration webpages. 

// Example framework calls

// var terriajs = require('terriajs');
// var catalog = terriajs.catalog;

// framework.loadModule(catalog); 
