"use strict";

// Import
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rethinkdb = require('rethinkdb');
const favicon = require('serve-favicon');
const logger = require('morgan');

// Load config for RethinkDB and express
const config = require(path.join(__dirname, 'config'));

// Init express
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


//___ API Call ___

// Middleware that will create a connection to the database
app.use(createConnection);

//___ Setup Routes ___
// Define main routes

var poll = require('./routes/poll');
app.use('/poll', poll);

// Middleware to close a connection to the database
app.use(closeConnection);



//___ Database Setup ___


//___ 404 ___
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//___ Error Handlers ___

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
function createConnection(req, res, next) {
    r.connect(config.rethinkdb).then(function(conn) {
        req._rdbConn = conn;
        next();
    }).error(handleError(res));
}

/*
 * Close the RethinkDB connection
 */
function closeConnection(req, res, next) {
    req._rdbConn.close();
}
