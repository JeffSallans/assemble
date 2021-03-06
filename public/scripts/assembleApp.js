(function () {
	"use strict";

	var app = angular.module("assemble", ["ngRoute", "btford.socket-io"]);

	var COOKIE_NAME_USERNAME = "name";
	var COOKIE_NAME_PHONENUMBER = "phonenumber";

	app.factory("mySocket", function(socketFactory) {
		return socketFactory();
	});

	app.controller("mainController", [
		"$scope",
		"$http",
		"$location",
		"$q",
		"mySocket",
		function($scope, 
			$http, 
			$location, 
			$q, 
			mySocket) {

			//{Array of User}
			$scope.users = [];

			//{Array of Rsvp}
			$scope.rsvps = [];

			Object.defineProperty($scope, "yesRsvps", {
				get: function getYesRsvps() {
					return _.filter($scope.rsvps, function(rsvp) {
						return rsvp.respondsYes;
					}) || [];
				}
			});

			//{string} - Staging area for landing page name
			$scope.name = "";

			//{string} - Staging area for landing page phoneNumber
			$scope.phoneNumber = "";

			//{User} - Data of the current visitor
			$scope.currentUser = new User();

			//{bool} - True if the poll screen should show
			Object.defineProperty($scope, "showPoll", {
				get: function getShowPoll() {
					return $scope.currentUser.name || $scope.currentUser.phoneNumber;
				}
			});

			//{bool} - True if the poll should show actions
			$scope.showActions = true;

			//{Object of functions}
			$scope.methods = {
				init: init,
				enterSite: enterSite,
				startPoll: startPoll,
				subscribeUser: subscribeUser,
				unsubscribeUser: unsubscribeUser,
				togglePollView: togglePollView,
				getPrettyRsvpResponseForUser: getPrettyRsvpResponseForUser,
			};

			//___ Socket Functionality ___
			mySocket.on('Users', function(changedUser) {

				var oldRecord = null;
				var newRecord = null;

				if (changedUser.old_val) {
					oldRecord = new User(changedUser.old_val.name,
						changedUser.old_val.id,
						changedUser.old_val.phoneNumber);
				}

				if (changedUser.new_val) {
					newRecord = new User(changedUser.new_val.name,
						changedUser.new_val.id,
						changedUser.new_val.phoneNumber);
				}

				handleChange($scope.users, {
					oldRecord: oldRecord,
					newRecord: newRecord
				});

				//Update current user if that is the one that is deleted
				if (oldRecord && !newRecord && 
					oldRecord.id === $scope.currentUser.id) {
				
					$scope.currentUser.id = null;
				}

				//Update current user if that is the one that is added or modified
				if (newRecord && newRecord.phoneNumber === $scope.currentUser.phoneNumber) {
					
					_.assignIn($scope.currentUser, newRecord);
				}
			});

			mySocket.on('Rsvps', function(changedRsvp) {
				
				var oldRecord = null;
				var newRecord = null;

				if (changedRsvp.old_val) {
					oldRecord = new Rsvp(changedRsvp.old_val.id,
						changedRsvp.old_val.userId,
						changedRsvp.old_val.respondsYes);
				}

				if (changedRsvp.new_val) {
					newRecord = new Rsvp(changedRsvp.new_val.id,
						changedRsvp.new_val.userId,
						changedRsvp.new_val.respondsYes);
				}

				handleChange($scope.rsvps, {
					oldRecord: oldRecord,
					newRecord: newRecord
				});
			});

			//Function call on page load
			init();

			//___ Functions ___

			//@param dataSet {Array of Users|Rsvps}
			//@param changedRecord
			//	@prop oldRecord {Users|Rsvps} - value in the dataSet before the operation
			//	@prop newRecord {Users|Rsvps} - value in the dataSet after the operation
			//@modifies dataSet to represent the change
			function handleChange(dataSet, changedRecord) {
				//Inserted record
				if (changedRecord.oldRecord == null) {

					dataSet.push(changedRecord.newRecord); 
				}
				//Deleted record
				else if (changedRecord.newRecord == null) {
					
					var victimResults = _.filter(dataSet, function(record) {
						return record.id === changedRecord.oldRecord.id;
					}) || [];

					//Check if victim exists
					if (victimResults.length > 0) {
						//Get the index of the current value so we can swap old and new data by reference
						var victimIndex = dataSet.indexOf(victimResults[0]);
						dataSet.splice(victimIndex, 1);
					}
				}
				//Updated data
				else {
					var targetResults = _.filter(dataSet, function(record) {
						return record.id === changedRecord.oldRecord.id;
					}) || [];

					//Check if target exists
					if (targetResults.length > 0) {

						//Get the index of the current value so we can swap old and new data by reference
						var targetIndex = dataSet.indexOf(targetResults[0]);
						_.assignIn(dataSet[targetIndex], changedRecord.newRecord);
					}
					else {
						dataSet.push(changedRecord.newRecord);
					}
				}
			}

			//Logic to run on page load
			//RSVP URL OPTIONS
			//	YES - /#?pN=5555555&rY=true
			//	NO - /#?pN=5555555&rY=false
			function init() {

				//{string}
				var phoneNumber = $location.search().pN;

				//{bool}
				var respondsYes = $location.search().rY;

				//Only check cookie if userId doesn't exist
				if (!phoneNumber) {

					//Get Existing user data
					phoneNumber = getCookie(COOKIE_NAME_PHONENUMBER);
				}

				var promises = [];

				promises.push(
					getAllUsers()
					//Determine if some that loaded the webpage is already submitted
					.then(function assignCurrentUser() {

						//See if current user is in the backend
						if (phoneNumber) {

							//Check if phone number is in submitted list
							var currentUserResult = _.filter($scope.users, function(user) {
								return user.phoneNumber === phoneNumber;
							}) || [];

							if (currentUserResult.length > 0) {
								$scope.currentUser = currentUserResult[0];
							}
							//Otherwise just set name and phoneNumber property
							else {

								//Use cookie data as the form data
								$scope.currentUser.name = getCookie(COOKIE_NAME_USERNAME);
								$scope.currentUser.phoneNumber = phoneNumber;
							}
						}
					})
				);
				promises.push(
					getAllRsvps()
				);

				//Logic when everything is loaded
				$q.all(promises).then(function() {
					
					//if respondsYes is a boolean, make a record for it
					if (respondsYes != null) {

						var respondsYesAsBool = respondsYes === "true";

						recordRsvp(respondsYesAsBool);
					}
				});
			};

			//@returns {Promise resolves null} - Promise resolves when GET /user returns
			function getAllUsers() {
				return $http.get("/user").success(function(data) {
					
					$scope.users = _.map(data, function(userData) {
						return new User(userData.name, userData.id, userData.phoneNumber);
					});
				});
			};

			//@returns {Promise resolves null} - Promise resolves when get /rsvp returns
			function getAllRsvps() {
				return $http.get("/rsvp").success(function(data) {
					$scope.rsvps = _.map(data, function(rsvpData) {
						return new Rsvp(rsvpData.id, rsvpData.userId, rsvpData.respondsYes);
					});				
				});
			};

			//@returns {Promise resolves Object} - Promise resolves when PUT /user returns
			function subscribeUser() {
				return $http.put("/user", $scope.currentUser);
			}

			//@returns {Promise resolves Object} - Promise resolves when DELETE /user returns
			function unsubscribeUser() {
				return $http.delete("/user" + "?id=" + $scope.currentUser.id);
			}

			//If valid sets form data to current user and stores data in cookie
			//@modifies cookie COOKIE_NAME_USERNAME
			//@modifies cookie COOKIE_NAME_PHONENUMBER
			function enterSite() {

				//Don't create post if null
				if (!$scope.name ||
					!$scope.phoneNumber) {
					return;
				}

				//Set data to current user
				$scope.currentUser.name = $scope.name;
				$scope.currentUser.phoneNumber = $scope.phoneNumber;

				//Save user data
				setCookie(COOKIE_NAME_USERNAME, $scope.currentUser.name, 7);
				setCookie(COOKIE_NAME_PHONENUMBER, $scope.currentUser.phoneNumber, 7);
			};

			//@returns {Promise resolves Object} - Promise resolves when POST /poll returns
			function startPoll() {

				return $http.post("/poll", $scope.currentUser);
			};

			//Use to toggle between the landing page and the poll view
			function togglePollView() {
				$scope.showPoll = !$scope.showPoll;
			}

			//@param user {User} - User to find the Rsvp for
			//@returns {Rsvp} - The Rsvp for the user, null if rsvp has not been sent
			function getRsvpResponseForUser(user) {
				
				var rsvpResult = _.filter($scope.rsvps, function(rsvp) {
					return rsvp.userId === user.id;
				}) || [];

				if (rsvpResult.length > 0) {
					return rsvpResult[0];
				}
				else {
					return null;
				}
			}

			//@param user {User} - User to find the Rsvp for
			//@returns {string} - Display verbage for rsvp state
			function getPrettyRsvpResponseForUser(user) {
				var result = getRsvpResponseForUser(user);

				if (result === null) {
					return "tbd";
				} 
				else if (result.respondsYes) {
					return "yes";
				}
				else {
					return "no";
				}
			}

			//Adds an Rsvp record to the backend, if an Rsvp already exists modify it instead
			//@returns {Promise resolves object} - Promise resolves when PUT /rsvp returns
			function recordRsvp(respondsYes) {

				//Get current Rsvp if exists, if it doesn't an empty object is returned
				var currentRsvp = getRsvpResponseForUser($scope.currentUser) || {};

				var rsvp = new Rsvp(currentRsvp.id, $scope.currentUser.id, respondsYes);

				return $http.put("/rsvp", rsvp);
			}

			//Taken from http://www.w3schools.com/js/js_cookies.asp
			function setCookie(cname, cvalue, exdays) {
			    var d = new Date();
			    d.setTime(d.getTime() + (exdays*24*60*60*1000));
			    var expires = "expires="+d.toUTCString();
			    document.cookie = cname + "=" + cvalue + "; " + expires;
			}

			//Taken from http://www.w3schools.com/js/js_cookies.asp
			function getCookie(cname) {
			    var name = cname + "=";
			    var ca = document.cookie.split(';');
			    for(var i=0; i<ca.length; i++) {
			        var c = ca[i];
			        while (c.charAt(0)==' ') c = c.substring(1);
			        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
			    }
			    return "";
			}
		}
	]);
})();