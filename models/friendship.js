const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema(
  {
    //the user who sen this requst
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //the user who accepted this request
    user_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
