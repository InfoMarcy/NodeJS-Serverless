var JwtStrategy = require('passport-jwt').Strategy,
 ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../model/user');
var Client = require('../model/client');
var Token = require('../model/token');
var JwtBearerStrategy = require('passport-http-jwt-bearer');
var BasicStrategy = require('passport-http').BasicStrategy;
const config = require('config');
const passport = require('passport');

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.get('SECRET_KEY');
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
    
    passport.use('basic-strategy', new BasicStrategy(
  function(username, password, callback) {
    
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }
      // Success
      return callback(null, client);
    });
  }
));
    
    passport.use(new JwtBearerStrategy(
    config.get('SECRET_KEY'),
   function(token, done) {
     Token.findById(token._id, function (err, user) {
       
       if (err) { return done(err); }
       if (!user) { return done(null, false); }
     //  console.log(user);
       return done(null, user, token);
     });
   }
 ));
 
exports.isBearerAuthenticated = passport.authenticate('jwt-bearer', {session: false});

exports.isAuthenticated = passport.authenticate(['jwt'], {session: false});

exports.isClientAuthenticated = passport.authenticate('basic-strategy', { session : false });