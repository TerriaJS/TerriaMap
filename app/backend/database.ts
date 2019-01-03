'use strict';

class database {

	public type: string;
	public host: string;
	private username: string;
	private password: string;
	public connection: object;

	constructor(type: string, host: string, username: string, password: string, connection: object) {
		this.type = type;
		this.host = host;
		this.username = username;
		this.password = password;
		this.connection = connection;
	}

	getStatus(): boolean {
		return this.connection.state;
	}

}

module.exports = database;