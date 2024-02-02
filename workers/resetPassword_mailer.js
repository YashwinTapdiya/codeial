const queue = require("../config/kue");
const resetMailer = require("../mailers/reset_password_mailer");

queue.process("reset", function (job, done) {
  resetMailer.reset(job.data);
  done();
});
