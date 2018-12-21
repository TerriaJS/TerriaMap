'use strict';

var mysql = require('mysql');
var config = require('../../dbconfig.json');

var con = mysql.createConnection({
	host: config.database.host,
	user: config.database.username,
	password: config.database.password
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Database established.");
});

module.exports = con;