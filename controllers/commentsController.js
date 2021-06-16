const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");

module.exports.create = async (req, res) => {
	try {
		const post = await Post.findById(req.body.post);
		if (post) {
			let comment = await Comment.create({
				content: req.body.content,
				post: req.body.post,
				user: req.user._id,
			});
			post.comments.push(comment);
			post.save();
			comment = await comment.populate("user", "name email").execPopulate();
			// commentsMailer.newComment(comment);

			//sending the task to comment_email_worker in queue
			let job = queue.create("comments_emails", comment).save((err) => {
				if (err) {
					console.log("error in creating queue");
					return;
				}
				// console.log("Job enqueued ", job.id);
			});

			if (req.xhr) {
				return res.status(200).json({
					data: {
						comment: comment,
					},
					message: "Comment created!!!",
				});
			}
			req.flash("success", "Comment added!!!");
			res.redirect("back");
		}
	} catch (err) {
		console.log("Error in adding comment", err);
		return res.redirect("back");
	}
};

module.exports.destroy = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id).populate({
			path: "post",
			populate: {
				path: "user",
			},
		});
		if (comment.user == req.user.id || comment.post.user.id == req.user.id) {
			let postId = comment.post;
			comment.remove();
			Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
			if (req.xhr) {
				return res.status(200).json({
					data: {
						comment_id: req.params.id,
					},
					message: "Comment deleted!!!",
				});
			}
			req.flash("success", "Comment deleted!!!");
		}
		return res.redirect("back");
	} catch (error) {
		console.log("error in deleting comment", error);
		return res.redirect("back");
	}
};
