"use strict";

//Holds data about how the user responds to the poll
var Rsvp = function Rsvp(id, userId, respondsYes) {
	
	//{UUID} - The database id of the rsvp record, if not in the database leave null
	this.id = id !== undefined ? id : null;

	//{UUID} - The database id of the user that responded
	this.userId = userId;

	//{bool} - True if the given user responds yes to the message
	this.respondsYes = respondsYes !== undefined ? respondsYes : false;
}
