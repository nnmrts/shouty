const express = require("express");
const bodyParser = require("body-parser");
const jsonfile = require("jsonfile");
const useragent = require("express-useragent");
const multer = require("multer");
const fs = require("fs");
const sse = require("./sse.js");

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

jsonfile.readFile("./dist/messages.json", (error, messages) => {
	const newMessages = messages;

	app.post("/", (req, res) => {
		const message = req.body;

		console.log(message);

		fs.writeFile(`./dist/images/${message.image.name}`, message.image.file, "base64", (err) => {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");


			newMessages.push(Object.assign((() => {
				delete message.chatTime;
				message.image = `images/${message.image.name}`;

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

			while (newMessages.length > 8) {
				newMessages.shift();
			}

			return jsonfile.writeFile("./dist/messages.json", newMessages, (innerError) => {
				if (innerError) {
					return console.log(innerError);
				}
				connections.forEach((connection) => {
					connection.sseSend(newMessages);
				});

				// res.sendStatus(200);

				// return res.send("success");
			});
		});
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
