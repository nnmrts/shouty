/**
 * @name ngEnter
 *
 * @param {any} scope angular scope
 * @param {any} element elementer which is focused when enter is pressed
 * @param {any} attrs attributes of element
 */
const ngEnter = (scope, element, attrs) => {
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
