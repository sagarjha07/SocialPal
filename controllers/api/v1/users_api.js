const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

module.exports.createSession = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (!user || user.password != req.body.password) {
			return res.status(422).json({
				message: "Invalid Credentials",
			});
		} else {
			return res.status(200).json({
				message: "Sign-In Successful, Here is your token!!!",
				data: {
					token: jwt.sign(user.toJSON(), "SagarJhasecret", {
						expiresIn: "100000",
					}),
				},
			});
		}
	} catch (error) {
		console.log("******", error);
		return res.status(500).json({
			message: "internal server error",
		});
	}
};
