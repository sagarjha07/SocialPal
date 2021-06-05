const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/SocialPal_development", {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
	console.log("Connected to MongoDB");
});

module.exports = db;
