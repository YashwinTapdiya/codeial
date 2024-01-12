const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comment_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function(req, res) {
  try {
    const post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });

      post.comments.push(comment);
      await post.save();
      comment = await comment.populate('user','name email');
      //commentsMailer.newComment(comment);
      let job = queue.create('emails',comment).save(function(err){
        if(err){
          console.log('Error insending to the queue',err);
          return;
        }
        console.log('job enqueued',job.id);
      });
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
