//Cifrado
const crypto = require("crypto-js");
module.exports = {
  //valida la contraseña contra el hash
  hashPassword: function(pass) {
    return crypto.SHA256(pass).toString();
  },

  validatePassword: function(pass1, pass2) {
    if (pass1.toString().trim() === pass2.toString().trim()) {
      return true;
    } else {
      return false;
    }
  },
};
