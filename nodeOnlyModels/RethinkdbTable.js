"use strict";

const rethinkdb = require('rethinkdb');

//Provides basic CRUD API functions for a rethink table
class RethinkdbTable {

	//@param tableName {string} - Name of the table
	constructor(tableName) {
		this.tableName = tableName;
	}

	//@param req
	//	@prop _rdbConn - which is the rethinkdb connection varaible
	//	@prop _io - the socket.io socket variable
	getAll(req, res, next) {
	    rethinkdb.table(this.tableName)
	    .orderBy({index: "createdAt"})
	    .run(req._rdbConn)
	    .then((cursor) => {

	        return cursor.toArray();
	    })
	    .then((result) => {
	    	res.type('application/json');
	        res.send(JSON.stringify(result));
	    })
	    .error(error => { throw error })
	    .finally(next);
	}

	//Inserts the body of the request 
	//@param req
	//	@prop _rdbConn - which is the rethinkdb connection varaible
	//	@prop body - record data to insert
	//@returns the inserted entry (now with id)
	create(req, res, next) {
	    var record = req.body;
	    
	    //If id is set to null remove it, to prevent db issues
	    if (record.id === null) {
	    	delete record.id;
	    }

	    record.createdAt = rethinkdb.now(); // Set the field `createdAt` to the current time
	    rethinkdb.table(this.tableName)
	    .insert(record, {returnChanges: true})
    	.run(req._rdbConn)
    	.then((result) => {
	        if (result.inserted !== 1) {
	            throw new Error(`Document was not inserted into ${this.tableName}.`);
	        }
	        else {
		    	res.type('application/json');
	            res.send(JSON.stringify(result.changes[0].new_val));
	        }
	    })
	    .error(error => { throw error })
	    //Close db connection
	    .finally(next);
	}

	//Updates the body of the request, 
	//if no id exists insert the body
	//@param req
	//	@prop _rdbConn - which is the rethinkdb connection varaible
	//	@prop body - record data to insert/update
	//@returns the updated entry (with id)
	update(req, res, next) {
	    var record = req.body;
	    if ((record != null) && (record.id != null)) {
	        rethinkdb.table(this.tableName)
	        .get(record.id)
	        .update(record, {returnChanges: true})
	        .run(req._rdbConn)
	        .then((result) => {
    	    	res.type('application/json');
	            res.send(JSON.stringify(result.changes[0].new_val));
	        })
	        .error(error => { throw error })
	        .finally(next);
	    }
	    else {
	        this.create(req, res, next);
	    }
	}

	//Inserts the body of the request
	//@param req
	//	@prop _rdbConn - which is the rethinkdb connection varaible
	//	@prop query - parameters provided in the query string
	//		@prop id - record id
	//@returns the updated entry (with id)
	delete(req, res, next) {
	    var queryParam = req.query;
	    if ((queryParam != null) && (queryParam.id != null)) {

	    	//Delete record at queryParam.id
	        rethinkdb.table(this.tableName)
	        .get(queryParam.id)
	        .delete()
	        .run(req._rdbConn)
	        .then((result) => {
    	    	res.type('application/json');
	            res.send(JSON.stringify(result));
	        })
	        .error(error => { throw error })
	        //Close db connection
	        .finally(next);
	    }
	    else {
	        throw new Error(`The ${this.tableName} record must have a field 'id'.`);

	        //Close db connection
	        next();
	    }
	}
}

module.exports = RethinkdbTable;