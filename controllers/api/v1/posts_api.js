const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
module.exports.index = (req, res) => {
	Post.find({})
		.sort("-createdAt")
		.populate("user")
		.populate({
			path: "comments",
			options: { sort: { createdAt: "descending" } },
			populate: {
				path: "user",
			},
		})
		.exec(function (err, posts) {
			return res.status(200).json({
				message: "List Of Posts",
				posts: posts,
			});
		});
};

module.exports.destroy = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.user == req.user.id) {
			post.remove();
			Comment.deleteMany({ post: req.params.id });
			return res.status(200).json({
				message: "post and associated comments deleted",
			});
		}
		else{
			return res.status(401).json({message:"You can't delete this post!!!"})
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error!!" });
	}
};
