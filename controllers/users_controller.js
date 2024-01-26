const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const resetEmailWorker = require("../workers/resetPassword_mailer");
const queue = require("../config/kue");
const Token = require("../models/token");

module.exports.profile = function (req, res) {
  User.findById(req.params.id)
    .then((user) => {
      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user,
      });
    })
    .catch((err) => console.log(err));
};

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "InstaBook | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "InstaBook | Sign In",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  try {
    if (req.body.password !== req.body.confirm_password) {
      return res.redirect("back");
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const newUser = await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in signing up:", err);
    return res.redirect("back");
  }
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("Multer Error:", err);
        }

        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (error) {
      req.flash("error", error);
      return res.redirect("back");
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

//sign out
module.exports.destorySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error in logging out:", err);
      return;
    }
  });
  req.flash("success", "You have logged out!");

  return res.redirect("/");
};

//reset password

//render the forgot password page for user
module.exports.forgotPassword = function (req, res) {
  res.render("forgot_password", {
    title: "Reset Password",
  });
};

//create token and send link to email for password change
module.exports.resetPassword = async function (req, res) {
  // console.log(req.body);
  let user = await User.findOne({ email: req.body.email });
  //console.log(user);
  let token = await Token.create({ isValid: true, user: user });
  // let job = queue.create("reset", token).save(function (err) {
  //   if (err) {
  //     console.log("error in creating queue", err);
  //     return;
  //   }
  //   console.log("enqueued", job.id);
  // });
  res.render("reset_email_sent", {
    title: "Mail Inbox",
    data: token,
  });
};

//render the update password page
module.exports.changePassword = async function (req, res) {
  //  console.log("ainside cahnge password in user controller",req.params.id);
  let token = await Token.findById(req.params.id);
  if (!token || token.isValid == false) {
    res.render("user_sign_in", {
      title: "signIn",
    });
    return;
  } else {
    console.log(typeof req.params.id);
    // const userId =  new mongoose.Types.ObjectId(req.params.id);
    // console.log(typeof (userId));

    let token = await Token.findByIdAndUpdate(req.params.id, { isValid: true });
    console.log(token, "token");
    // let user = await User.findById(token.user);
    // console.log(user,'usercheck');
    res.render("changePassword", {
      title: "changePassword",
      user: token.user,
    });
  }
};

module.exports.updatePassword = async function (req, res) {
  console.log(req.params.id);
  console.log(req.body);
  const userId = new mongoose.Types.ObjectId(req.params.id);

  // let user = await User.findById(userId);

  const user = await User.findOne({ _id: userId });

  console.log(user);
  try {
    if (req.body.password != req.body.confirm_password) {
      console.log("password not matching");
      //console.log(req.body.password, req.body.confirm_password);
      return res.redirect("back");
    }
    // console.log(req.params.id,'params')
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
      console.log(user);
      res.render("user_sign_up", {
        title: "signUp",
      });
      return;
    } else {
      console.log(user);

      await User.findByIdAndUpdate(user.id, { password: req.body.password });
      console.log("changedddd******");
      console.log(user.password);
      res.render("user_sign_in", {
        title: "SignIn",
      });
    }
  } catch (error) {
    console.log("error ", error);
    return;
  }
};
