const express = require("express");
//middleware for working with errore
const error = require("../middleware/error");
const cors = require('cors')

const bloquearUsuarioGit = require("../routes/bloquearUsuarioRoute"); // block usuario
const desbloquearUsuarioGit = require("../routes/desbloquearUsuarioRoute"); // unblock usuario
const  oAuth2Route = require('../routes/oAuth2Route');

//Logs
const log4js = require("log4js");
const logger = log4js.getLogger();

// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");

module.exports = function(app) {
  app.use(express.json()); // enable json req.body
  app.use(helmet());
  app.use("/banca_digital/gitlab/v1/bloquear/usuario", bloquearUsuarioGit);
  app.use(
    "/banca_digital/gitlab/v1/desbloquear/usuario",
    desbloquearUsuarioGit
  );

    app.use(
    "/oauth2",
    oAuth2Route
  );
  app.use(
    log4js.connectLogger(logger, {
      level: log4js.levels.INFO,
      format: ":method :url"
    })
  );

  app.use(cors());
  // to handle the errors
  app.use(error);


};


