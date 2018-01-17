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

export default LoginCtrl;
