import $ from "jquery";
import utils from "../utils.js";

/**
 * @name StartCtrl
 * @description
 * the main controller of the app
 * @param {any} $scope
 * angular scope
 * @param {any} $http
 * angular $http service
 * @param {any} $timeout
 * angular $timeout service
 */
const StartCtrl = function($scope, $http, $timeout) {
	"ngInject";

	// init values
	$scope.name = "start";
	$scope.username = "";
	$scope.message = "";
	$scope.image = "";
	$scope.imageInput = $("#image-upload");

	// ui functions
	$scope.openImagePreview = () => {
		$scope.imagePreviewShown = true;
	};

	$scope.closeImagePreview = () => {
		$scope.imagePreviewShown = false;
	};

	$scope.removeImage = () => {
		$scope.image = "";
		$scope.closeImagePreview();
	};

	$scope.scrollChat = () => {
		$timeout(() => {
			$("#chat").stop().animate({
				scrollTop: $("#chat")[0].scrollHeight
			}, 400);
		}, 400);
	};

	$scope.test = () => !$("#footer>input").hasClass("ng-empty");

	// functions for sending messages
	$scope.postMessage = (message) => {
		$http.post("/", message).then(() => {
			$("#message-input").removeClass("ng-touched");
			$scope.message = "";
			$scope.image = "";
			$("input#image-upload").val("");

			$scope.$applyAsync();
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

			if ($scope.image !== "") {
				message.image = {
					name: `${date.getTime()}.png`,
					file: $scope.image.split(",")[1]
				};
			}

			$scope.postMessage(message);
		}
		else {
			$("#footer>input").each((index, element) => {
				if ($(element).hasClass("ng-empty")) {
					$(element).addClass("ng-touched");
				}
			});
		}
	};


	// get stream of messages
	const source = new EventSource("/stream");

	source.addEventListener("message", (e) => {
		$scope.messages = JSON.parse(e.data);
		$scope.messages.forEach((message) => {
			message.chatTime = utils.dateToChatTime(new Date(message.time));
		});

		$scope.$applyAsync();
	}, false);
};

export default StartCtrl;
