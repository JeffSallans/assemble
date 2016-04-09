"use strict";

const express = require('express');
const router = express.Router();
const https = require('https');

const OKAY_STATUS = 200;
const NOT_IMPLEMENTED_STATUS = 501

//Triggers a text message to be sent to all users
router.get('/', function(req, res, next) {

	sendText(8105238169, "Does this work Jeff");
	
	//Return success
	res.sendStatus(OKAY_STATUS);
});

//Reset all rsvp data
router.delete('/', function(req, res, next) {

	//Return success
	res.sendStatus(NOT_IMPLEMENTED_STATUS);
});

module.exports = router;


function getAll(req, res, next) {
    r.table('todos').orderBy({index: "createdAt"}).run(req._rdbConn).then(function(cursor) {
        return cursor.toArray();
    }).then(function(result) {
        res.send(JSON.stringify(result));
    }).error(handleError(res))
    .finally(next);
}

/*
 * Insert a todo
 */
function create(req, res, next) {
    var todo = req.body;
    todo.createdAt = r.now(); // Set the field `createdAt` to the current time
    r.table('todos').insert(todo, {returnChanges: true}).run(req._rdbConn).then(function(result) {
        if (result.inserted !== 1) {
            handleError(res, next)(new Error("Document was not inserted."));
        }
        else {
            res.send(JSON.stringify(result.changes[0].new_val));
        }
    }).error(handleError(res))
    .finally(next);
}

/*
 * Update a todo
 */
function update(req, res, next) {
    var todo = req.body;
    if ((todo != null) && (todo.id != null)) {
        r.table('todos').get(todo.id).update(todo, {returnChanges: true}).run(req._rdbConn).then(function(result) {
            res.send(JSON.stringify(result.changes[0].new_val));
        }).error(handleError(res))
        .finally(next);
    }
    else {
        handleError(res)(new Error("The todo must have a field `id`."));
        next();
    }
}

/*
 * Delete a todo
 */
function del(req, res, next) {
    var todo = req.body;
    if ((todo != null) && (todo.id != null)) {
        r.table('todos').get(todo.id).delete().run(req._rdbConn).then(function(result) {
            res.send(JSON.stringify(result));
        }).error(handleError(res))
        .finally(next);
    }
    else {
        handleError(res)(new Error("The todo must have a field `id`."));
        next();
    }
}
