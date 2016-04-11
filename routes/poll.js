"use strict";

const express = require('express');
const router = express.Router();
const https = require('https');
const PushBullet = require('pushbullet');
const pushBulletApiToken = require('../secret/pushBulletApiToken');

const OKAY_STATUS = 200;
const NOT_IMPLEMENTED_STATUS = 501

const pushBulletRequestOptions = {
	hostname: 'api.pushbullet.com',
	port: 443,
	path: '/v2/ephemerals',
	method: 'POST',
	headers: {
		'Access-Token': pushBulletApiToken,
		'Content-Type': 'application/json'
	}
};

//Triggers a text message to be sent to all users
router.post('/', function(req, res, next) {

	sendText(8105238169, "Does this work Jeff");

	//Return success
	res.sendStatus(OKAY_STATUS);

	//Close db connection
	next()
});

//Reset all rsvp data
router.delete('/', function(req, res, next) {

	//Return success
	res.sendStatus(NOT_IMPLEMENTED_STATUS);

	//Close db connection
	next()
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
