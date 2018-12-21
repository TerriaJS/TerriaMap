'use strict';

const TerriaDb = require('./TerriaDb.js');

var configureDatabase = function() {

	var config = require('../dbconfig.json');

	var connection;
	
	switch(config.database.type) {
	case 'mysql':
		connection = require('./DbConnectors/MysqlDbConnector.js');
	/* Other database example
	case 'mssql':
		terriadb = require('./mssql_db_connector.js');
	*/
	default: 
		connection = require('./DbConnectors/MysqlDbConnector.js');
	}

	var terriadb = new TerriaDb(config.database.type, config.database.host, config.database.username, config.database.password, connection);

	return terriadb; // Return database object

};

module.exports = configureDatabase;