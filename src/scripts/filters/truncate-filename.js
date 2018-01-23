/**
 * @name truncateFilename
 *
 * @param {string} filename
 * filename
 * @param {number} max
 * maximum character count
 * @param {string} ellipsis
 * string that gets inserted in place of the removed characters
 * @returns {strign}
 * truncated filename if filename is bigger than max
 */
const truncateFilename = () => (filename, max, ellipsis = "…") => {
	if (filename) {
		if (/\./.test(filename.slice(-6))) {
			const extension = filename.replace(/(.*)\./, "");

			if (filename.length > max) {
				return `${filename.substr(0, (max - extension.length))}${ellipsis}.${extension}`;
			}

			return filename;
		}

		throw new Error("[truncateFilename]: given string is not a valid filename");
	}

	return undefined;
};

export default truncateFilename;
