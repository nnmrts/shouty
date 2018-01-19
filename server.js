const express = require("express");
const bodyParser = require("body-parser");
const jsonfile = require("jsonfile");
const useragent = require("express-useragent");
const path = require("path");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
	destination: "./uploads/",
	filename(req, file, cb) {
		cb(null, `${file.originalname.replace(path.extname(file.originalname), "")}-${Date.now()}${path.extname(file.originalname)}`);
	}
});

const upload = multer({
	storage
});

app.set("port", (process.env.PORT || 9000));

app.use(express.static("./dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.enable("trust proxy");

app.post("/", (req, res) => {
	jsonfile.readFile("./dist/messages.json", (error, messages) => {
		const newMessages = messages;

		newMessages.push(Object.assign(() => {
			delete req.body.chatTime;

			return req.body;
		}, {
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

		jsonfile.writeFile("./dist/messages.json", newMessages, () => {
			res.send("success");
		});
	});
});

app.post("/image", upload.single("file"), (req) => {
	console.log("Uploade Successful ", req.file, req.body);
});

app.listen(app.get("port"), () => {
	console.log("App is running, server is listening on port ", app.get("port"));
});
