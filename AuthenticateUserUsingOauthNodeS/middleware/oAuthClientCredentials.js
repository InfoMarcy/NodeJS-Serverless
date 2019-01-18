const dateFormat = require("dateformat");
const now = new Date();
const mongoose = require("mongoose");
const crypto = require("crypto-js");
const config = require("config");

module.exports = {
  generarClientId: function() {
    return new mongoose.Types.ObjectId();
  },

  generarClientSecret: function() {
    let time_milisec = new Date(
      parseInt(dateFormat(now, "yyyyMMddHHmmssS"))
    ).getTime();

    const pass =
      crypto.SHA256(time_milisec).toString() +
      crypto.SHA256(new mongoose.Types.ObjectId()).toString() +
      config.get("SECRET_KEY");
    return crypto.SHA256(pass).toString();
  }
};
