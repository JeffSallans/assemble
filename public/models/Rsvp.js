"use strict";

//Holds data about how the user responds to the poll
class Rsvp {
	
	constructor(id = null, userId, respondsYes = false) {

		//{UUID} - The database id of the rsvp record, if not in the database leave null
		this.id = id;

		//{UUID} - The database id of the user that responded
		this.userId = userId;

		//{bool} - True if the given user responds yes to the message
		this.respondsYes = respondsYes;
	}
}