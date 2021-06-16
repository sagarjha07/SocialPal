const queue = require("../config/kue");
const postMailer = require("../mailers/post_mailers");

queue.process("posts_emails", function (job, done) {
	// console.log("email worker is processing a job ", job.data);
	postMailer.newPost(job.data);
	done();
});
