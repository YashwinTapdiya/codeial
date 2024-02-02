const nodeMailer = require("../config/nodemailer");

exports.reset = (data) => {
  let htmlString = nodeMailer.renderTemplate(
    { data },
    "/resetPassword/reset_password.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: data.user.email,
      subject: "Link for Reset Password",
      html: htmlString,
    },
    (error, info) => {
      if (error) {
        console.log("error in sending mail", error);
        return;
      }
      return;
    }
  );
};
