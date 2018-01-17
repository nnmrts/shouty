const express = require("express");
const openAdb = require("./open-adb.js");

const app = express();

app.use(express.static("./"));y

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}index.html`);
});

const i = 49900;

app.get("/scrape", async function(req, res) {
	await openAdb.scrape(req, res, i);
});

app.listen(9000, () => {
	console.log("shouty listening on port 9000!");
});
