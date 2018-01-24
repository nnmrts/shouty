/**
 * @name sse
 * @description
 * express middleware for server side events
 *
 * @param {any} req
 * middleware req object
 * @param {any} res
 * middleware res object
 * @param {any} next
 * middleware next function
 */
const sse = (req, res, next) => {
	res.sseSetup = () => {
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive"
		});
	};

	res.sseSend = function(data) {
		res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	next();
};

module.exports = sse;
