import StartCtrl from "./controllers/start.js";
import LoginCtrl from "./controllers/login.js";

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
const shoutyApp = angular
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
	shoutyApp.controller(name, Controllers[name]);
});


export default shoutyApp;
