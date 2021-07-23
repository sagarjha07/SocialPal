const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
//used for session-cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const mongoose = require("mongoose");
//connect-mongo
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMiddlewareFlash = require("./config/middleware");

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
console.log("chat server is listening on port 5000");

const PORT = 8000;

app.use(
	sassMiddleware({
		src: "./assets/scss",
		dest: "./assets/css",
		debug: true,
		outputStyle: "extended",
		prefix: "/css",
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static("./assets"));
//make the uploads path available for the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

//express layout
app.use(expressLayout);

//extract style and scripts from sub-pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store the session cookie in the db
app.use(
	session({
		name: "SocialPal",
		secret: "sagarkumarjha",
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 100,
		},
		store: MongoStore.create(
			{
				mongoUrl: mongoose.connection._connectionString,
				autoRemove: "disabled",
			},
			(err) => {
				console.log(err || "connect-mongodb setup OK");
			}
		),
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
//custom middleware for setting flash message into locals;
app.use(customMiddlewareFlash.setFlash);

//use Routes
app.use("/", require("./routes"));

chatServer.listen(PORT, (err) => {
	if (err) console.log("error in running server:", err);
	console.log("Server is running on port:", PORT);
});
