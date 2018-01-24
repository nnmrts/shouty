/**
 * @name ngEnter
 * @description
 * executes a given function when pressing enter in the container this
 * directive is attached on
 * @returns {function}
 * directive function
 */
const ngEnter = () => (scope, element, attrs) => {
	element.bind("keydown keypress", (event) => {
		if (event.which === 13) {
			scope.$apply(() => {
				scope.$eval(attrs.ngEnter);
			});
			event.preventDefault();
		}
	});
};

export default ngEnter;
