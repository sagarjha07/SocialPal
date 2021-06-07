const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.createPost = async (req, res) => {
	try {
		const newPost = await Post.create({
			content: req.body.content,
			user: req.user._id,
		});
		req.flash("success","Post Published!!!");
		return res.redirect("/");
	} catch (err) {
		if (err) {
			req.flash("error","Error in creating post!!");
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
		req.flash("success","Post Deleted!!");
		return res.redirect("back");
	} catch (error) {
		req.flash("error","You can delete the Post!!!");
		return res.redirect("back");
	}
};
