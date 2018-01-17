const express = require("express");

const app = express();

app.use(express.static("./"));

app.post("send", (req, res) => {
	console.log(res);
	console.log("SENT MESSAGE");
});

app.listen(9000, () => {
	console.log("shouty listening on port 9000!");
});
