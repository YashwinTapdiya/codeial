const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
  try {
    const post = await Post.findById(req.body.post);
    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });

      post.comments.push(comment);
      await post.save();

      return res.redirect('/');
    }
  } catch (err) {
    console.log("Error in creating comment to post", err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.redirect('back');
    }

    if (comment.user.toString() === req.user.id) {
      const postId = comment.post;

      await comment.deleteOne();

      await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    console.log(err);
    return res.redirect('back');
  }
};
