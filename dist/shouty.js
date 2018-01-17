'use strict';

/**
 * @ngdoc function
 * @name StartCtrl
 * @description
 * @param {any} $scope angular scope
 * @ngInject
 */
const StartCtrl = function($scope) {
	$scope.name = "start";

	window[`${$scope.name}Scope`] = $scope;
};

/**
 * @ngdoc function
 * @name LoginCtrl
 * @description
 * @param {any} $scope angular scope
 * @ngInject
 */
const LoginCtrl = function($scope) {
	$scope.name = "login";

	window[`${$scope.name}Scope`] = $scope;
};

const Controllers = {
	StartCtrl,
	LoginCtrl
};


/**
 * @name shoutyApp
 * @description
 * # shoutyApp
 *
 * Main module of the application.
 */
const shouty = angular
	.module("shoutyApp", [
		"ngAnimate",
		"ngAria",
		"ngCookies",
		"ngMessages",
		"ngResource",
		"ngRoute",
		"ngSanitize",
		"ngTouch",
		"ui.router"
	])
	.config(($locationProvider, $stateProvider, $urlRouterProvider) => {
		const startState = {
			name: "start",
			url: "/",
			templateUrl: "./views/start.html",
			controller: "StartCtrl"
		};
		const loginState = {
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
	});

Object.keys(Controllers).forEach((name) => {
	shouty.controller(name, Controllers[name]);
});

module.exports = shouty;
