// load the express framework module
const express = require("express");
const app = express(); // call the express function which return an object
const config = require("config");


const https = require("https");
const fs = require("fs");
const getRuta = require("./middleware/getRuta");

var options = {
  key: fs.readFileSync(getRuta.getRuta("ssl", "localhost.key")),
  cert: fs.readFileSync(getRuta.getRuta("ssl", "localhost.cert")),
  requestCert: false,
  rejectUnauthorized: false
};


require("./controller/logsController")();
require("./controller/routesController")( app);

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("index");

// Environment variable
const port = process.env.PORT || 3000; //listen on a given port
const server = app.listen(port, () =>
  logger.info(
    `La applicacion ${config.get(
      "name"
    )} esta corriendo en el puerto: ${port} y en el ambiente de: ${app.get(
      "env"
    )}.`
  )
);

module.exports = server;
