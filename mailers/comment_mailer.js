const nodeMailer = require("../config/nodemailer");

// this is another way of exporting a method
exports.newComment = async (comment) => {
  //console.log("Inside newComment mailer", comment);

  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    "/comments/comment_mailer.ejs"
  );

  const info = await nodeMailer.transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: comment.user.email,
      subject: "New Comment Published: ",
      html: htmlString,
    },
    (error, info) => {
      if (error) {
        console.log("Error in sending mail", error);
        return;
      }
      return;
    }
  );
};
