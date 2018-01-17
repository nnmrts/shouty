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

export default StartCtrl;
