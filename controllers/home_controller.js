const Post = require('../models/post');

module.exports.home = function(req, res){
   // console.log(req.cookies);
  //  res.cookie('user_id' , 30);
    return res.render('home' ,{
        title: "Home"
    })
    //return res.end('<h1>Express is up for InstaBook!</h1>')
}

//by this we can add more actions syntax
// module.exports.actionName = function(req, res){}

// this query will return all the posts
//const Post = require('../models/post');

// module.exports.home = function(req, res) {
//     Post.find({})
//         .exec()
//         .then(posts => {
//             return res.render('home', {
//                 title:  "InstaBook | Home",
//                 posts: posts
//             });
//         })
//         .catch(err => {
//             console.log("Error in fetching posts", err);
//             return res.redirect('back');
//         });
// };


//populate the user of each post
// module.exports.home = function(req, res) {
//     Post.find({})
//         .populate('user')
//         .exec()
//         .then(posts => {
//             return res.render('home', {
//                 title: "InstaBook | Home",
//                 posts: posts
//             });
//         })
//         .catch(err => {
//             console.log("Error in fetching posts", err);
//             return res.redirect('back');
//         });
// };

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
        return res.render('home', {
          title: "InstaBook | Home",
          posts: posts
        });
      })
      .catch(err => {
        console.log("Error in fetching posts", err);
        return res.redirect('/');
      });
  };
  