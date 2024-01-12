const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy fro google login
passport.use(new googleStrategy({
        clientID: "-r4bhl8tfdsp45glo584e0h7f0tmjn6h2.apps.googleusercontent.com",
        clientSecret: "",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },

    async function(accessToken,refreshToken,profile,done){
        try {
            //find a user
            const user = await User.findOne({email: profile.emails[0].value});

            if(user){
                //if find then return
                return done(null,user);
            }else{
                //if not found we create a new user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null,newUser);
            }

        } catch (error) {
            console.log('Error in google strategy-passport',error);
        }
    }
));