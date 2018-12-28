//Mongo Db
const mongoose = require("mongoose");
//working with log files
const winston = require("winston");
const config = require("config");

module.exports = function() {
  const db = config.get("db");

  //Connect to MongoDb
  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to ${db}....`))
    .catch(err => winston.error(`Could not connect  to ${db}..`, err));
};