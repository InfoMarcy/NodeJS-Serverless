const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GoogleUser } = require("../model/googleUserModel");

// for username and password login
const LocalStrategy = require("passport-local").Strategy;

const config = require("config");
const GOOGLE_CLIENT_ID = config.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = config.get("GOOGLE_CLIENT_SECRET");

//serialize users to save to cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserialize users to get from cookies
passport.deserializeUser((id, done) => {

  GoogleUser.findById(id).then(user => {
    done(null, user);
  });

});
// get the user from google login
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
      // check if user exist on our database
      GoogleUser.findOne({
        googleId: profile.id
      }).then(currentUser => {
        if (currentUser) {
          // already has the user
          console.log("User is : ", currentUser);
          //serialize the user
          done(null, currentUser);
        } else {
          // create a new User
          new GoogleUser({
            username: profile.displayName,
            googleId: profile.id
          })
            .save()
            .then(newuser => {
              console.log("new User Created: " + newuser);
              //serialize the user
              done(null, newuser);
            });
        }
      });
    }
  )
);
