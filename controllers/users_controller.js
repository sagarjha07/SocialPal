const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Token=require("../models/token");

module.exports.profile = (req, res) => {
	User.findById(req.params.id, function (err, user) {
		return res.render("user_profile", { title: "Profile", profile_user: user });
	});
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
			req.flash("error", "Email Already Exists!!!");
			return res.redirect("back");
		}
		const hashPassword = await bcrypt.hashSync(password, 12);
		const user = await User.create({
			name,
			email,
			password: hashPassword,
		});
		let token= await Token.create({
			user_id:user._id,
			token:dd,
		})
		return res.redirect("/users/signin");
	} catch (err) {
		console.log("Error in user signUp", err);
		return res.redirect("/users/signup");
	}
};

//sign-in
module.exports.createSession = (req, res) => {
	req.flash("success", "Logged In Succesfully..");
	return res.redirect("/");
};

module.exports.signout = (req, res) => {
	req.logout();
	req.flash("success", "You have Logged Out...");
	return res.redirect("/users/signin");
};

module.exports.updateProfile = async (req, res) => {
	try {
		if (req.user.id == req.params.id) {
			let user = await User.findById(req.params.id);
			User.uploadedAvatar(req, res, function (err) {
				if (err) console.log("*****MULTER ERROR", err);
				user.name = req.body.name;
				user.email = req.body.email;
				if (req.file) {
					if (user.avatar) {
						fs.unlinkSync(path.join(__dirname, "..", user.avatar));
					}
					//saving the path of the uploaded file into the avatar field int the user
					user.avatar = User.avatarPath + "/" + req.file.filename;
				}
				user.save();
				req.flash("success", "Profile Updated...");
				return res.redirect("back");
			});
		} else {
			req.flash("error", "You can't update the profile!!!");
			return res.status(401).send("Unauthorized");
		}
	} catch (error) {}
};
