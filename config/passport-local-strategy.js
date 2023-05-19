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
    async function(req, email, password, done) {
      try {
        // Find the user using the email
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
          // Invalid credentials
          return done(null, false);
        }

        // Valid user
        return done(null, user);
      } catch (err) {
        console.log('Error in passport-local strategy:', err);
        return done(err);
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
