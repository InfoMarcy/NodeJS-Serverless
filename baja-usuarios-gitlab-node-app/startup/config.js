const config = require("config");
module.exports = function() {
  // check if the jwtPrivateKey is present
  if (!config.get("private_token")) {
    throw new Error("FATAL ERROR: private_token is not defined.");
  }
};