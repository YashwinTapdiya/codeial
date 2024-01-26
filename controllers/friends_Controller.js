const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.toggleFriend = async function (req, res) {
  try {
    let deleted = false;
    let existing = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.query.id,
    });

    if (existing) {
      // If the friendship exists, remove it
      let user1 = await User.findById(req.user.id);
      let user2 = await User.findById(req.query.id);

      // Check if the friendship exists in user1's friendships array before pulling
      if (user1.friendships.includes(existing._id)) {
        user1.friendships.pull(existing._id);
      }

      // Check if the friendship exists in user2's friendships array before pulling
      if (user2.friendships.includes(existing._id)) {
        user2.friendships.pull(existing._id);
      }

      existing.deleteOne();
      user1.save();
      user2.save();
      deleted = true;
    } else {
      // If the friendship does not exist, create it
      let newFriend = await Friendship.create({
        from_user: req.user.id,
        to_user: req.query.id,
      });

      let user1 = await User.findById(req.user.id);
      let user2 = await User.findById(req.query.id);

      user1.friendships.push(newFriend._id);
      user2.friendships.push(newFriend._id);
      user1.save();
      user2.save();
    }

    return res.status(200).json({
      message: "Request successful",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
