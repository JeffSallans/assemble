(function () {
	"use strict";

	var app = angular.module("peanutGallery", []);

	app.controller("mainController", [
		"$scope",
		"$http",
		function($scope, $http) {

			$scope.posts = [];
			$scope.newPost = "";
			$scope.showGallery = false;

			$scope.init = function() {
				$scope.getAll();
			};

			$scope.getAll = function() {
				return $http.get("/posts").success(function(data) {
					angular.copy(data, $scope.posts);
				})
			};

			$scope.createNewPost = function() {

				//Don't create post if null
				if (!$scope.newPost) return;

				//Create database object
				var tempPost = {
					title: $scope.posts.length + 1 + "",
					body: $scope.newPost,
					timestamp: new Date()
				};

				$scope.create(tempPost).then(function() {
					$scope.newPost = null;
					$scope.showGallery = true;
				})
			};

			$scope.create = function(post) {
				return $http.post("/posts", post).success(function(data) {
					$scope.posts.push(data);
				});
			};

			$scope.toggleGalleryView = function() {
				$scope.showGallery = !$scope.showGallery;
			}

			$scope.formatPrettyDate = function(timestampString) {

				var timestamp = new Date(timestampString);

				if (!timestamp) return '';

				//Get values
				var hours = timestamp.getHours();
				var minutes = timestamp.getMinutes();
				var seconds = timestamp.getSeconds();

				//Pad numbers less than 10
				hours = (hours < 10 ? '0' : '') + hours;
				minutes = (minutes < 10 ? '0' : '') + minutes;
				seconds = (seconds < 10 ? '0' : '') + seconds;

				return hours + ":" + minutes + ":" + seconds;
			}

			$scope.init();
		}
	]);
})();