'use strict';

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