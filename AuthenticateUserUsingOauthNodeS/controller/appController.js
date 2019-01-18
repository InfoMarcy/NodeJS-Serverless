const express = require("express");
const cookieParser = require("cookie-parser");
const authRoute = require("../routes/authRoute");
const profileRoute = require("../routes/profileRoute");
const config = require("config");
const oauthserver = require('oauth2-server');
const oAuthModels = require('../model/oAuthModel');
const oAuthRoute = require('../routes/oAuthRoute');
//Logs
const log4js = require("log4js");
const logger = log4js.getLogger();
const path = require('path');
/// passport
const passport = require("passport");
const passportSetup = require("../config/passport-setup");
const cookieSession = require("cookie-session");

// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");

module.exports = function(app) {

  app.locals.title = config.get('name');
  app.locals.pretty = true;
  app.use(express.json()); // enable json req.body
  app.use(helmet());

  // set the cookies using passport
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000, // day
      keys: [config.get("cookieKey")] //key to encript the cookie
    })
  );
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());
  app.use(require("body-parser").urlencoded({ extended: true }));

  //initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

    //============================= Oauth =============================//
    app.oauth = oauthserver({
      model: oAuthModels,
      grants: ['password', 'authorization_code', 'refresh_token']
    });
  
  
     app.all('/oauth/token', app.oauth.grant());
  
    app.all('/oauth/authorize', app.oauth.authCodeGrant(function (req, next) {
      // The first param should to indicate an error
      // The second param should a bool to indicate if the user did authorise the app
      // The third param should for the user/uid (only used for passing to saveAuthCode)
      next(null, true, '585273a465f7eb444462eb16', null);
    }));
    
    app.get('/', app.oauth.authorise(), function (req, res) {
      res.send('Secret area');
      });
  
  
      app.use(app.oauth.errorHandler());
    //============================= Oauth =============================//
  

  app.use("/auth", authRoute);
  app.use("/profile", profileRoute);
  app.use("/oauth", oAuthRoute);

  app.use(
    log4js.connectLogger(logger, {
      level: log4js.levels.INFO,
      format: ":method :url"
    })
  );

  // set view engine
  app.set("view engine", "ejs");
  // create home route
  app.get("/", (req, res) => {
    res.render("home");
  });
};

//https://media.readthedocs.org/pdf/oauth2-server/latest/oauth2-server.pdf