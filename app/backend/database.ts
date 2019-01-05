'use strict';

class database {

	public type: string;
	public host: string;
	private username: string;
	private password: string;
	public connection: any;

	constructor(type: string, host: string, username: string, password: string, connection: any) {
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

export = database;