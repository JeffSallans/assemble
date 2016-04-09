"use strict";

const rethinkdb = require('rethinkdb');

//Provides basic CRUD functions for a rethink table
class RethinkdbTable {

	//@param tableName {string} - Name of the table
	constructor(tableName) {
		debugger;
		this.tableName = tableName;
	}

	//@param req
	//	@prop _rdbConn - which is the rethinkdb connection varaible
	getAll(req, res, next) {
		debugger;
	    rethinkdb.table(this.tableName)
	    .orderBy({index: "createdAt"})
	    .run(req._rdbConn)
	    .then(function(cursor) {
	        return cursor.toArray();
	    })
	    .then(function(result) {
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
	    record.createdAt = rethinkdb.now(); // Set the field `createdAt` to the current time
	    rethinkdb.table(this.tableName)
	    .insert(record, {returnChanges: true})
    	.run(req._rdbConn)
    	.then(function(result) {
	        if (result.inserted !== 1) {
	            handleError(res, next)(new Error(`Document was not inserted into ${this.tableName}.`));
	        }
	        else {
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
	        .then(function(result) {
	            res.send(JSON.stringify(result.changes[0].new_val));
	        })
	        .error(error => { throw error })
	        .finally(next);
	    }
	    else {
	        create(req, res, next);
	    }
	}

	//Inserts the body of the request
	//@param req
	//	@prop _rdbConn - which is the rethinkdb connection varaible
	//	@prop body - record data to delete
	//		@prop id - record id
	//@returns the updated entry (with id)
	delete(req, res, next) {
	    var record = req.body;
	    if ((record != null) && (record.id != null)) {

	    	//Delete record at record.id
	        rethinkdb.table(this.tableName)
	        .get(record.id)
	        .delete()
	        .run(req._rdbConn)
	        .then(function(result) {
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