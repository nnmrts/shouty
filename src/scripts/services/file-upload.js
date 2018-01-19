/**
 * @name fileUpload
 *
 * @param {any} $http angular $http service
 */
const fileUpload = function($http) {
	this.uploadFileToUrl = (file, uploadUrl) => {
		const fd = new FormData();
		fd.append("file", file);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {
				"Content-Type": undefined
			}
		})
			.success(() => {
			})
			.error(() => {
			});
	};
};

export default fileUpload;
