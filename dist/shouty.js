'use strict';

/**
 * @ngdoc function
 * @name StartCtrl
 * @description
 * @param {any} $scope angular scope
 * @ngInject
 */

var StartCtrl = function StartCtrl($scope) {
	$scope.name = "start";

	window[$scope.name + "Scope"] = $scope;
};

/**
 * @ngdoc function
 * @name LoginCtrl
 * @description
 * @param {any} $scope angular scope
 * @ngInject
 */
var LoginCtrl = function LoginCtrl($scope) {
	$scope.name = "login";

	window[$scope.name + "Scope"] = $scope;
};

var Controllers = {
	StartCtrl: StartCtrl,
	LoginCtrl: LoginCtrl
};

var shouty = {
	init: function init() {
		/**
   * @name shoutyApp
   * @description
   * # shoutyApp
   *
   * Main module of the application.
   */
		var shoutyApp = angular.module("shoutyApp", ["ngAnimate", "ngAria", "ngCookies", "ngMessages", "ngResource", "ngRoute", "ngSanitize", "ngTouch", "ui.router"]).config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function ($locationProvider, $stateProvider, $urlRouterProvider) {
			var startState = {
				name: "start",
				url: "/",
				templateUrl: "./views/start.html",
				controller: "StartCtrl"
			};
			var loginState = {
				name: "login",
				url: "/login",
				templateUrl: "./views/login.html",
				controller: "LoginCtrl"
			};

			$stateProvider.state(startState);
			$stateProvider.state(loginState);

			$urlRouterProvider.otherwise("/");

			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});
		}]);

		Object.keys(Controllers).forEach(function (name) {
			shoutyApp.controller(name, Controllers[name]);
		});

		console.log(shouty);

		shouty.run();
	}
};

module.exports = shouty;