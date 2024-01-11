const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id
    });
    return res.redirect('back');
  } catch (error) {
    console.log("Error in creating a post", error);
    return;
  }
};

module.exports.destroy = async function(req, res) {
  try {
    await Post.deleteOne({
      _id: req.params.id,
      user: req.user.id
    });
    await Comment.deleteOne({
      ppost: req.params.id
    });
    return res.redirect('back');
  } catch (error) {
    console.log("Error in deleting comments",error);
    return res.redirect('back');
  }
};