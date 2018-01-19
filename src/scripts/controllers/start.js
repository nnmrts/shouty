import $ from "jquery";
import { dateToString, dateToChatTime } from "../utils.js";

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
			$http.post("/", {
				username: $scope.username,
				message: $scope.message,
				time: dateToString(new Date()),
				chatTime: dateToChatTime(new Date())
			}).then((response) => {
				if (response.data === "success") {
					$("#message-input").removeClass("ng-touched");
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
