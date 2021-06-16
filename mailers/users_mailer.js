const nodeMailer = require("../config/nodemailer");
const { parse } = require("flatted");
module.exports.accountVerify = (data) => {
	// console.log("Inside newComment mailer");
	let user = parse(data.user);
	let token = parse(data.token);
	let HTMLstring = nodeMailer.renderTemplate(
		{
			user: user,
			token: token,
		},
		"/users/user_Activation.ejs"
	);
	nodeMailer.transporter.sendMail(
		{
			from: "sagarkumarjha19@gmail.com",
			to: user.email,
			subject: "Account Verification Link",
			html: HTMLstring,
		},
		(err, info) => {
			if (err) console.log("Error in sending mail!!", err);
			// else console.log("Message Sent!!!", info);
		}
	);
};

module.exports.changePasswordLink = (data) => {
	let user = parse(data.user);
	let token = parse(data.token);
	let HTMLstring = nodeMailer.renderTemplate(
		{
			user: user,
			token: token,
		},
		"/users/reset_pass_template.ejs"
	);
	nodeMailer.transporter.sendMail(
		{
			from: "sagarkumarjha19@gmail.com",
			to: user.email,
			subject: "Reset Password Link...",
			html: HTMLstring,
		},
		(err, info) => {
			if (err) console.log("Error in sending mail!!", err);
			// else console.log("Message Sent!!!", info);
		}
	);
};
