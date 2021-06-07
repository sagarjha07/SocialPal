const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
module.exports.home = function (req, res) {
	// console.log(req.cookies);
	// res.cookie('user_id', 25);

	// Post.find({}, function(err, posts){
	//     return res.render('home', {
	//         title: "Codeial | Home",
	//         posts:  posts
	//     });
	// });

	// populate the user of each post
	Post.find({})
		.sort("-createdAt")
		.populate("user")
		.populate({
			path: "comments",
			options:{sort:{"createdAt":"descending"}},
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
				});
			});
		});
};

// module.exports.actionName = function(req, res){}
