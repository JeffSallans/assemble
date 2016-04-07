(function() {
	"use strict";

	var mongoose = require("mongoose");

	var PostSchema = new mongoose.Schema({
		title: String,
		body: String,
		timestamp: Date
	});

	mongoose.model("Post", PostSchema);

})();