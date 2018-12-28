//library for working with  logs
const winston = require("winston");
//require("winston-mongodb");
//library for working with async errors
require("express-async-errors");

module.exports = function() {
  // create a new transport to store the log on a file
  winston.add(new winston.transports.File({ filename: "bazdigital_logs.log" }));
  
  //winston.add(
  //  new winston.transports.MongoDB({
  //    db: "mongodb://localhost/nodejs_db",
  //    level: "info"
  //  })
 //);

  //helper method on winston
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};