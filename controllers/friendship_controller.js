const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.createFriensdhip = async function (req, res) {
	try {
		let toUser = await User.findById(req.params.id);
		let fromUser = await User.findById(req.user.id);

		if (!fromUser.friendships.includes(req.params.id)) {
			fromUser.friendships.push(req.params.id);
			fromUser.save();
			toUser.friendships.push(req.user.id);
			toUser.save();

			req.flash("success", "Friend Added Successfully");
		} else {
			req.flash("error", "Friend already exists");
		}
		return res.redirect("back");
	} catch (err) {
		console.log("Error in creating friend", err);
		return res.redirect("back");
	}
};

module.exports.destroyFriendship = async function (req, res) {
	let reqFriend = await User.findById(req.user.id);
	let resFriend = await User.findById(req.params.id);

	let index = reqFriend.friendships.indexOf(req.params.id);
	reqFriend.friendships.splice(index, 1);
	reqFriend.save();

	index = resFriend.friendships.indexOf(req.user.id);
	resFriend.friendships.splice(index, 1);
	resFriend.save();

	req.flash("success", "Friendship Deleted Successfully");
	return res.redirect("back");
};
