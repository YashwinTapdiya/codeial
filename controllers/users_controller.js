const User = require('../models/user');


module.exports.profile = function(req, res){
  User.findById(req.params.id)
  .then((user)=>{
    return res.render('user_profile', {
      title: 'User Profile',
      profile_user: user
    })
  })
  .catch((err)=> console.log(err));
    
}


// render the sign up page
module.exports.signUp = function(req, res){
  if(req.isAuthenticated()){
   return res.redirect('/users/profile');
  }
    return res.render('user_sign_up', {
        title: "InstaBook | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
  if(req.isAuthenticated()){
     return res.redirect('/users/profile');
  }
    return res.render('user_sign_in', {
        title: "InstaBook | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res) {
    try {
      if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
      }
  
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const newUser = await User.create(req.body);
        return res.redirect('/users/sign-in');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.log('Error in signing up:', err);
      return res.redirect('back');
    }
  };

module.exports.update = function(req,res){
  if(req.user.id == req.params.id){
    User.findByIdAndUpdate(req.params.id,req.body)
    .then((user)=> res.redirect('back'))
    .catch((err)=> console.log(err));
  }
  else{
    return res.status(401).send('Unauthorized');
  }
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
  req.flash('success','Logges in Successfully');
  return res.redirect('/');
}

//sign out
module.exports.destorySession = function(req, res){
  req.logout(function(err){
    if(err){
      console.log('Error in logging out:', err);
      return;
    }
  });
  req.flash('success','You have logged out!');

  return res.redirect('/');
};

