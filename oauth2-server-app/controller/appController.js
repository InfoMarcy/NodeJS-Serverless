const express = require("express");
const config = require("config");
//Logs
const log4js = require("log4js");
const logger = log4js.getLogger();
const registerRoute = require('../routes/registerRoute');
const oauth2Routes = require('../routes/oauth2Routes');
const session = require('express-session');
// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");

module.exports = function (app) {
    app.locals.title = config.get("name");
    app.locals.pretty = true;
    app.use(express.json()); // enable json req.body
    app.use(helmet());

    app.use("/oauth", registerRoute);
    app.use("/oauth2", oauth2Routes);


    app.use(
        log4js.connectLogger(logger, {
            level: log4js.levels.INFO,
            format: ":method :url"
        })
    );
    // Set view engine to ejs
    app.set('view engine', 'ejs');

    // Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Use express session support since OAuth2orize requires it
app.use(session({
    secret: config.get('cookieKey'),
    saveUninitialized: true,
    resave: true
  }));

};