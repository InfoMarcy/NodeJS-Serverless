//Mongo Db
const mongoose = require("mongoose");

module.exports = function() {
  const db = 'mongodb://localhost/users_db';
  //Connect to MongoDb
  mongoose
    .connect(db)
    .then(() => console.log(`Connected to ${db}....`))
    .catch(err => console.error(`Could not connect  to ${db}..`, err));
};