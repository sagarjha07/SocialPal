const Post = require("../models/post");
const Comment = require("../models/comment");
const queue = require("../config/kue");
const postEmailWorker = require("../workers/post_email_worker");
module.exports.createPost = async (req, res) => {
	try {
		let newPost = await Post.create({
			content: req.body.content,
			user: req.user._id,
		});
		newPost = await newPost.populate("user", "name email").execPopulate();
		let job = queue
			.create("posts_emails", newPost)
			.priority("high")
			.save(function (err) {
				if (err) {
					console.log("error in creating post queue");
					return;
				}
			});
		if (req.xhr) {
			return res.status(200).json({
				data: {
					post: newPost,
				},
				message: "Post created!!!",
			});
		}

		req.flash("success", "Post Published!!!");
		return res.redirect("/");
	} catch (err) {
		if (err) {
			req.flash("error", "Error in creating post!!");
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
			if (req.xhr) {
				return res.status(200).json({
					data: {
						post_id: req.params.id,
					},
					message: "Post Deleted",
				});
			}
		}
		req.flash("success", "Post Deleted!!");
		return res.redirect("back");
	} catch (error) {
		req.flash("error", "You can't delete the Post!!!");
		return res.redirect("back");
	}
};
