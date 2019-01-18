//Mongo Db
const mongoose = require("mongoose");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("db");
const config = require("config");

module.exports = function() {
  const db = config.get("db");

  //Connect to MongoDb
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => logger.info(`Connected to ${db}....`))
    .catch(err => logger.error(`Could not connect  to ${db}..`, err));
};