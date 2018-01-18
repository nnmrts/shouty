const cwd = window.location.pathname;

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

	$http.get("messages.json").then((response) => {
		$scope.messages = response.data;

		$scope.$applyAsync();
	});

	$scope.sendMessage = () => {
		$http.post(cwd, {
			username: $scope.username,
			message: $scope.message
		}).then((response) => {
			if (response.data === "success") {
				$http.get("messages.json").then((innerResponse) => {
					$scope.messages = innerResponse.data;

					$scope.$applyAsync();
				});
			}
		});
	};

	window[`${$scope.name}Scope`] = $scope;
};

export default StartCtrl;
