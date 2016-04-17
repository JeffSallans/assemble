"use strict";

//Holds data about the user
var User = function  User(name, id, phoneNumber) {
	
	//{UUID} - Database identifier, if not in the db leave null
	this.id = id !== undefined ? id : null;

	//{string} - Number can text
	this.phoneNumber = phoneNumber !== undefined ? phoneNumber : "";

	//{string} - User display name
	this.name = name !== undefined ? name : "";

	//{bool} - True if the user wants to receive text messages
	Object.defineProperty(this, 'isSubscribed', {
		get: function isSubscribedGetter() {
			return this.id !== null;
		}
	});
}
