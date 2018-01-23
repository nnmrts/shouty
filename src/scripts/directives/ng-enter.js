/**
 * @name ngEnter
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
