import $ from "jquery";

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

// this attaches all controllers, filters, etc. to the angular module
Object.keys(map).forEach((key) => {
	Object.keys(map[key]).forEach((name) => {
		ShoutyApp[key.slice(0, -1)](name, map[key][name]);
	});
});


// fix for vh unit on mobile devices
setTimeout(() => {
	const viewheight = $(window).height();
	const viewwidth = $(window).width();
	const viewport = document.querySelector("meta[name=viewport]");
	viewport.setAttribute("content", `height=${viewheight}px, width=${viewwidth}px, initial-scale=1.0`);
}, 300);


export default ShoutyApp;
