/**
 * @ngdoc function
 * @name StartCtrl
 * @description
 * @param {any} $scope angular scope
 * @param {any} $http angular $http service
 * @ngInject
 */
const StartCtrl = function($scope, $http) {
	$scope.name = "start";

	$http.get("./messages.json").then((response) => {
		console.log(response);
	});

	window[`${$scope.name}Scope`] = $scope;
};

export default StartCtrl;
