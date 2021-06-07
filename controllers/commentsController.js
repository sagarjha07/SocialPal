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
			if (req.xhr) {
				return res.status(200).json({
					data: {
						comment: comment,
					},
					message: "Comment created!!!",
				});
			}
			req.flash("success","Comment added!!!")
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
			path:'post',
			populate:{
				path:'user',
			}
		});
		if (comment.user==req.user.id || comment.post.user.id==req.user.id) {
			let postId = comment.post;
			comment.remove();
			Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
			if(req.xhr){
				return res.status(200).json({
					data:{
						comment_id:req.params.id
					},
					message:"Comment deleted!!!"
				});
			}
			req.flash("success","Comment deleted!!!");
		}
		return res.redirect("back");
	} catch (error) {
        console.log("error in deleting comment",error);
        return res.redirect("back");
    }
};
