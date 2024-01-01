const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
    .then(post => {
        return res.redirect('back');
    })
    .catch(err => {
        console.log("Error in creating a post", err);
        return;
    });
};

module.exports.destroy = function(req, res) {
    Post.deleteOne({ _id: req.params.id, user: req.user.id })
      .then(() => {
        Comment.deleteOne({ post: req.params.id }, function(err) {
          if (err) {
            console.log('Error in deleting comments', err);
            return;
          }
          return res.redirect('back');
        });
      })
      .catch(err => {
        console.log('Error in deleting post', err);
        return res.redirect('back');
      });
  };
  