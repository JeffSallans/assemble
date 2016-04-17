"use strict";

const express = require('express');
const router = express.Router();
const https = require('https');
const rethinkdb = require('rethinkdb');
const _ = require('lodash');
const PushBullet = require('pushbullet');
const pushBulletApiToken = require('../secret/pushBulletApiToken');

const OKAY_STATUS = 200;
const NOT_IMPLEMENTED_STATUS = 501

//Triggers a text message to be sent to all users
//@param req
//	@prop _rdbConn - which is the rethinkdb connection varaible
router.post('/', function(req, res, next) {

	//Delete current rsvps
	rethinkdb.table('Rsvps')
		.delete()
		.run(req._rdbConn)
		.then(result => {

			//Throw error if exists
			if (result.first_error) {
				throw result.first_error;
			}

			//Send out all messages
			return rethinkdb.table('Users')
			    .orderBy({index: "createdAt"})
			    .run(req._rdbConn);
		})
	    .then(cursor => {
	        return cursor.toArray();
	    })
	    .then(allUsers => {

	    	allUsers.forEach(user => {
	    		var message = `Rocket League Team ASSEMBLE!!!

(Count Me In assemble.jeffsallans.com/#?pN=${user.phoneNumber}&rY=true) 

[Not today assemble.jeffsallans.com/#?pN=${user.phoneNumber}&rY=true]`;

	    		sendText(user.phoneNumber, message);	
	    	});

			//Return success
			res.sendStatus(OKAY_STATUS);
	    })
	    .error(error => { throw error })
		//Close db connection
	    .finally(next)
});

//Reset all rsvp data
router.delete('/', function(req, res, next) {

	//Delete current rsvps
	rethinkdb.table('Rsvps')
		.delete()
		.run(req._rdbConn)
		.then(result => {

			if (result.first_error) throw result.first_error;
		}) 
		.error(error => { throw error })
		//Close db connection
		.finally(next)
});

module.exports = router;

//@param number {integer} - Number to send message to
//@param message {string} - Content of the message to send 
function sendText(number, message) {

	//Derived from https://docs.pushbullet.com/#send-sms
	var data = {
		conversation_iden: "+1 " + number,
		message: message,
		source_user_iden: "ujwAeleqynA",
		target_device_iden: "ujwAeleqynAsjz7O3P0Jl6",
	};

	var pusher = new PushBullet(pushBulletApiToken);
	pusher.sendSMS(data, (d) => {
		console.log('Finished: ', d)
	});
}
