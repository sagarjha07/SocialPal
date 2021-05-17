const User = require("../models/user");

module.exports.profile = (req, res) => {
	res.render("user_profile", { title: "Profile" });
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
module.exports.createSession = (req, res) => {};
