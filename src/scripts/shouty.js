import map from "./map.js";
import ShoutyCfg from "./cfg.js";

/**
 * @name ShoutyApp
 * @description
 * main module of the application.
 */
const ShoutyApp = angular
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
	.config(ShoutyCfg);

Object.keys(map).forEach((key) => {
	Object.keys(map[key]).forEach((name) => {
		ShoutyApp[key.slice(0, -1)](name, map[key][name]);
	});
});


export default ShoutyApp;
