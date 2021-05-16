const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");

const PORT = 8000;

app.use(express.static("./assets"));

//express layout
app.use(expressLayout);

//extract style and scripts from sub-pages into the layout
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//use Routes
app.use("/", require("./routes"));

app.listen(PORT, (err) => {
	if (err) console.log("error in running server:", err);
	console.log("Server is running on port:", PORT);
});
