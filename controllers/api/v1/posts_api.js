const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){
    const post = await Post.find({});
    return res.status(200).json({
        message: "List of posts",
        posts: post
    })
}

module.exports.destroy = async function(req,res){
    try {
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.deleteOne();
            await Comment.deleteMany({post: req.params.id});

            res.status(200).json({
                message: "Post and comments deleted"
            });
        }else{
            return res.status(401).json({
                message: "You cannot delete this post"
            });
        }
      } catch (error) {
        console.log("Error in deleting comments",error);
        return res.status(501).json({
            message: "Internal sever problem"
        })
      }
}