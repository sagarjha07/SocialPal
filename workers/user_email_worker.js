const queue = require("../config/kue");
const userMailer = require("../mailers/users_mailer");

queue.process("user_emails", function (job, done) {
	console.log("email worker is processing a job ", job.data);
	userMailer.accountVerify(job.data);
	done();
});
