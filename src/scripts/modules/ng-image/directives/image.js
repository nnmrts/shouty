/**
 * @name image
 *
 * @param {any} $q
 * angular $q service
 * @returns {object}
 * angular directive
 */
const image = ($q) => {
	"use strict";

	const URL = window.URL || window.webkitURL;


	/**
	 * @name getResizeArea
	 *
	 * @returns {object} element that represents the resize area
	 */
	const getResizeArea = () => {
		const resizeAreaId = "fileupload-resize-area";

		let resizeArea = document.getElementById(resizeAreaId);

		if (!resizeArea) {
			resizeArea = document.createElement("canvas");
			resizeArea.id = resizeAreaId;
			resizeArea.style.visibility = "hidden";
			resizeArea.style.position = "absolute";
			resizeArea.style.top = "-300px";
			document.body.appendChild(resizeArea);
		}

		return resizeArea;
	};


	/**
	 * @name resizeImage
	 *
	 * @param {image} origImage
	 * image
	 * @param {object} options
	 * options for resizing the image
	 * @returns {string} dataUrl of canvas
	 */
	const resizeImage = (origImage, options) => {
		const maxHeight = options.resizeMaxHeight || 300;
		const maxWidth = options.resizeMaxWidth || 250;
		const quality = options.resizeQuality || 0.7;
		const type = options.resizeType || "image/jpg";

		const canvas = getResizeArea();

		let height = origImage.height;
		let width = origImage.width;

		// calculate the width and height, constraining the proportions
		if (width > height) {
			if (width > maxWidth) {
				height = Math.round(height *= maxWidth / width);
				width = maxWidth;
			}
		}
		else if (height > maxHeight) {
			width = Math.round(width *= maxHeight / height);
			height = maxHeight;
		}

		canvas.width = width;
		canvas.height = height;

		// draw image on canvas
		const ctx = canvas.getContext("2d");
		ctx.drawImage(origImage, 0, 0, width, height);

		// get the data from canvas as 70% jpg (or specified type).
		return canvas.toDataURL(type, quality);
	};


	/**
	 * @name createImage
	 *
	 * @param {string} url
	 * url of image
	 * @param {function} callback
	 * function that gets called after the image is loaded
	 */
	const createImage = (url, callback) => {
		const imageFile = new Image();
		imageFile.onload = () => {
			callback(imageFile);
		};
		imageFile.src = url;
	};


	/**
	 * @name fileToDataURL
	 *
	 * @param {file} file
	 * file
	 * @returns {promise}
	 * promise that resolves to the dataUrl of the file
	 */
	const fileToDataURL = (file) => {
		const deferred = $q.defer();
		const reader = new FileReader();
		reader.onload = (e) => {
			deferred.resolve(e.target.result);
		};
		reader.readAsDataURL(file);
		return deferred.promise;
	};


	return {
		restrict: "A",
		scope: {
			image: "=",
			resizeMaxHeight: "@?",
			resizeMaxWidth: "@?",
			resizeQuality: "@?",
			resizeType: "@?",
		},
		link(scope, element) {
			/**
			 * @name resize
			 *
			 * @param {object} imageResult
			 * imageResult object
			 * @param {function} callback
			 * function that gets called after the resized image is created
			 */
			const resize = (imageResult, callback) => {
				createImage(imageResult.url, (imageFile) => {
					const dataURL = resizeImage(imageFile, scope);
					imageResult.resized = {
						dataURL,
						type: dataURL.match(/:(.+\/.+);/)[1],
					};
					callback(imageResult);
				});
			};


			/**
			 * @name applyScope
			 *
			 * @param {object} imageResult
			 * imageResult object
			 */
			const applyScope = (imageResult) => {
				scope.$apply(() => {
					scope.image = imageResult;
				});
			};


			element.bind("change", (evt) => {
				const files = evt.target.files;

				const imageResult = {
					file: files[0],
					url: URL.createObjectURL(files[0])
				};

				fileToDataURL(files[0]).then((dataURL) => {
					imageResult.dataURL = dataURL;
				});

				if (scope.resizeMaxHeight || scope.resizeMaxWidth) { // resize image
					resize(imageResult, (result) => {
						applyScope(result);
					});
				}
				else { // no resizing
					applyScope(imageResult);
				}
			});
		}
	};
};

export default image;
