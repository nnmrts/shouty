import Pica from "pica";

const pica = new Pica();

/**
 * @name ngImage
 *
 * @returns {object}
 * angular directive
 */
const ngImage = () => {
	/**
	 * @name createCanvas
	 *
	 * @param {file} image
	 * image file
	 * @returns {element}
	 * canvas
	 */
	const createCanvas = (image, {
		maxWidth,
		maxHeight
	} = {
			maxWidth: 500,
			maxHeight: 500
		}) => {
		const canvas = document.createElement("canvas");

		canvas.style.visibility = "hidden";
		canvas.style.position = "absolute";
		canvas.style.top = "-300px";

		document.body.appendChild(canvas);

		const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);

		canvas.width = Math.round(image.width * ratio);
		canvas.height = Math.round(image.height * ratio);

		return canvas;
	};

	/**
	 * @name fileToDataURL
	 *
	 * @param {blob} blob
	 * blob
	 * @returns {promise}
	 * promise that resolves after the dataUrl was generated
	 */
	const blobToDataUrl = blob => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});


	/**
	 * @name resizeImage
	 *
	 * @param {image} blob
	 * blob of original image
	 * @param {object} options
	 * options for resizing the image
	 * @param {function} callback
	 * function that gets called after the image is resized
	 */
	const resizeImage = (blob, options, callback) => {
		blobToDataUrl(blob).then((dataUrl) => {
			const imageElement = new Image();

			imageElement.addEventListener("load", () => {
				const canvas = createCanvas(imageElement, options);

				pica.resize(imageElement, canvas, {
					alpha: true
				})
					.then((resizedCanvas) => {
						pica.toBlob(resizedCanvas, "image/png", 0.8).then((resizedBlob) => {
							blobToDataUrl(resizedBlob).then((resizedDataUrl) => {
								callback(resizedDataUrl, resizedBlob);
							});
						});
					});
			}, false);

			imageElement.src = dataUrl;
		});
	};

	return {
		restrict: "A",
		scope: {
			ngImage: "=",
			maxHeight: "@?",
			maxWidth: "@?",
			resizeQuality: "@?",
			resizeType: "@?",
		},
		link(scope, element) {
			element.bind("change", (evt) => {
				scope.$apply(() => {
					scope.ngImage = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJsb2FkZXItMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQogICAgIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAgNTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTQzLjkzNSwyNS4xNDVjMC0xMC4zMTgtOC4zNjQtMTguNjgzLTE4LjY4My0xOC42ODNjLTEwLjMxOCwwLTE4LjY4Myw4LjM2NS0xOC42ODMsMTguNjgzaDQuMDY4YzAtOC4wNzEsNi41NDMtMTQuNjE1LDE0LjYxNS0xNC42MTVjOC4wNzIsMCwxNC42MTUsNi41NDMsMTQuNjE1LDE0LjYxNUg0My45MzV6Ij4NCiAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVUeXBlPSJ4bWwiDQogICAgICBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iDQogICAgICB0eXBlPSJyb3RhdGUiDQogICAgICBmcm9tPSIwIDI1IDI1Ig0KICAgICAgdG89IjM2MCAyNSAyNSINCiAgICAgIGR1cj0iMC42cyINCiAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+DQogICAgPC9wYXRoPg0KICA8L3N2Zz4=";

					scope.$parent.openImagePreview();
				});

				const image = evt.target.files[0];

				if (image) {
					resizeImage(image, scope, (resizedDataUrl) => {
						scope.$apply(() => {
							scope.ngImage = resizedDataUrl;
						});
					});
				}
			});
		}
	};
};

export default ngImage;
