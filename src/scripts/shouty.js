import StartCtrl from "./controllers/start.js";
import LoginCtrl from "./controllers/login.js";
import NavCtrl from "./controllers/nav.js";

const Controllers = {
	StartCtrl,
	LoginCtrl,
	NavCtrl
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
			url: "^/",
			templateUrl: "^/views/start.html",
			controller: "StartCtrl"
		};
		const loginState = {
			name: "login",
			url: "^/login",
			templateUrl: "^/views/login.html",
			controller: "LoginCtrl"
		};

		$stateProvider.state(startState);
		$stateProvider.state(loginState);

		$urlRouterProvider.otherwise("/");

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}).directive("ngEnter", () => function(scope, element, attrs) {
		element.bind("keydown keypress", (event) => {
			if (event.which === 13) {
				scope.$apply(() => {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	});

Object.keys(Controllers).forEach((name) => {
	shoutyApp.controller(name, Controllers[name]);
});


export default shoutyApp;
