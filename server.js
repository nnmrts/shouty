const express = require("express");
const bodyParser = require("body-parser");
const jsonfile = require("jsonfile");
const useragent = require("express-useragent");
const fs = require("fs");
const sse = require("./sse.js");
const mkdirp = require("mkdirp");

mkdirp("./dist/images/", (err) => {
	if (err) {
		console.error(err);
	}
});

const app = express();
const connections = [];

app.set("port", (process.env.PORT || 9000));

app.use(express.static("./dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(sse);

app.enable("trust proxy");

/**
 * @name addToMessages
 *
 * @param {object} req
 * server request object
 * @param {object} res
 * server response object
 * @param {object} message
 * message object
 * @param {array} messages
 * messages array
 * @returns {promise}
 * promise that resolves after messages.json is saved
 */
const addToMessages = (req, res, message, messages) => {
	messages.push(Object.assign((() => {
		delete message.chatTime;
		if (message.image) {
			message.image = `images/${message.image.name}`;
		}

		return message;
	})(), {
		ip: req.ip,
		useragent: {
			browser: {
				name: useragent.parse(req.headers["user-agent"]).browser,
				version: useragent.parse(req.headers["user-agent"]).version
			},
			platform: {
				name: useragent.parse(req.headers["user-agent"]).platform,
				os: useragent.parse(req.headers["user-agent"]).os
			},
			source: useragent.parse(req.headers["user-agent"]).source
		}
	}));

	while (messages.length > 8) {
		messages.shift();
	}

	return jsonfile.writeFile("./dist/messages.json", messages, (innerError) => {
		if (innerError) {
			console.log(innerError);
		}
		connections.forEach((connection) => {
			connection.sseSend(messages);
		});
	});
};

jsonfile.readFile("./dist/messages.json", (error, messages) => {
	const newMessages = messages;

	app.post("/", (req, res) => {
		const message = req.body;

		console.log(message.image);

		if (message.image) {
			fs.writeFile(`./dist/images/${message.image.name}`, message.image.file, "base64", (err) => {
				if (err) {
					console.log(err);
				}

				addToMessages(req, res, message, newMessages);
			});
		}

		addToMessages(req, res, message, newMessages);
	});

	app.get("/stream", (req, res) => {
		res.sseSetup();
		res.sseSend(newMessages);
		connections.push(res);
	});
});

app.listen(app.get("port"), () => {
	console.log("App is running, server is listening on port ", app.get("port"));
});
