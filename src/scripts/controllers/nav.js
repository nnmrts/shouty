import $ from "jquery";

/**
 * @ngdoc function
 * @name NavCtrl
 * @description
 * @param {any} $scope angular scope
 * @param {any} $transitions ui.router $transitions service
 * @ngInject
 */
const NavCtrl = function($scope, $transitions) {
	$scope.name = "nav";

	$scope.links = [
		"start",
		"login"
	];

	$transitions.onStart({}, (transition) => {
		if (transition.from().name !== "") {
			$(`a[href=${transition.from().name}]`).removeClass("active");
		}

		$(`a[href=${transition.to().name}]`).addClass("active");

		return true;
	});

	window[`${$scope.name}Scope`] = $scope;
};

export default NavCtrl;
