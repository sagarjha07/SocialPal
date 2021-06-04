const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async (req, res) => {
	try {
		const post = await Post.findById(req.body.post);
		if (post) {
			const comment = await Comment.create({
				content: req.body.content,
				post: req.body.post,
				user: req.user._id,
			});
			post.comments.push(comment);
			post.save();
			res.redirect("/");
		}
	} catch (err) {
		console.log("Error in adding comment", err);
		return res.redirect("back");
	}
};

module.exports.destroy = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (comment.user == req.user.id) {
			let postId = comment.post;
			comment.remove();
			Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
		}
		return res.redirect("back");
	} catch (error) {
        console.log("error in deleting comment",error);
        return res.redirect("back");
    }
};
