/**
 * @name fileModel
 *
 * @param {any} $parse angular $parse service
 * @returns {object} service object
 */
const fileModel = $parse => ({
	restrict: "A",
	link(scope, element, attrs) {
		const model = $parse(attrs.fileModel);
		const modelSetter = model.assign;
		element.bind("change", () => {
			scope.$apply(() => {
				modelSetter(scope, element[0].files[0]);
			});
		});
	}
});

export default fileModel;
