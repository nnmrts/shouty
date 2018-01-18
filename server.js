const express = require("express");
const bodyParser = require("body-parser");
const jsonfile = require("jsonfile");
const useragent = require("express-useragent");

const app = express();

app.set("port", (process.env.PORT || 9000));

app.use(express.static("./dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.enable("trust proxy");

app.post("/", (req, res) => {
	jsonfile.readFile("./dist/messages.json", (error, messages) => {
		const body = {
			username: req.body.username,
			message: req.body.message,
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
		};

		messages.push(body);

		jsonfile.writeFile("./dist/messages.json", messages, () => {
			res.send("success");
		});
	});
});

app.listen(app.get("port"), () => {
	console.log("App is running, server is listening on port ", app.get("port"));
});
