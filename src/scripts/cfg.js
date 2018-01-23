const cwd = window.location.pathname;

/**
 * @name ShoutyCfg
 * @description
 * config of the main angular module
 *
 * @param {any} $locationProvider ui.router $locationProvider
 * @param {any} $stateProvider ui.router $stateProvider
 * @param {any} $urlRouterProvider ui.router $stateProvider
 */
const ShoutyCfg = ($locationProvider, $stateProvider, $urlRouterProvider) => {
	"ngInject";

	const startState = {
		name: "start",
		url: `${cwd}`,
		templateUrl: `${cwd}views/start.html`,
		controller: "StartCtrl"
	};

	$stateProvider.state(startState);

	$urlRouterProvider.otherwise("/");

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
};

export default ShoutyCfg;
