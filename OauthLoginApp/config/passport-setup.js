const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const {User} = require('../model/user_model');


const config = require("config");
const GOOGLE_CLIENT_ID = config.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = config.get("GOOGLE_CLIENT_SECRET");

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, cb) {
   
   // create a new User
    new User({
       username: profile.displayName,
       googleId: profile.id
   }).save().then((newuser) => {
       console.log('new User Created: ' + newuser);
   });

    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // }).save();


  }
));