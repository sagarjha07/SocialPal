const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authentication using passport
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
		},
		function (email, password, done) {
			User.findOne({ email }, function (err, user) {
				if (err) {
					console.log("Error in finding User -->passport ", err);
					return done(err);
				}
				if (!user || user.password != password) {
					return done(null, false);
				}
				return done(null, user);
			});
		}
	)
);

//serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function (user, done) {
	done(null, user._id);
});

//desirializing the user from the key in cookie
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		if (err) {
			console.log("Error in finding User-->passport ", err);
			return done(err);
		}
		return done(null, user);
	});
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
	// if the user is signed-in
	if (req.isAuthenticated()) {
		return next();
	}
	//if the user is not signed in
	return res.redirect("/users/signin");
};

//set the user for use in locals
passport.setAuthenticatedUser = function (req, res, next) {
	if (req.isAuthenticated()) {
		//req.user contains the current signed in user from ther session cookie
		//and we are just sending this to the locals for views
		res.locals.user = req.user;
	}
	next();
};

//if the user is authenticated don't show the sign-up and sign-in page
passport.notAuthenticated=function(req,res,next){
	if(!req.isAuthenticated()){
		return next();
	}
	return res.redirect("/");
}

module.exports = passport;
