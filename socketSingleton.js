"use strict";

//const SocketServer = require("socket.io");

class socketSingletonManager {

	constructor() {
		this.io = null;
	}

	//@param {Http} - Http server object created by express init
	createSocket(httpServer) {
		this.io = require("socket.io")(httpServer);
	}

	//@returns {Socket}
	getSocket() {
		return this.io;
	}
}

module.exports = new socketSingletonManager();