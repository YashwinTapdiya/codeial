const Post = require('../models/post');
const User = require('../models/user');


// module.exports.home = function(req, res){
//    // console.log(req.cookies);
//   //  res.cookie('user_id' , 30);
//     return res.render('home' ,{
//         title: "Home"
//     })
//     //return res.end('<h1>Express is up for InstaBook!</h1>')
// }

module.exports.home = async function(req,res){
  try{
    let post = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate:{
        path: 'user'
      },
      populate:{
        path: 'likes'
      }
    })
    .populate('likes');

    let users = await User.find({});

    return res.render('home',{
      title: "InstaBook | Home",
      posts: post,
      all_users: users
    })
  }catch(err){
    console.log("Error",err);
  }
};