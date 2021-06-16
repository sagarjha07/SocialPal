const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const Token = require("../models/token");
const userMailer = require("../mailers/users_mailer");
const queue = require("../config/kue");
const userEmailWorker = require("../workers/user_email_worker");
const { stringify, parse } = require("flatted");
const { StringDecoder } = require("string_decoder");

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
		let user = await User.create({
			name,
			email,
			password: hashPassword,
		});
		let token = await Token.create({
			user_id: user._id,
			token: crypto.randomBytes(16).toString("hex"),
		});
		req.flash("success", "Verify Your Email Adress!!!");
		// userMailer.accountVerify(req, token, user);
		let data = {
			token: stringify(token),
			user: stringify(user),
		};
		let job = queue
			.create("user_emails", data)
			.priority("critical")
			.save(function (err) {
				if (err) {
					console.log("error in creating queue,", err);
					return;
				}
				console.log("user_email job enqueued", job.id);
			});

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

module.exports.verifyAccountLink = async (req, res) => {
	try {
		const token = await Token.findOne({ token: req.params.token });
		if (!token) {
			req.flash(
				"error",
				"Your verification link may have expired. Please click on resend for verify your Email..."
			);
			return res.redirect("/users/signin");
		} else {
			const user = await User.findOne({
				_id: token.user_id,
				email: req.params.email,
			});
			if (!user) {
				req.flash("error", "Unable to find the User....");
				return res.redirect("/users/signup");
			} else if (user.isVerified) {
				req.flash("success", "User is Already Verified....");
				return res.redirect("/users/signin");
			} else {
				user.isVerified = true;
				await user.save();
				req.flash("success", "User Verified....");
				return res.redirect("/users/signin");
			}
		}
	} catch (error) {
		req.flash("error", "Internal Server Error!!!");
		console.log("Error in verification", error);
	}
};

module.exports.resendLink = (req, res) => {};
