const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Friendship = require("../models/friendship");
const User = require("../models/user");
const resetEmailWorker = require("../workers/resetPassword_mailer");
const queue = require("../config/kue");
const Token = require("../models/token");

module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    let friend1 = await Friendship.findOne({
      from_user: req.params.id,
      to_user: req.user.id,
    });
    let friend2 = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.params.id,
    });
    let friends = false;
    if (friend1 || friend2) {
      friends = true;
    }
    return res.render("user_profile", {
      title: "Profile",
      profile_user: user,
      friends: friends,
    });
  } catch (error) {
    console.log("Error in displaying User profile", error);
  }
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
  } catch (error) {
    console.log("Error in signing up:", error);
    return res.redirect("back");
  }
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (error) {
        if (error) {
          console.log("Multer Error:", error);
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
  req.logout(function (error) {
    if (error) {
      console.log("Error in logging out:", error);
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
  let user = await User.findOne({ email: req.body.email });
  let token = await Token.create({ isValid: true, user: user });
  let job = queue.create("reset", token).save(function (error) {
    if (error) {
      console.log("error in creating queue", error);
      return;
    }
  });
  res.render("reset_email_sent", {
    title: "Mail Inbox"
  });
};

//render the update password page
module.exports.changePassword = async function (req, res) {
  let token = await Token.findById(req.params.id);
  if (!token || token.isValid == false) {
    res.render("user_sign_in", {
      title: "signIn",
    });
    return;
  } else {
    // const userId =  new mongoose.Types.ObjectId(req.params.id);
    // console.log(typeof (userId));

    let token = await Token.findByIdAndUpdate(req.params.id, { isValid: true });
    // let user = await User.findById(token.user);
    // console.log(user,'usercheck');
    res.render("changePassword", {
      title: "changePassword",
      user: token.user,
    });
  }
};

module.exports.updatePassword = async function (req, res) {
  const userId = new mongoose.Types.ObjectId(req.params.id);

  // let user = await User.findById(userId);

  const user = await User.findOne({ _id: userId });

  try {
    if (req.body.password != req.body.confirm_password) {
      //console.log("password not matching");
      //console.log(req.body.password, req.body.confirm_password);
      return res.redirect("back");
    }
    // console.log(req.params.id,'params')
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
      res.render("user_sign_up", {
        title: "signUp",
      });
      return;
    } else {
      await User.findByIdAndUpdate(user.id, { password: req.body.password });
      res.render("user_sign_in", {
        title: "SignIn",
      });
    }
  } catch (error) {
    console.log("error ", error);
    return;
  }
};
