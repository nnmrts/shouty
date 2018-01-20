/**
 * @name betterLinky
 *
 * @returns {string}
 * text with clickable links
 */
const betterLinky = () => {
	const emailPattern = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gim;

	const pattern = /((?:(?:\s+)|(?:(?:\S+?)\s*))?)((?:(?:(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?)|(?:www\.?)|(?:))(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,})?(?:[/?#]\S*)?)((?:(?:\s+))?)(?!.?(?:"|(?:<\/)))/gim;

	return (text) => {
		const newText = text.replace(emailPattern, "<a href=\"mailto:$&\">$&</a>").replace(pattern, "$1<a href=\"$2\" target=\"_blank\">$2</a>$3");

		return newText;
	};
};

export default betterLinky;
