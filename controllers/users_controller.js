module.exports.profile = (req, res) => {
	res.render("user_profile",{title:"Profile"});
};

module.exports.signUp=(req,res)=>{
	return res.render("signup", { title: "SignUp" });
}

module.exports.signIn=(req,res)=>{
	return res.render("signin", { title: "Login" });
}

module.exports.create=(req,res)=>{
	
};

module.exports.createSession=(req,res)=>{

};


