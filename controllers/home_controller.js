const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.home = async function (req, res) {
  try {
    let post = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "likes",
        },
      })
      .populate("likes");

    let friends = await Friendship.find({ from_user: req.user });

    for (let i = 0; i < friends.length; i++) {
      await friends[i].populate("to_user");
    }

    let users = await User.find({});

    return res.render("home", {
      title: "InstaBook | Home",
      posts: post,
      all_users: users,
      friends: friends,
    });
  } catch (error) {
    console.log("Error in rendering home page", error);
  }
};
