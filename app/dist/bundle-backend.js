/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {"database":{"type":"mysql","host":"localhost","username":"","password":""}}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mysql = __webpack_require__(11);
var config = __webpack_require__(0);

var con = mysql.createConnection({
	host: config.database.host,
	user: config.database.username,
	password: config.database.password
});

con.connect(function(err) {
	if (err) throw err;
});

module.exports = con;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const http = __webpack_require__(4); // HTTP Module
const url = __webpack_require__(5); // URL Library
const fs = __webpack_require__(6); // File System
const express = __webpack_require__(7); // ExpressJS Framework  - https://expressjs.com/ - Mainly for its minimalistic attribute.
var mymodule = __webpack_require__(8); // Example custom module running in backend nodejs server
var configureDatabase = __webpack_require__(9); // Start backend database configuration - should really be started by a url visit from the user in the startup installation process.

const app = express();
const port = 3000;

// Start backend webapp using express. We'll be using ReactJS on the frontend side pages that communicates with this server using express http and routes.
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Terria framework running on ${port}!`))

// Run configuration for the backend content management framework
var db = configureDatabase();








/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

exports.myDateTime = function () {
	return Date();
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const TerriaDb = __webpack_require__(10);

var configureDatabase = function() {

	var config = __webpack_require__(0);

	var connection;
	
	switch(config.database.type) {
	case 'mysql':
		connection = __webpack_require__(1);
	/* Other database example
	case 'mssql':
		terriadb = require('./mssql_db_connector.js');
	*/
	default: 
		connection = __webpack_require__(1);
	}

	var terriadb = new TerriaDb(config.database.type, config.database.host, config.database.username, config.database.password, connection);

	if(terriadb.connection.state == "connected") {
		console.log("Database Established.");
	}

	return terriadb; // Return database object

};

module.exports = configureDatabase;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TerriaDb = function TerriaDb(type, host, username, password, connection) {

	this.type = type;
	this.host = host;
	this.username = username;
	this.password = password;
	this.connection = connection;

}

TerriaDb.prototype.checkStatus = function() {
	if(this.connection.state === 'connected') {
		console.log("Connected.");
	} else {
		console.log("Disconnected")
	}
}

module.exports = TerriaDb;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ })
/******/ ]);