"use strict";

// Import
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rethinkdb = require('rethinkdb');
const favicon = require('serve-favicon');
const logger = require('morgan');
const _ = require('lodash');

// Load config for RethinkDB and express
const config = require(path.join(__dirname, 'config'));

// Init express
//app.use work like a waterfall, for each request each .use is called in order
// until res.send() is called
var app = express();


//Expose the public directory to the frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

//___ Additional Settings ___
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Log apache messages to STDOUT
app.use(logger('dev'));
// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// expose everything in directory public
app.use(express.static(path.join(__dirname, 'public')));

//___ View Engine Setup ___
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//___ API Call ___

// Middleware that will create a connection to the database
app.use(createConnection);

//___ Setup Routes ___
// Define main routes
// Assumes all of these requests call next to close connection

var initSinglePageApp = require(path.join(__dirname, 'routes', 'initSinglePageApp'));
app.use('/', initSinglePageApp);

var poll = require(path.join(__dirname, 'routes', 'poll'));
app.use('/poll', poll);

var rsvp = require(path.join(__dirname, 'routes', 'rsvp'));
app.use('/rsvp', rsvp);

var user = require(path.join(__dirname, 'routes', 'user'));
app.use('/user', user);

// Middleware to close a connection to the database
app.use(closeConnection);

//___ 404 ___
// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//___ Error Handlers ___

//If there is an error during the request res function would
// be skipped and the logic falls to this function
app.use((err, req, res, next) => {
	handleError(res, err);
});

//___ Database Setup ___

var databaseTables = [
	'Rsvps',
	'Users'
];

/*
 * Create tables/indexes then start express
 */
rethinkdb.connect(config.rethinkdb)
	.then((conn, err) => {
		if (err) {
			console.log("Could not open a connection to initialize the database");
			console.log(err.message);
			process.exit(1);
		}

		return checkDatabaseExists(config.rethinkdb.db, conn)
			.then(() => {

				var promises = _.map(databaseTables, (tableName) => checkTableExists(tableName, conn));

				return Promise.all(promises)
					.then(() => conn.close());
			});
});

module.exports = app;

/*
 * Send back a 500 error
 */
function handleError(res, error) {

	// development error handler
	// will print stacktrace
	var stacktrace = {};
	if (app.get('env') === 'development') {
		stacktrace = error;
	}

	res.send(error.status || 500, {
		error: error.message,
		stacktrace: stacktrace
	});
}

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
function createConnection(req, res, next) {
	rethinkdb.connect(config.rethinkdb).then(function(conn) {
		req._rdbConn = conn;

		//Continue to next Express handler
		next();
	}).error(error => handleError(res, error));
}

/*
 * Close the RethinkDB connection
 */
function closeConnection(req, res, next) {
	req._rdbConn.close();
}

//Checks if the table exists and creates a table if it doesn't
//@param tableName {string} - Name of the table in rethinkdb
//@param conn {object} - rethinkdb connection
//@return {Promise} - Resolves when table exists in db
function checkTableExists(tableName, conn) {

	return rethinkdb.table(tableName).indexWait('createdAt').run(conn).then((err, result) => {
		console.log(`${tableName} table and index are available`);
	})
	.error((err) => {
		// The database/table/index was not available, create them
		rethinkdb.tableCreate(tableName).run(conn).finally(() => {
			return rethinkdb.table(tableName).indexCreate('createdAt').run(conn);
		}).finally(() => {
			return rethinkdb.table(tableName).indexWait('createdAt').run(conn)
		}).then((result) => {
			console.log(`${tableName} table initialize`);
		}).error((err) => {
			if (err) {
				console.log(`Could not wait for the completion of the index ${tableName}`);
				console.log(err);
				process.exit(1);
			}
			console.log(`${tableName} table initialize`);
		});
	});
}

//Create the database if it does not exist
//@param databaseName {string} - Name of database
//@param conn {object} - rethinkdb connection
//@returns {Promise}
function checkDatabaseExists(databaseName, conn) {
	return rethinkdb.dbList().contains(databaseName)
		.do(function(databaseExists) {
			return rethinkdb.branch(
				databaseExists,
				{ created: 0 },
				rethinkdb.dbCreate(databaseName)
			);
		}).run(conn);
}
