const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//update passport-local strategy code to use the promise-based syntax

// Configure the local strategy for passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async function(req,email,password,done){
      try {
        // Find the user using the email
        const user = await User.findOne({email: email});

        if(!user || user.password != password){
          // Invalid credintials
          return done(null,false);
        }
        //valid user
        return done(null,user);
      } catch (error) {
        console.log("Error in passport-local strategy:",error);
        return done(error);
      }
    }
  )
);

// Serialize the user to store in the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport; 