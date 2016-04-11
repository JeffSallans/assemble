"use strict";

//Holds data about the user
class User {
	
	constructor(name = "", id = null, phoneNumber = "") {

		//{UUID} - Database identifier, if not in the db leave null
		this.id = id;

		//{string} - Number can text
		this.phoneNumber = phoneNumber;

		//{string} - User display name
		this.name = name;

		//{bool} - True if the user wants to receive text messages
		Object.defineProperty(this, 'isSubscribed', {
			get: function isSubscribedGetter() {
				return this.id !== null;
			}
		});
	}
}