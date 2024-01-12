const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'InstaBook'
}

passport.use(new JWTStrategy(opts, async function(jwtPayLoad,done){

    try {
        const user = await User.findById(jwtPayLoad._id);
        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    } catch (error) {
        console.log('Error in finding User from JWT',error);
    }

}));

module.exports = passport;

