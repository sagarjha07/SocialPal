const nodeMailer = require("../config/nodemailer");
                
module.exports.accountVerify = (req,token,user) => {
	// console.log("Inside newComment mailer");
	let HTMLstring = nodeMailer.renderTemplate(
		{
			req:req,
			user:user,
			token:token
		},
		"/users/user_Activation.ejs"
	);
	nodeMailer.transporter.sendMail(
		{
			from: "sagarkumarjha19@gmail.com",
			to: user.email,
			subject: 'Account Verification Link',
			html: HTMLstring,
		},
		(err, info) => {
			if (err) console.log("Error in sending mail!!", err);
			// else console.log("Message Sent!!!", info);
		}
	);
};
