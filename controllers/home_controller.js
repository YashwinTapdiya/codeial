const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = function(req, res){
   // console.log(req.cookies);
  //  res.cookie('user_id' , 30);
    return res.render('home' ,{
        title: "Home"
    })
    //return res.end('<h1>Express is up for InstaBook!</h1>')
}

module.exports.home = function(req, res) {
    Post.find({})
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })
      .exec()
      .then(posts => {
        User.find({}).then((user)=>{
          return res.render('home', {
            title: "InstaBook | Home",
            posts: posts,
            all_users: user
          });
        })
        
      })
      .catch(err => {
        console.log("Error in fetching posts", err);
        return res.redirect('/');
      });
  };
  