const utils = {
	/**
	 * @name dateToString
	 * @description
	 * converts a javascript date to a date-time string in the ISO 8601 format
	 *
	 * ### Fri Jan 19 2018 05:08:48 GMT+0100 (CET)
	 * ### gets...
	 * ### "2018-01-19T05:08:48"
	 *
	 * @param {date} date
	 * a javascript date object
	 * @returns {string}
	 * date-time string
	 */
	dateToString(date) {
		return `${date.getFullYear()}-${(date.getMonth() + 1).toLocaleString("de", {
			minimumIntegerDigits: 2
		})}-${date.getDate().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}T${date.getHours().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}:${date.getMinutes().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}:${date.getSeconds().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}`;
	},

	/**
	 * @name dateToChatTime
	 * @description
	 * converts a javascript date to a date-time string for the shoutbox chat
	 *
	 * ### Fri Jan 19 2018 05:08:48 GMT+0100 (CET)
	 * ### gets...
	 * ### "19.01.2018\n05:08:48"
	 *
	 * @param {date} date
	 * a javascript date object
	 * @returns {string}
	 * date-time string with line break
	 */
	dateToChatTime(date) {
		return `${date.getDate().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}.${(date.getMonth() + 1).toLocaleString("de", {
			minimumIntegerDigits: 2
		})}.${date.getFullYear()}\n${date.getHours().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}:${date.getMinutes().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}:${date.getSeconds().toLocaleString("de", {
			minimumIntegerDigits: 2
		})}`;
	}
};

export default utils;
