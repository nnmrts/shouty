const express = require("express");
const shouty = require("./shouty.js");

const app = express();

app.use((req, res) => {
	console.log(req);
	res.sendFile(`${__dirname}index.html`);
	shouty.init();
});

app.get("", (req, res) => {
	console.log(req.headers);
	shouty.init();
	res.sendFile(`${__dirname}index.html`);
});

app.listen(9000, () => {
	console.log("shouty listening on port 9000!");
});
