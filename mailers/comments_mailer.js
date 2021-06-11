const nodeMailer = require("../config/nodemailer");

module.exports.newComment = (comment) => {
	// console.log("Inside newComment mailer");
	let HTMLstring = nodeMailer.renderTemplate(
		{
			comment: comment,
		},
		"/comments_template/new_comment.ejs"
	);
	nodeMailer.transporter.sendMail(
		{
			from: "sagarkumarjha19@gmail.com",
			to: comment.user.email,
			subject: "New Comment published",
			html: HTMLstring,
		},
		(err, info) => {
			if (err) console.log("Error in sending mail!!", err);
			// else console.log("Message Sent!!!", info);
		}
	);
};
