const User = require("../models/user");

module.exports.profile = (req, res) => {
	if (req.cookies.user_id) {
		User.findById(req.cookies.user_id, (err, user) => {
			if (user) {
				return res.render("user_profile", {
					title: "User profile",
					user: user,
				});
			} else {
				return res.redirect("/users/signin");
			}
		});
	} else {
		return res.redirect("/users/signin");
	}
};

module.exports.signUp = (req, res) => {
	return res.render("signup", { title: "SignUp" });
};

module.exports.signIn = (req, res) => {
	return res.render("signin", { title: "Login" });
};

//signup
module.exports.create = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!email || !name || !password) {
			return res.redirect("back");
		}

		const existinguser = await User.findOne({ email });
		if (existinguser) {
			return res.redirect("back");
		}
		const user = await User.create({
			name,
			email,
			password,
		});
		return res.redirect("/users/signin");
	} catch (err) {
		console.log("Error in user signUp", err);
		return res.redirect("/users/signup");
	}
};

//sign-in
module.exports.createSession = async (req, res) => {
	try {
		//find the user
		//handle user found
		//handle mismatching password
		//handle session creation
		//handle user not found
		const { email, password } = req.body;
		const existinguser = await User.findOne({ email });
		if (!existinguser) {
			return res.redirect("back");
		}
		if (existinguser.password != password) {
			return res.redirect("back");
		}
		//session creation
		res.cookie("user_id", existinguser.id);
		return res.redirect("/users/profile");
	} catch (err) {
		console.log("Error in user signIn", err);
		return res.redirect("/users/signin");
	}
};

//signout
module.exports.signout = (req, res) => {
	res.clearCookie("user_id");
	return res.redirect("/users/signin");
};
