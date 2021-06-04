const Post = require("../models/post");

module.exports.createPost = async (req, res) => {
	try {
		const newPost = await Post.create({
			content: req.body.content,
			user: req.user._id,
		});
		return res.redirect("/");
	} catch (err) {
		if (err) {
			console.log("error in creating a post");
			return res.redirect("back");
		}
	}
};
