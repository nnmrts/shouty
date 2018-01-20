import $ from "jquery";
import utils from "../utils.js";

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

	// $scope.getMessages = () => {
	// 	$http.get("messages.json").then((response) => {
	// 		$scope.messages = response.data;


	// 		$scope.$applyAsync();
	// 	});
	// };

	if (window.EventSource) {
		const source = new EventSource("/stream");

		source.addEventListener("message", (e) => {
			$scope.messages = JSON.parse(e.data);
			$scope.messages.forEach((message) => {
				message.chatTime = utils.dateToChatTime(new Date(message.time));
			});
			$scope.$applyAsync();
		}, false);
	}
	else {
		console.log("Your browser doesn't support SSE");
	}

	// $scope.getMessages();


	$scope.username = "";
	$scope.message = "";

	$scope.test = () => !$("input").hasClass("ng-empty");

	$scope.postMessage = (message) => {
		$http.post("/", message).then((response) => {
			if (response.data === "success") {
				$("#message-input").removeClass("ng-touched");
				$scope.message = "";
				$scope.image = "";

				$scope.$applyAsync();
				// $scope.getMessages();
			}
		});
	};

	$scope.sendMessage = () => {
		if ($scope.test()) {
			const date = new Date();

			const message = {
				username: $scope.username,
				message: $scope.message,
				time: utils.dateToString(date),
				chatTime: utils.dateToChatTime(date)
			};

			if ($scope.image !== null) {
				message.image = {
					name: `${date.getTime()}.${$scope.image.file.type.replace(/(.*?)\//, "")}`,
					file: $scope.image.resized.dataURL.split(",")[1]
				};
			}

			$scope.postMessage(message);
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
