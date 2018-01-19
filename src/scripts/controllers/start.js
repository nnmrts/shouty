import $ from "jquery";

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

	$scope.username = "";
	$scope.message = "";

	$scope.test = () => !$("input").hasClass("ng-empty");

	$scope.sendMessage = () => {
		if ($scope.test()) {
			const date = new Date();
			const time = `${date.getFullYear()}/${(date.getMonth() + 1).toLocaleString("de", {
				minimumIntegerDigits: 2
			})}/${date.getDate().toLocaleString("de", {
				minimumIntegerDigits: 2
			})}\n${date.getHours().toLocaleString("de", {
				minimumIntegerDigits: 2
			})}:${date.getMinutes().toLocaleString("de", {
				minimumIntegerDigits: 2
			})}:${date.getSeconds().toLocaleString("de", {
				minimumIntegerDigits: 2
			})}`;

			$http.post("/", {
				username: $scope.username,
				message: $scope.message,
				time
			}).then((response) => {
				if (response.data === "success") {
					$scope.message = "";
					$http.get("messages.json").then((innerResponse) => {
						$scope.messages = innerResponse.data;

						$scope.$applyAsync();
					});
				}
			});
		}
		else {
			$("input").each((index, element) => {
				if ($(element).hasClass("ng-empty")) {
					$(element).addClass("ng-touched");
				}
			});
		}
	};

	window[`${$scope.name}Scope`] = $scope;
};

export default StartCtrl;
