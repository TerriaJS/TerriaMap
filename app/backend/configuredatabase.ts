'use strict';

var database = require('./database');

class configuredatabase {

	static start(): database {

		var connection;

		var config = require('../dbconfig.json');
	
		switch(config.database.type) {
		case 'mysql':
			connection = require('./databases/mysql/mysql.js');
		/* Other database example
		case 'mssql':
			terriadb = require('./databases/mssql/mssql.js');
		*/
		/* Other database example
		case 'mongodb':
			terriadb = require('./databases/mongodb/mongodb.js');
		*/
		/* Custom example
		case 'customdb':
			terriadb = require('./databases/customdb/customdb.js');
		*/
		default: 
			connection = require('./databases/mysql/mysql.js');
		}

		return new database(config.database.type, config.database.host, config.database.username, config.database.password, connection); // Return database object

	}

}

module.exports = configuredatabase;