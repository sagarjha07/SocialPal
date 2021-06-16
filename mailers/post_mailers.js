const nodeMailer = require("../config/nodemailer");

module.exports.newPost = (post) => {
	// console.log("Inside newComment mailer");
	let HTMLstring = nodeMailer.renderTemplate(
		{
			post: post,
		},
		"/posts_template/new_post.ejs"
	);
	nodeMailer.transporter.sendMail(
		{
			from: "sagarkumarjha19@gmail.com",
			to: post.user.email,
			subject: "New Post published..",
			html: HTMLstring,
		},
		(err, info) => {
			if (err) console.log("Error in sending mail!!", err);
			// else console.log("Message Sent!!!", info);
		}
	);
};
