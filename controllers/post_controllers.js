const Post = require("../models/post");
const Comment = require("../models/comment");
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

module.exports.destroy = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.user == req.user.id) {
			post.remove();
			Comment.deleteMany({ post: req.params.id });
		}
		return res.redirect("back");
	} catch (error) {
		console.log("error in deleting post",error);
		return res.redirect("back");
	}
};
