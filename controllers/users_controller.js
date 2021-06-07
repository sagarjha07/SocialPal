const User = require("../models/user");

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
module.exports.createSession = (req, res) => {
	req.flash('success',"Logged In Succesfully..");
	return res.redirect("/");
};

module.exports.signout = (req, res) => {
	req.logout();
	req.flash('success',"You have Logged Out..."); 
	return res.redirect("/users/signin");
};


module.exports.updateProfile=(req,res)=>{
	if(req.user.id==req.params.id){
		User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
			req.flash("success","Profile Updated...")
			return res.redirect("back");
		})
	}else{
		req.flash("error","You can't update the profile!!!")
		return res.status(401).send('Unauthorized'); 
	}
}
