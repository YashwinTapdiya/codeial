const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");

// module.exports.home = function(req, res){
//    // console.log(req.cookies);
//   //  res.cookie('user_id' , 30);
//     return res.render('home' ,{
//         title: "Home"
//     })
//     //return res.end('<h1>Express is up for InstaBook!</h1>')
// }

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
    //console.log(friends);
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
  } catch (err) {
    console.log("Error", err);
  }
};
