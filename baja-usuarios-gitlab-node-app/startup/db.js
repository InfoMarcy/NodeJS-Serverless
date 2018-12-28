//Mongo Db
const mongoose = require("mongoose");
const config = require("config");

//working with log files
const log4js = require('log4js');
const logger = log4js.getLogger("db");

module.exports = function() {
  const db = config.get("db");

  //Connect to MongoDb
  mongoose
    .connect(db)
    .then(() => logger.info(`Connected to ${db}....`))
    .catch(err => logger.info(`Could not connect  to ${db}..`, err));
};