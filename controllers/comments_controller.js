const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");
const commentsMailer = require("../mailers/comment_mailer");
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");

module.exports.create = async function (req, res) {
  try {
    // 'req.body.post' , here 'post' is the name of hidden input in comment-form
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });

      // adding comment to the post (comment array defined in postSchema)
      post.comments.push(comment);
      await post.save();

      // populating 'user' (with 'name' & 'email' keys) in 'comment' everytime a new comment is created
      comment = await comment.populate("user", "name email");
      //commentsMailer.newComment(comment);
      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          console.log("Error insending to the queue", err);
          return;
        }
        console.log("job enqueued", job.id);
      });
      req.flash("success", "Comment published!");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("Error in creating comment to post", err);
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.redirect("back");
    }

    if (comment.user.toString() === req.user.id) {
      let postId = comment.post;

      await comment.deleteOne();

      // important: we need to update the comments array in the postSchema
      // $pull is an inbuilt function of mongoose
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // destroy the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      req.flash("success", "Comment deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this comment!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", err);
    return res.redirect("back");
  }
};
