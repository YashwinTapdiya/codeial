const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let testAccount = nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
  //service: 'gmail',
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "orlando.rau@ethereal.email",
    pass: "tDnEY8t681XBNHewqE",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering template");
        return;
      }

      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
