const express = require("express");
const  authRoute = require("../routes/authRoute");

//Logs
const log4js = require("log4js");
const logger = log4js.getLogger();

const passportSetup =  require('../config/passport-setup');

// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");

module.exports = function(app) {
  app.use(express.json()); // enable json req.body
  app.use(helmet());


    app.use(
      "/auth",
      authRoute
    );

    
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
