const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
module.exports.home = async function (req, res) {
	// console.log(req.cookies);
	// res.cookie('user_id', 25);

	// Post.find({}, function(err, posts){
	//     return res.render('home', {
	//         title: "Codeial | Home",
	//         posts:  posts
	//     });
	// });

	let users = await User.find({});
	let friends;
	if (req.user) {
		friends = await User.find({ friendships: req.user.id });
	}
	// populate the user of each post
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
			User.find({}, function (err, users) {
				return res.render("home", {
					title: "SocialPal | Home",
					posts: posts,
					all_users: users,
					friendships:friends
				});
			});
		});
};

// module.exports.actionName = function(req, res){}
